import { UserDto } from '@base/modules/user/dto/user.dto';
import { ActionHistory } from '@base/modules/user/interface';
import { UserService } from '@base/modules/user/user.service';
import { ACTION_CONFIG } from '@base/universal-config';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Validator, Schema } from 'jsonschema';
import { TelegramService } from 'nestjs-telegram';
import { NotificationField, NotificationModels } from './interface/pump.action.interface';
import { PumpSettingAutomation, PumpSettingAutomationParameter, PumpSettingRoutimeDto } from './interface/pump.setting.interface';

@Injectable()
export class ActionService {
  constructor(
    private userService: UserService,
    private readonly telegram: TelegramService
  ) {}

  async setting(userDto: UserDto): Promise<any> {
    return await this.userService.findUserAction(userDto);
  }

  async history(userDto: UserDto, page: number): Promise<ActionHistory> {
    return await this.userService.historyPumpAction(userDto, page);
  }

  async getSettingAutomation(userDto: UserDto): Promise<any> {
    return await this.userService.findUserActionAutomation(userDto);
  }

  async getSettingRoutine(userDto: UserDto): Promise<any> {
    return await this.userService.findUserActionRoutine(userDto);
  }

  async saveSettingAutomation(userDto: UserDto, body: PumpSettingAutomation): Promise<any> {
    if (body.automationParameter) {
      const sensorList = ACTION_CONFIG.SETTING_AUTOMATION_SENSOR_VALIDATION;
      const ParameterSchema: Schema = {
        id: '/ParameterSchema',
        type:'array',
        items: {
          properties: {
            enable: {
              type: 'boolean'
            },
            sensor: {
              type: 'string',
              enum: [
                ...sensorList
              ]
            },
            value: {
              type: 'number'
            },
            operator: {
              type: 'string',
              enum: [
                '<=',
                '>='
              ]
            }
          },
          additionalProperties: false,
          required: ['enable', 'sensor', 'value', 'operator']
        },
        title: 'Sensor Parameter'
      };
      const paramterDecode: PumpSettingAutomationParameter[] = JSON.parse(body.automationParameter);
      if (paramterDecode) {
        const jsonValidator = (new Validator()).validate(paramterDecode, ParameterSchema);
        if (!jsonValidator.valid || !this.uniqueParameterSensor(paramterDecode)) {
          throw new UnprocessableEntityException('Parameter does not valid');
        }

        if (!this.validationParameterSensorValue(paramterDecode)) {
          throw new UnprocessableEntityException('Sensor value does not valid');
        }

        const action = await this.userService.saveUserAutomation(userDto, body, paramterDecode);
        if (!action) {
          throw new UnprocessableEntityException('Something went wrong');
        }
        return {
          status: 'OK'
        }
      }
    }

    throw new UnprocessableEntityException('Parameter does not valid');
  }

  async saveSettingRoutime(userDto: UserDto, body: PumpSettingRoutimeDto): Promise<any> {
    try {
      const action = await this.userService.saveUserRoutine(userDto, body);
      if (!action) {
        throw new UnprocessableEntityException('Something went wrong');
      }
    } catch (error) {
      throw new UnprocessableEntityException(error || error.message || 'Something went wrong');
    }

    return {
      status: 'OK'
    }
  }

  private uniqueParameterSensor(paramter: PumpSettingAutomationParameter[]): boolean {
    const sensorList = ACTION_CONFIG.SETTING_AUTOMATION_SENSOR_VALIDATION;
    const currentCorrect = [...new Set(paramter.map(val => val.sensor))];
    if (currentCorrect.length === sensorList.length) {
      return true;
    }
    return false;
  }

  private validationParameterSensorValue(paramter: PumpSettingAutomationParameter[]): boolean {
    const sensorList = ACTION_CONFIG.SETTING_AUTOMATION_SENSOR_VALIDATION;
    let resultValidationA = false;
    let resultValidationB = false;
    paramter.forEach(param => {
      // Temperature
      if (param.sensor === sensorList[0]) {
        if (param.value >= 0 && param.value <= 100) {
          resultValidationA = true;
        }
      }
      // Moisture
      else if (param.sensor === sensorList[1]) {
        if (param.value >= 0 && param.value <= 100) {
          resultValidationB = true;
        }
      }
    });
    return resultValidationA && resultValidationB;
  }

  /**
   * Notifications
   */
  async notificationGet(userDto: UserDto): Promise<NotificationModels> {
    try {
      return await this.userService.notificationGet(userDto);
    } catch (error) {
      throw new UnprocessableEntityException(error || error.message || 'Something went wrong');
    }
  }

  async notificationSave(userDto: UserDto, notificationBody: NotificationField): Promise<any> {
    try {
      return await this.userService.notificationSave(userDto, notificationBody);
    } catch (error) {
      throw new UnprocessableEntityException(error || error.message || 'Something went wrong');
    }
  }

  async notificationTelegramInit(userDto: UserDto, userId: number): Promise<boolean> {
    await this.telegram.sendMessage({
      chat_id: userId,
      text: `Hi ${userDto.username}, your account has logged into smart garden system`
    }).toPromise();

    return true;
  }
}
