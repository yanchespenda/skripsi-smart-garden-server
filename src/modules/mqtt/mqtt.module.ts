import { MQTT_SERVICE } from '@base/core/constants';
import { MQTT_CONFIG } from '@base/universal-config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MQTT_SERVICE,
        transport: Transport.MQTT,
        options: {
          url: MQTT_CONFIG.url,
          // ca: MQTT_CONFIG.ca,
          // cert: MQTT_CONFIG.cert,

          username: MQTT_CONFIG.username,
          password: MQTT_CONFIG.password,
          protocol: (MQTT_CONFIG.protocol) as any,
        }
      },
    ]),
  ],
})
export class MqttModule {}
