import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import * as rateLimit from 'express-rate-limit';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { MQTT_CONFIG } from './universal-config';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors
  app.enableCors({
    credentials: true,
  });

  // rate limiter
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    }),
  );

  // handle all user input validation globally
  app.useGlobalPipes(new ValidateInputPipe());

  // Microservice mqtt
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: MQTT_CONFIG.url,
      username: MQTT_CONFIG.username,
      password: MQTT_CONFIG.password,
      // // url: 'mqtt://localhost:1883',
      // // url: process.env.MQTT_SERVER,
      // hostname: 'u2b6d465.en.emqx.cloud',
      // username: 'nestjs-user',
      // password: 'a12345678',
      // protocol: 'mqtts',
      // port: 12376
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
