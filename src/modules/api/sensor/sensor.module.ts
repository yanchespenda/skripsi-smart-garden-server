import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

import { SensorDHTHumidity } from '@entities/sensor-dht-humidity.entity';
import { SensorDHTTemperature } from '@entities/sensor-dht-temperature.entity';
import { SensorSoilMoisture } from '@entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@entities/sensor-soil-temperature.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SensorDHTHumidity,
      SensorDHTTemperature,
      SensorSoilMoisture,
      SensorSoilTemperature
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
  ],
  controllers: [SensorController],
  providers: [SensorService]
})
export class SensorModule {}
