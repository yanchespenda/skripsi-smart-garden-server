import { PumpAttemp } from '@base/core/entities/pump-attemp.entity';
import { User } from '@base/core/entities/user.entity';
import { toUserDto } from '@base/mapper';
import { ACTION_CONFIG } from '@base/universal-config';
import { ActionMessage } from '@base/universal-interface';
import { comparePasswords } from '@base/utils';
import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PumpSettingAutomation, PumpSettingAutomationParameter } from '../api/action/interface/pump.setting.interface';
import { McuToken } from '../auth/interfaces/mcu.token.interface';
import { PasswordUserDto } from './dto/password.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { UserDto } from './dto/user.dto';
import { LoginUserDto } from './dto/user.login.dto';
import { DateTime } from 'luxon';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(PumpAttemp) private pumpAttempRepository: Repository<PumpAttemp>,
  ) { }

  async findOne(options?: object): Promise<UserDto> {
    const user =  await this.userRepository.findOne(options);    
    return toUserDto(user);  
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {    
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
        throw new UnauthorizedException('User not found');    
    }

    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
        throw new UnauthorizedException('Invalid credentials');    
    }

    return toUserDto(user);  
  }

  async findByPayload({ username }: any): Promise<UserDto> {
    return await this.findOne({ where:  { username } });  
  }

  async findByMcuToken(mcuToken: string): Promise<UserDto> {
    return await this.findOne({ where:  { mcuToken } });  
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {    
    const { username, password } = userDto;
    
    const userInDb = await this.userRepository.findOne({ 
      where: { username } 
    });
    if (userInDb) {
      throw new BadRequestException('User already exists');    
    }
    
    const user: User = this.userRepository.create({ username, password });
    await this.userRepository.save(user);
    return toUserDto(user);  
  }

  async createMcuToken(userDto: UserDto): Promise<UserDto> {
    const { username } = userDto;
    const userInDb = await this.userRepository.findOne({ 
      where: { username } 
    });

    if (!userInDb) {
      throw new BadRequestException('User does not exists');    
    }

    userInDb.mcuToken = this.makeid();
    return await this.userRepository.save(userInDb);
  }

  async changePassword(userDto: UserDto, passwordUserDto: PasswordUserDto): Promise<ActionMessage> {
    const areEqual = await comparePasswords(userDto.password, passwordUserDto.password);

    if (!areEqual) {
      throw new UnauthorizedException('Invalid credentials');    
    }

    const { id } = userDto;
    const userInDb = await this.userRepository.findOne({ 
      where: { id } 
    });

    if (!userInDb) {
      throw new BadRequestException('User does not exists');    
    }

    userInDb.password = passwordUserDto.passwordNew;
    await this.userRepository.save(userInDb)
    return {
      message: 'Password changed'
    }
  }

  async increaseUserPumpAttemp(userDto: UserDto): Promise<any> {
    const pumpAttemp: PumpAttemp = this.pumpAttempRepository.create({ user: userDto.id});
    return this.pumpAttempRepository.save(pumpAttemp);
  }

  async findUserPumpAttemp(userDto: UserDto): Promise<any> {
    return await this.pumpAttempRepository.findAndCount({
      where: {
        user: userDto.id
      }
    });
  }

  async deleteUserPumpAttemp(userDto: UserDto): Promise<any> {
    return await this.pumpAttempRepository.delete({
      user: userDto.id
    });
  }

  async findUserActionParam(userDto: UserDto): Promise<any> {
    const userParameter = userDto.automationParameter || null;
    let userParameterResult: PumpSettingAutomationParameter[] = this.userParameterDefault();
    if (userParameter) {
      const userParameterDecode: PumpSettingAutomationParameter[] = JSON.parse(userParameter);
      if (userParameterDecode) {
        userParameterResult = userParameterDecode;
      }
    }

    return userParameterResult;
  }

  async saveUserAutomation(
    userDto: UserDto,
    {
      automationAttemp,
      automationEnable,
    }: PumpSettingAutomation,
    parameter: PumpSettingAutomationParameter[]
  ): Promise<boolean> {
    const userInDb = await this.userRepository.findOne({ 
      where: { id: userDto.id } 
    });

    if (!userInDb) {
      throw new UnauthorizedException('User not found');
    }

    userInDb.automationAttemp = automationAttemp;
    userInDb.automationEnable = automationEnable;
    userInDb.automationParameter = JSON.stringify(parameter);
    await this.userRepository.save(userInDb);
    return true;
  }

  async findUserAction(userDto: UserDto): Promise<any> {
    const userParameterResult = await this.findUserActionParam(userDto);

    return {
      automationEnable: userDto.automationEnable,
      automationParameter: userParameterResult,
      automationAttemp: userDto.automationAttemp,
      lastAction: userDto.lastAction,
      routineTaskEnable: userDto.routineTaskEnable,
      routineTaskSkipIfExceedParameter: userDto.routineTaskSkipIfExceedParameter,
      routineTaskTime: userDto.routineTaskTime
    }
  }

  async updateLastAction(mcuToken: string): Promise<any> {
    const userDto: UserDto = await this.findOne({ where:  { mcuToken } });
    if (userDto) {
      userDto.lastAction = DateTime.local().toString();
      await this.userRepository.save(userDto)
    }
    return true;
  }

  private makeid(length = 25) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
      charactersLength)));
    }
    return result.join('');
  }

  private userParameterDefault(): any {
    const sensors = [];
    const sensorList = ACTION_CONFIG.SETTING_AUTOMATION_SENSOR_VALIDATION;
    sensorList.forEach(sensor => {
      sensors.push({
        enable: false,
        sensor: sensor,
        value: 0
      });
    });
    return sensors;
  }
}
