import { MQTT_SERVICE } from '@base/core/constants';
import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { PumpActionDto } from './interface/pump.action.interface';

@Controller()
export class ActionController {

  constructor(
    @Inject(MQTT_SERVICE) private mqttClient: ClientProxy,
  ) {
    this.onApplicationBootstrap();
  }

  async onApplicationBootstrap() {
    await this.mqttClient.connect();
  }

  @Post('pump-action')
  @UseGuards(AuthGuard())
  public async sendPumpAction(@Req() req: any, @Body() body: PumpActionDto): Promise<any> {
    const topic = 'esp.action.' + req.user.mcuToken;
    const payload = body?.value ? body.value : 0;

    await this.mqttClient.emit<string, number>(topic, payload).toPromise();

    return {
      message: 'OK'
    }
  }
}
