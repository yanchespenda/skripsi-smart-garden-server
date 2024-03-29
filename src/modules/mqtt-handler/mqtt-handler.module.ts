import { Module } from '@nestjs/common';
import { MqttHandlerService } from './mqtt-handler.service';
import { MqttHandlerController } from './mqtt-handler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MqttModule } from '@modules/mqtt/mqtt.module';

import { SensorDHTHumidity } from '@entities/sensor-dht-humidity.entity';
import { SensorDHTTemperature } from '@entities/sensor-dht-temperature.entity';
import { SensorSoilMoisture } from '@entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@entities/sensor-soil-temperature.entity';

import { mqttProviders } from './mqtt-handler.providers';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SensorDHTHumidity,
      SensorDHTTemperature,
      SensorSoilMoisture,
      SensorSoilTemperature,
    ]),
    UserModule,
    MqttModule,
  ],
  providers: [
    MqttHandlerService,
    ...mqttProviders
  ],
  controllers: [
    MqttHandlerController
  ]
})
export class MqttHandlerModule {}
