import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SensorDHTHumidity } from '@entities/sensor-dht-humidity.entity';
import { SensorDHTTemperature } from '@entities/sensor-dht-temperature.entity';
import { SensorSoilMoisture } from '@entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@entities/sensor-soil-temperature.entity';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';


@Injectable()
export class MqttHandlerService {
  constructor(
    private usersService: UserService,
    @InjectRepository(SensorDHTHumidity) private sensorDHTHumidityRepository: Repository<SensorDHTHumidity>,
    @InjectRepository(SensorDHTTemperature) private sensorDHTTemperatureRepository: Repository<SensorDHTTemperature>,
    @InjectRepository(SensorSoilMoisture) private sensorSoilMoistureRepository: Repository<SensorSoilMoisture>,
    @InjectRepository(SensorSoilTemperature) private sensorSoilTemperatureRepository: Repository<SensorSoilTemperature>,
  ) {}

  async tokenValidation(token: string): Promise<UserDto> {
    return await this.usersService.findByMcuToken(token);
  }

  async saveDHTHumidity(token: string, value: number): Promise<void> {
    const user = await this.tokenValidation(token);
    if (!user) {
      return;
    }

    const mdlData = this.sensorDHTHumidityRepository.create({
      humidity: value,
      user
    });
    await this.sensorDHTHumidityRepository.save(mdlData);
  }

  async saveDHTTemperature(token: string, value: number): Promise<void> {
    const user = await this.tokenValidation(token);
    if (!user) {
      return;
    }

    const mdlData = this.sensorDHTTemperatureRepository.create({
      temperature: value,
      user
    });
    await this.sensorDHTTemperatureRepository.save(mdlData);
  }

  async saveSoilTemperature(token: string, value: number): Promise<void> {
    const user = await this.tokenValidation(token);
    if (!user) {
      return;
    }

    const mdlData = this.sensorSoilTemperatureRepository.create({
      temperature: value,
      user
    });
    await this.sensorSoilTemperatureRepository.save(mdlData);

    await this.usersService.handlingUserParameter(user, 1, value);
  }

  async saveSoilMoisture(token: string, value: number): Promise<void> {
    const user = await this.tokenValidation(token);
    if (!user) {
      return;
    }

    const mdlData = this.sensorSoilMoistureRepository.create({
      moisture: value,
      user
    });
    await this.sensorSoilMoistureRepository.save(mdlData);

    await this.usersService.handlingUserParameter(user, 2, value);
  }
}
