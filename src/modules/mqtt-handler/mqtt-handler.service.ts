import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SensorDHTHumidity } from '@entities/sensor-dht-humidity.entity';
import { SensorDHTTemperature } from '@entities/sensor-dht-temperature.entity';
import { SensorSoilMoisture } from '@entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@entities/sensor-soil-temperature.entity';


@Injectable()
export class MqttHandlerService {
  constructor(
    @InjectRepository(SensorDHTHumidity) private sensorDHTHumidityRepository: Repository<SensorDHTHumidity>,
    @InjectRepository(SensorDHTTemperature) private sensorDHTTemperatureRepository: Repository<SensorDHTTemperature>,
    @InjectRepository(SensorSoilMoisture) private sensorSoilMoistureRepository: Repository<SensorSoilMoisture>,
    @InjectRepository(SensorSoilTemperature) private sensorSoilTemperatureRepository: Repository<SensorSoilTemperature>,
  ) {}

  async saveDHTHumidity(value: number): Promise<void> {
    const mdlData = new SensorDHTHumidity();
    mdlData.humidity = value;
    await this.sensorDHTHumidityRepository.save(mdlData);
  }

  async saveDHTTemperature(value: number): Promise<void> {
    const mdlData = new SensorDHTTemperature();
    mdlData.temperature = value;
    await this.sensorDHTTemperatureRepository.save(mdlData);
  }

  async saveSoilTemperature(value: number): Promise<void> {
    const mdlData = new SensorSoilTemperature();
    mdlData.temperature = value;
    await this.sensorSoilTemperatureRepository.save(mdlData);
  }

  async saveSoilMoisture(value: number): Promise<void> {
    const mdlData = new SensorSoilMoisture();
    mdlData.moisture = value;
    await this.sensorSoilMoistureRepository.save(mdlData);
  }
}
