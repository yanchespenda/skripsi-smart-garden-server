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
import { TELEGRAM_BOT, MAILGUN } from '@base/universal-config';
import { MailgunModule } from '@nextnm/nestjs-mailgun';
import { TelegramModule } from 'nestjs-telegram';
import { SensorDHTHumidity } from '@base/core/entities/sensor-dht-humidity.entity';
import { SensorDHTTemperature } from '@base/core/entities/sensor-dht-temperature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PumpAction,
      PumpAttemp,
      PumpRoutine,

      SensorSoilMoisture,
      SensorSoilTemperature,
      SensorDHTHumidity,
      SensorDHTTemperature,
    ]),
    MqttModule,
    ScheduleModule,
    TelegramModule.forRoot({
      botKey: TELEGRAM_BOT.token
    }),
    MailgunModule.forRoot({
      DOMAIN: MAILGUN.domain,
      API_KEY: MAILGUN.apiKey,
      HOST: 'api.mailgun.net'
    }),
  ],
  providers: [
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
