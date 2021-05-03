import { User } from '@base/core/entities/user.entity';
import { toUserDto } from '@base/mapper';
import { ActionMessage } from '@base/universal-interface';
import { comparePasswords } from '@base/utils';
import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { McuToken } from '../auth/interfaces/mcu.token.interface';
import { PasswordUserDto } from './dto/password.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { UserDto } from './dto/user.dto';
import { LoginUserDto } from './dto/user.login.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  makeid(length = 25) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
      charactersLength)));
    }
    return result.join('');
  }

}
