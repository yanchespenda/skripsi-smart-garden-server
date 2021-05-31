import { UserDto } from '@base/modules/user/dto/user.dto';
import { ActionHistory } from '@base/modules/user/interface';
import { UserService } from '@base/modules/user/user.service';
import { ACTION_CONFIG } from '@base/universal-config';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Validator, Schema } from 'jsonschema';
import { PumpSettingAutomation, PumpSettingAutomationParameter, PumpSettingRoutimeDto } from './interface/pump.setting.interface';

@Injectable()
export class ActionService {
  constructor(
    private userService: UserService,
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
        throw new UnprocessableEntityException('Something went wrong X1');
      }
    } catch (error) {
      throw new UnprocessableEntityException('Something went wrong X2');
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

}
