import { PumpAction } from '@base/core/entities/pump-action.entity';
import { PumpAttemp } from '@base/core/entities/pump-attemp.entity';
import { PumpRoutine } from '@base/core/entities/pump-routine.entity';
import { SensorSoilMoisture } from '@base/core/entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@base/core/entities/sensor-soil-temperature.entity';
import { User } from '@base/core/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from '../mqtt/mqtt.module';
import { UserService } from './user.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PumpAction,
      PumpAttemp,
      PumpRoutine,

      SensorSoilMoisture,
      SensorSoilTemperature,
    ]),
    MqttModule,
    ScheduleModule
  ],
  providers: [
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
