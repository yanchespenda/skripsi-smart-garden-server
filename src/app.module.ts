import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SensorModule } from './modules/api/sensor/sensor.module';
import { ActionModule } from './modules/api/action/action.module';

import { AppController } from './app.controller';


import { SensorDHTHumidity } from '@entities/sensor-dht-humidity.entity';
import { SensorDHTTemperature } from '@entities/sensor-dht-temperature.entity';
import { User } from '@entities/user.entity';
import { SensorSoilMoisture } from '@entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@entities/sensor-soil-temperature.entity';
import { PumpAction } from './core/entities/pump-action.entity';
import { PumpAttemp } from './core/entities/pump-attemp.entity';
import { PumpRoutine } from './core/entities/pump-routine.entity';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { MqttHandlerModule } from './modules/mqtt-handler/mqtt-handler.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AppRoutingModule,

    TypeOrmModule.forRoot({
      type: (process.env.DB_DIALECT) as any,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) as number,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        User,
        SensorDHTHumidity,
        SensorDHTTemperature,
        SensorSoilMoisture,
        SensorSoilTemperature,

        PumpAction,
        PumpAttemp,
        PumpRoutine
      ],
      synchronize: true,
      charset: "utf8mb4_unicode_ci",
    }),

    UserModule,
    AuthModule,
    MqttHandlerModule,
    MqttModule,
    SensorModule,
    ActionModule,
  ],
  controllers: [AppController],
  providers: [
  ],
})
export class AppModule {}
