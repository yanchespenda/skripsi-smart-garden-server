import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import * as rateLimit from 'express-rate-limit';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { FIREBASE_ADMIN, MQTT_CONFIG } from './universal-config';
import admin, { ServiceAccount } from 'firebase-admin';
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

  // Set the config options
  const adminConfig: ServiceAccount = {
    "projectId": FIREBASE_ADMIN.projectId, 
    "privateKey": FIREBASE_ADMIN.privateKey.replace(/\\n/g, '\n'),
    "clientEmail": FIREBASE_ADMIN.clientEmail,
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: FIREBASE_ADMIN.databaseURL
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
