import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { MqttHandlerService } from './mqtt-handler.service';
import { UserService } from '../user/user.service';

import {
  MQTT_TOPIC_DHT_HUMIDITY,
  MQTT_TOPIC_DHT_TEMPERATURE,
  MQTT_TOPIC_SOIL_MOISTURE,
  MQTT_TOPIC_SOIL_TEMPERATURE
} from '@constants/index';

@Controller('mqtt-handler')
export class MqttHandlerController {

  /**
   * Create logger instance
   */
  private readonly logger = new Logger(MqttHandlerController.name);

  /**
   * Constructor
   * 
   * @param mqttHandlerService MQTT handler services
   */
  constructor(
    private mqttHandlerService: MqttHandlerService,
    private userService: UserService,
  ) { }

  /**
   * MQTT payload validation
   * 
   * @param payload Object
   * @returns boolean
   */
  private payloadValidation(payload: any): boolean {
    if (payload?.token && payload?.value) {
      return true;
    }
    return false;
  }

  /**
   * DHT-11 Sensor Humadity
   * 
   * @param data Object
   * @param context MqttContext
   */
  @MessagePattern(MQTT_TOPIC_DHT_HUMIDITY)
  getSensorDHTHumadity(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    if (this.payloadValidation(data)) {
      this.mqttHandlerService.saveDHTHumidity(data.token, data.value);
    }
  }

  /**
   * DHT-11 Sensor Temperature
   * 
   * @param data Object
   * @param context MqttContext
   */
  @MessagePattern(MQTT_TOPIC_DHT_TEMPERATURE)
  getSensorDHTTemperature(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    if (this.payloadValidation(data)) {
      this.mqttHandlerService.saveDHTTemperature(data.token, data.value);
    }
  }

  /**
   * DS18B20 Sensor Temperature
   * 
   * @param data Object
   * @param context MqttContext
   */
  @MessagePattern(MQTT_TOPIC_SOIL_TEMPERATURE)
  getSensorSoilTemperature(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    if (this.payloadValidation(data)) {
      this.mqttHandlerService.saveSoilTemperature(data.token, data.value);
    }
  }

  /**
   * Soil Moisture Sensor
   * 
   * @param data Object
   * @param context MqttContext
   */
  @MessagePattern(MQTT_TOPIC_SOIL_MOISTURE)
  getSensorSoilMoisture(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    if (this.payloadValidation(data)) {
      this.mqttHandlerService.saveSoilMoisture(data.token, data.value);
    }
  }

  /**
   * 
   * 
   */
  @MessagePattern('esp.action/+')
  getEspAction(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    if (data == 1) {
      const mcuToken = context.getTopic().toString().replace('esp.action/', '');
      this.userService.updateLastAction(mcuToken);
    }

    // console.log(`Subject: ${context.getSubject()}`); // e.g. "time.us.east"
    // return new Date().toLocaleTimeString(...);
  }
}
