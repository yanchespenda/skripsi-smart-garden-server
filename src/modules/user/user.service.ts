import { PumpAttemp } from '@base/core/entities/pump-attemp.entity';
import { User } from '@base/core/entities/user.entity';
import { toUserDto } from '@base/mapper';
import { ACTION_CONFIG } from '@base/universal-config';
import { ActionMessage } from '@base/universal-interface';
import { comparePasswords } from '@base/utils';
import { BadRequestException, Inject, Injectable, Logger, OnApplicationBootstrap, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PumpSettingAutomation, PumpSettingAutomationParameter, PumpSettingRoutime } from '../api/action/interface/pump.setting.interface';
import { McuToken } from '../auth/interfaces/mcu.token.interface';
import { PasswordUserDto } from './dto/password.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { UserDto } from './dto/user.dto';
import { LoginUserDto } from './dto/user.login.dto';
import { DateTime } from 'luxon';
import { PumpRoutine } from '@base/core/entities/pump-routine.entity';
import { ClientProxy } from '@nestjs/microservices';
import { MQTT_SERVICE } from '@base/core/constants';
import { ActionHistory, CronData } from '@base/modules/user/interface';
import { SensorSoilMoisture } from '@base/core/entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@base/core/entities/sensor-soil-temperature.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PumpAction } from '@base/core/entities/pump-action.entity';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(PumpAttemp) private pumpAttempRepository: Repository<PumpAttemp>,
    @InjectRepository(PumpAction) private pumpActionRepository: Repository<PumpAction>,
    @InjectRepository(PumpRoutine) private pumpRoutineRepository: Repository<PumpRoutine>,
    @InjectRepository(SensorSoilMoisture) private sensorSoilMoistureRepository: Repository<SensorSoilMoisture>,
    @InjectRepository(SensorSoilTemperature) private sensorSoilTemperatureRepository: Repository<SensorSoilTemperature>,

    private schedulerRegistry: SchedulerRegistry,
    @Inject(MQTT_SERVICE) private mqttClient: ClientProxy,
  ) { }

  async onApplicationBootstrap() {
    await this.routineCronJobRecovery();
  }

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
    const pumpAttemp: PumpAttemp = this.pumpAttempRepository.create({ user: userDto });
    return this.pumpAttempRepository.save(pumpAttemp);
  }

  async findUserPumpAttemp(userDto: UserDto): Promise<number> {
    return await this.pumpAttempRepository.count({
      where: {
        user: userDto.id
      }
    });
  }

  async deleteUserPumpAttemp(userDto: UserDto): Promise<any> {
    return await this.pumpAttempRepository.delete({
      user: userDto
    });
  }

  async handlingUserParameter(userDto: UserDto, attempType: number, sensorValue: number): Promise<void> {
    if (userDto.automationEnable) {

      const sensorList = ACTION_CONFIG.SETTING_AUTOMATION_SENSOR_VALIDATION;
      let dataTemporarySensor: number[] = [-1, -1];
      let dataOperatorSensor: boolean[] = [false, false];

      const userParameterResult = await this.findUserActionParam(userDto);
      userParameterResult.forEach(param => {
        if (param.enable) {
          if (param.sensor === sensorList[0]) {
            dataTemporarySensor[0] = param.value;
            if (param.operator === '>=') {
              dataOperatorSensor[0] = true;
            }
          } else if (param.sensor === sensorList[1]) {
            dataTemporarySensor[1] = param.value;
            if (param.operator === '>=') {
              dataOperatorSensor[1] = true;
            }
          }
        }
      });
  
      let isIncreased = false;
  
      if (attempType === 1 && dataTemporarySensor[0] > -1) {
        if (
          (dataOperatorSensor[0] && dataTemporarySensor[0] >= sensorValue) ||
          (!dataOperatorSensor[1] && dataTemporarySensor[0] <= sensorValue)
        ) {
          isIncreased = true;
        }
      }
  
  
      if (attempType === 2 && dataTemporarySensor[1] > -1) {
        if (
          (dataOperatorSensor[0] && dataTemporarySensor[1] >= sensorValue) ||
          (!dataOperatorSensor[1] && dataTemporarySensor[1] <= sensorValue)
        ) {
          isIncreased = true;
        }
      }
  
      if (isIncreased) {
        const getAttempCount = await this.findUserPumpAttemp(userDto);
        if (getAttempCount < userDto.automationAttemp) {
          await this.increaseUserPumpAttemp(userDto);
        }
      }
  
      const getAttempCount = await this.findUserPumpAttemp(userDto);
      if (getAttempCount >= userDto.automationAttemp) {
        await this.deleteUserPumpAttemp(userDto);
        await this.mqttClient.connect();
        const topic = 'esp.action/' + userDto.mcuToken;
        const payload = [1, 1];
          await this.mqttClient.emit<string, number[]>(topic, payload).toPromise();
      }
    }
  }

  async findUserActionParam(userDto: UserDto): Promise<PumpSettingAutomationParameter[]> {
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

  async saveUserRoutine(
    userDto: UserDto,
    {
      routineEnable,
      routineSkipParamater,
      routineTime
    }: PumpSettingRoutime
  ): Promise<boolean> {

    const rawDate = DateTime.fromISO(routineTime);
    if (!rawDate) {
      throw new BadRequestException('Routine time not valid');
    }

    const getMinutes = rawDate.toFormat('mm');
    const getHours = rawDate.toFormat('HH');

    const userInDb = await this.userRepository.findOne({ 
      where: { id: userDto.id } 
    });

    if (!userInDb) {
      throw new UnauthorizedException('User not found');
    }

    const getRoutine = await this.findUserRoutine(userDto);

    this.getCrons();

    if (routineEnable) {
      const cronName = `routine-${userDto.id}`;
      const cronTime = `00 ${getMinutes} ${getHours} * * *`;

      if (getRoutine) {
        try {
          this.deleteCron(cronName);
        } catch (error) { }

        getRoutine.cronTime = cronTime;
        getRoutine.realTime = routineTime;
        await this.pumpRoutineRepository.save(getRoutine);
      } else {
        const pumproutine: PumpRoutine = this.pumpRoutineRepository.create({
          user: userDto,
          cronTime: cronTime,
          realTime: routineTime
        });
        await this.pumpRoutineRepository.save(pumproutine);
      }

      this.addRoutineCronJob(userDto, cronName, {
        seconds: '00', minutes: getMinutes, hours: getHours
      });
    } else {
      if (getRoutine) {
        await this.pumpRoutineRepository.delete({
          id: getRoutine.id
        });
      }
    }

    userInDb.routineTaskEnable = routineEnable;
    userInDb.routineTaskSkipIfExceedParameter = routineSkipParamater;
    userInDb.routineTaskTime = routineTime;
    await this.userRepository.save(userInDb);


    return true;
  }

  async findUserRoutine({ id }: UserDto): Promise<PumpRoutine> {
    return await this.pumpRoutineRepository.findOne({ where: { user: id } });
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

  async findUserActionAutomation(userDto: UserDto): Promise<any> {
    const userParameterResult = await this.findUserActionParam(userDto);

    return {
      automationEnable: userDto.automationEnable,
      automationParameter: userParameterResult,
      automationAttemp: userDto.automationAttemp
    }
  }

  async findUserActionRoutine(userDto: UserDto): Promise<any> {
    return {
      routineTaskEnable: userDto.routineTaskEnable,
      routineTaskSkipIfExceedParameter: userDto.routineTaskSkipIfExceedParameter,
      routineTaskTime: userDto.routineTaskTime
    }
  }

  async updateLastAction(mcuToken: string): Promise<void> {
    const userDto: UserDto = await this.findOne({ where:  { mcuToken } });
    if (userDto) {
      userDto.lastAction = DateTime.now().toISO();
      await this.userRepository.save(userDto);
    }
  }

  async updatePumpAction(mcuToken: string, actionType: number, from?: number): Promise<void> {
    const userDto: UserDto = await this.findOne({ where:  { mcuToken } });
    if (userDto) {
      if (actionType === 1) {
        userDto.lastAction = DateTime.now().toISO();
        await this.userRepository.save(userDto);
      }

      const actionList = ACTION_CONFIG.NAME;
      const fromList = ACTION_CONFIG.FROM;
      const pumpAction = this.pumpActionRepository.create({
        type: actionType.toString(),
        action: actionList[actionType] || '-',
        user: userDto,
        fromAction: fromList[from] || '-'
      });
      await this.pumpActionRepository.save(pumpAction);
    }
  }

  async historyPumpAction(userDto: UserDto, page: number = 1): Promise<ActionHistory> {
    const take = 10;
    const skip = (take * page) - take;

    const historyAll = await this.pumpActionRepository.count({
      where: {
        user: userDto
      }
    });

    let listHistory: ActionHistory = {
      list: [],
      total: historyAll
    };

    if (historyAll > 0) {
      const histories = await this.pumpActionRepository.find({
        where: {
          user: userDto
        },
        order: {
          id: 'DESC'
        },
        take,
        skip
      });
      

      if (histories) {
        listHistory.list = histories.map(history => {
          return {
            createdAt: history.createdAt,
            action: history.action,
            from: history.fromAction
          }
        });
      }
    }

    return listHistory;
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

  async routineCronJobRecovery(): Promise<void> {
    const routineData = await this.pumpRoutineRepository.find({
      relations: ['user']
    });
    if (routineData) {
      routineData.forEach(job => {
        const userDto = job.user;

        if (userDto.routineTaskEnable) {
          const cronName = `routine-${userDto.id}`;
          try {
            this.deleteCron(cronName);
          } catch (error) { }

          const rawDate = DateTime.fromISO(job.realTime);
          if (rawDate) {
            const getMinutes = rawDate.toFormat('mm');
            const getHours = rawDate.toFormat('HH');

            

            this.addRoutineCronJob(userDto, cronName, {
              seconds: '00', minutes: getMinutes, hours: getHours
            });
          }
        }
      });
    }
  }

  async addRoutineCronJob(userDto: UserDto, name: string, {seconds, hours, minutes}: CronData) {
    const job = new CronJob(`${seconds} ${minutes} ${hours} * * *`, async () => {
      this.logger.warn(`Routine time (${seconds}) seconds, (${minutes}) minutes, (${hours}) hours, for job ${name} to run!`);

      if (userDto.routineTaskEnable) {
        let runRoutine = true;
        if (!userDto.routineTaskSkipIfExceedParameter) {
          const sensorList = ACTION_CONFIG.SETTING_AUTOMATION_SENSOR_VALIDATION;
  
          let dataTemporarySensor: number[] = [-1, -1];
          let dataOperatorSensor: boolean[] = [false, false];
  
          const userParameterResult = await this.findUserActionParam(userDto);
          userParameterResult.forEach(param => {
            if (param.enable) {
              if (param.sensor === sensorList[0]) {
                dataTemporarySensor[0] = param.value;
                if (param.operator === '>=') {
                  dataOperatorSensor[0] = true;
                }
              } else if (param.sensor === sensorList[1]) {
                dataTemporarySensor[1] = param.value;
                if (param.operator === '>=') {
                  dataOperatorSensor[1] = true;
                }
              }
            }
          });
  
          if (dataTemporarySensor[0] > -1) {
            const getLastSoilTemperature = await this.sensorSoilTemperatureRepository.findOne({
              where: {
                user: userDto.id
              },
              order: {
                id: 'DESC'
              }
            });
  
            if (getLastSoilTemperature) {
              if (
                (dataOperatorSensor[0] && dataTemporarySensor[1] >= getLastSoilTemperature.temperature) ||
                (!dataOperatorSensor[1] && dataTemporarySensor[1] <= getLastSoilTemperature.temperature)
              ) {
                runRoutine = false;
              }
            }
          }
  
  
          if (dataTemporarySensor[1] > -1) {
            const getLastSoilMoisture = await this.sensorSoilMoistureRepository.findOne({
              where: {
                user: userDto.id
              },
              order: {
                id: 'DESC'
              }
            });
  
            if (getLastSoilMoisture) {
              if (
                (dataOperatorSensor[0] && dataTemporarySensor[1] >= getLastSoilMoisture.moisture) ||
                (!dataOperatorSensor[1] && dataTemporarySensor[1] <= getLastSoilMoisture.moisture)
              ) {
                runRoutine = false;
              }
            }
          }
  
        }

        if (runRoutine) {
          await this.mqttClient.connect();

          const topic = 'esp.action/' + userDto.mcuToken;
          const payload = [1, 2];

          await this.mqttClient.emit<string, number[]>(topic, payload).toPromise();
        }
      }

    });
  
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  
    this.logger.warn(
      `Job ${name} added for each minute at (${seconds}) seconds, (${minutes}) minutes, (${hours}) hours!`,
    );
  }

  private deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted!`);
  }

  private getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      let next: string;
      try {
        next = value.nextDates().toDate().toString();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }
}
