import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { MqttHandlerService } from './mqtt-handler.service';
import {
  MQTT_SERVICE,
  MQTT_TOPIC_DHT_HUMIDITY,
  MQTT_TOPIC_DHT_TEMPERATURE,
  MQTT_TOPIC_SOIL_MOISTURE,
  MQTT_TOPIC_SOIL_TEMPERATURE,
  MQTT_TOPIC_WATER_LEVEL
} from '@constants/index';

@Controller('mqtt-handler')
export class MqttHandlerController {
  private readonly logger = new Logger(MqttHandlerController.name);

  constructor(
    @Inject(MQTT_SERVICE) private clientMQTT: ClientProxy,

    private mqttHandlerService: MqttHandlerService,
  ) { }

  @MessagePattern(MQTT_TOPIC_DHT_HUMIDITY)
  getSensorDHTHumadity(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(context.getTopic(), 'Topic');
    this.logger.debug(data, 'Data');

    this.mqttHandlerService.saveDHTHumidity(data);
  }

  @MessagePattern(MQTT_TOPIC_DHT_TEMPERATURE)
  getSensorDHTTemperature(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(context.getTopic(), 'Topic');
    this.logger.debug(data, 'Data');

    this.mqttHandlerService.saveDHTTemperature(data);
  }

  @MessagePattern(MQTT_TOPIC_SOIL_TEMPERATURE)
  getSensorSoilTemperature(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(context.getTopic(), 'Topic');
    this.logger.debug(data, 'Data');

    this.mqttHandlerService.saveSoilTemperature(data);
  }

  @MessagePattern(MQTT_TOPIC_SOIL_MOISTURE)
  getSensorSoilMoisture(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(context.getTopic(), 'Topic');
    this.logger.debug(data, 'Data');

    this.mqttHandlerService.saveSoilMoisture(data);
  }

  @MessagePattern(MQTT_TOPIC_WATER_LEVEL)
  getSensorWaterSensor(@Payload() data: any, @Ctx() context: MqttContext) {
    this.logger.debug(context.getTopic(), 'Topic');
    this.logger.debug(data, 'Data');

    this.mqttHandlerService.saveWaterLevel(data);
  }
}
