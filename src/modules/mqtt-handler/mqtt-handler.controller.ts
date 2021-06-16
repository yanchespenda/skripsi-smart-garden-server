import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { MqttHandlerService } from './mqtt-handler.service';
import { UserService } from '../user/user.service';

import {
  MQTT_TOPIC_DHT_HUMIDITY_HANDLER,
  MQTT_TOPIC_DHT_TEMPERATURE_HANDLER,
  MQTT_TOPIC_ESP_ACTION_HANDLER,
  MQTT_TOPIC_SOIL_MOISTURE_HANDLER,
  MQTT_TOPIC_SOIL_TEMPERATURE_HANDLER
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
   * DHT-11 Sensor Humadity
   * 
   * @param data Object
   * @param context MqttContext
   */
  @MessagePattern(`${MQTT_TOPIC_DHT_HUMIDITY_HANDLER}+`)
  getSensorDHTHumadity(@Payload() data: number, @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    const mcuToken = context.getTopic().toString().replace(MQTT_TOPIC_DHT_HUMIDITY_HANDLER, '');

    this.mqttHandlerService.saveDHTHumidity(mcuToken, data);
  }

  /**
   * DHT-11 Sensor Temperature
   * 
   * @param data Object
   * @param context MqttContext
   */
  @MessagePattern(`${MQTT_TOPIC_DHT_TEMPERATURE_HANDLER}+`)
  getSensorDHTTemperature(@Payload() data: number, @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    const mcuToken = context.getTopic().toString().replace(MQTT_TOPIC_DHT_TEMPERATURE_HANDLER, '');

    this.mqttHandlerService.saveDHTTemperature(mcuToken, data);
  }

  /**
   * DS18B20 Sensor Temperature
   * 
   * @param data Object
   * @param context MqttContext
   */
  @MessagePattern(`${MQTT_TOPIC_SOIL_TEMPERATURE_HANDLER}+`)
  getSensorSoilTemperature(@Payload() data: number, @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    const mcuToken = context.getTopic().toString().replace(MQTT_TOPIC_SOIL_TEMPERATURE_HANDLER, '');

    this.mqttHandlerService.saveSoilTemperature(mcuToken, data);
  }

  /**
   * Soil Moisture Sensor
   * 
   * @param data Object
   * @param context MqttContext
   */
  @MessagePattern(`${MQTT_TOPIC_SOIL_MOISTURE_HANDLER}+`)
  getSensorSoilMoisture(@Payload() data: number, @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    const mcuToken = context.getTopic().toString().replace(MQTT_TOPIC_SOIL_MOISTURE_HANDLER, '');

    this.mqttHandlerService.saveSoilMoisture(mcuToken, data);
  }

  /**
   * ESP Action Handler
   * 
   * @param data 
   * @param context 
   */
  @MessagePattern(`${MQTT_TOPIC_ESP_ACTION_HANDLER}+`)
  getEspAction(@Payload() data: number[], @Ctx() context: MqttContext) {
    this.logger.debug(data, context.getTopic());

    const mcuToken = context.getTopic().toString().replace(MQTT_TOPIC_ESP_ACTION_HANDLER, '');
    if (data.length === 2 && (data[0] >= 0 && data[0] <= 2) && (data[1] >=0 && data[1] <= 2)) {
      this.userService.updatePumpAction(mcuToken, data[0], data[1]);
    }
  }
}
