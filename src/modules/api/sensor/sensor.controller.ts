import { Controller, Get } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller()
export class SensorController {
  constructor(
    private sensorServices: SensorService
  ) { }

  @Get('dht-humidity')
  async getDHTHumidity() {
    return await this.sensorServices.getDHTHumidity();
  }

  @Get('dht-temperature')
  async getDHTTemperature() {
    return await this.sensorServices.getDHTTemperature();
  }

  @Get('soil-temperature')
  async getSoilTemperature() {
    return await this.sensorServices.getSoilTemperature();
  }

  @Get('soil-moisture')
  async getSoilMoisture() {
    return await this.sensorServices.getSoilMoisture();
  }

  @Get('water-level')
  async getWaterLevel() {
    return await this.sensorServices.getWaterLevel();
  }
}
