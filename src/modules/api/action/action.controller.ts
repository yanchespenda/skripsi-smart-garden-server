import { MQTT_SERVICE } from '@base/core/constants';
import { ActionHistory } from '@base/modules/user/interface';
import { UserService } from '@base/modules/user/user.service';
import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ActionService } from './action.service';
import { PumpActionDto } from './interface/pump.action.interface';
import { PumpSettingAutomation, PumpSettingAutomationDto, PumpSettingRoutimeDto } from './interface/pump.setting.interface';

@Controller()
export class ActionController {

  constructor(
    @Inject(MQTT_SERVICE) private mqttClient: ClientProxy,
    private readonly actionService: ActionService,
    private userService: UserService,
  ) {
    this.onApplicationBootstrap();
  }

  async onApplicationBootstrap() {
    await this.mqttClient.connect();
  }

  @Post('flush')
  @UseGuards(AuthGuard())
  public async sendPumpAction(@Req() req: any, @Body() body: PumpActionDto): Promise<any> {
    const topic = 'esp.action/' + req.user.mcuToken;
    const payload = body?.value ? [body.value, 0] : [0, 0];

    await this.mqttClient.emit<string, number[]>(topic, payload).toPromise();

    await this.userService.updateLastAction(req.user.mcuToken);

    return {
      message: 'OK'
    }
  }

  @Get('setting')
  @UseGuards(AuthGuard())
  public async setting(@Req() req: any): Promise<any> {
    return await this.actionService.setting(req.user);
  }

  @Get('history')
  @UseGuards(AuthGuard())
  public async history(@Req() req: any, @Query('page') page?: number): Promise<ActionHistory> {
    return await this.actionService.history(req.user, page);
  }

  @Get('setting-automation')
  @UseGuards(AuthGuard())
  public async getSettingAutomation(@Req() req: any): Promise<any> {
    return await this.actionService.getSettingAutomation(req.user);
  }

  @Get('setting-routine')
  @UseGuards(AuthGuard())
  public async getSettingRoutine(@Req() req: any): Promise<any> {
    return await this.actionService.getSettingRoutine(req.user);
  }

  @Post('setting-automation')
  @UseGuards(AuthGuard())
  public async settingAutomation(@Req() req: any, @Body() body: PumpSettingAutomationDto): Promise<any> {
    return await this.actionService.saveSettingAutomation(req.user, body);
  }

  @Post('setting-routine')
  @UseGuards(AuthGuard())
  public async settingRoutine(@Req() req: any, @Body() body: PumpSettingRoutimeDto): Promise<any> {
    return await this.actionService.saveSettingRoutime(req.user, body);
  }
}
