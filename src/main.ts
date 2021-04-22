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
    origin: true
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
      protocol: (MQTT_CONFIG.protocol) as any,
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
