import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { PassportModule } from '@nestjs/passport';
import { MqttModule } from '@base/modules/mqtt/mqtt.module';
import { MqttHandlerService } from '@base/modules/mqtt-handler/mqtt-handler.service';
import { mqttProviders } from '@base/modules/mqtt-handler/mqtt-handler.providers';
import { UserModule } from '@base/modules/user/user.module';
import { SensorDHTHumidity } from '@base/core/entities/sensor-dht-humidity.entity';
import { SensorDHTTemperature } from '@base/core/entities/sensor-dht-temperature.entity';
import { SensorSoilMoisture } from '@base/core/entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@base/core/entities/sensor-soil-temperature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '@base/modules/user/user.service';
import { PumpAttemp } from '@base/core/entities/pump-attemp.entity';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    TypeOrmModule.forFeature([
      SensorDHTHumidity,
      SensorDHTTemperature,
      SensorSoilMoisture,
      SensorSoilTemperature,

      PumpAttemp,
    ]),
    MqttModule,
    UserModule,
  ],
  providers: [
    ActionService,
    // MqttHandlerService,
    // ...mqttProviders,
  ],
  controllers: [ActionController]
})
export class ActionModule {}
