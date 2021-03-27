import { Controller, Get, Inject, Logger } from '@nestjs/common';
// import { MessagePattern, Payload, Ctx, MqttContext, ClientProxy } from '@nestjs/microservices';
// import { MQTT_SERVICE } from '@constants/index';

@Controller()
export class AppController {
  // private readonly logger = new Logger(AppController.name);

  constructor(
    // @Inject(MQTT_SERVICE) private client: ClientProxy,
  ) {
    // this.onApplicationBootstrap();
  }

  // async onApplicationBootstrap() {
  //   await this.client.connect();
  // }

  @Get()
  getIndex(): any {

    // const pattern = 'sum';
    // const payload = [1, 2, 3];
    // this.client.emit<number>(pattern, payload);

    return {
      message: 'Alfian\'s Project',
      data: {
        app: {
          version: '1.0.0-dev',
          build: '060321',
        },
      },
    };
  }

  // @MessagePattern('sensor.humidity')
  // getSensorHumadity(@Payload() data: any, @Ctx() context: MqttContext) {
  //   this.logger.debug('Topic', context.getTopic());
  //   this.logger.debug('Data', data);

  //   // this.appService.handleSensorTemperature(data);
  // }

  // @MessagePattern('sensor.temperature')
  // getSensorTemperature(@Payload() data: any, @Ctx() context: MqttContext) {
  //   this.logger.debug('Topic', context.getTopic());
  //   this.logger.debug('Data', data);

  //   // this.appService.handleSensorTemperature(data);
  // }
}
