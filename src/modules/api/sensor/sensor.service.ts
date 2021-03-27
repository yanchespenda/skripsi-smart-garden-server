import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { DateTime, DurationObject } from "luxon";

import { SensorDHTHumidity } from '@entities/sensor-dht-humidity.entity';
import { SensorDHTTemperature } from '@entities/sensor-dht-temperature.entity';
import { SensorSoilMoisture } from '@entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@entities/sensor-soil-temperature.entity';
import { SensorWaterLevel } from '@entities/sensor-water-level.entity';

@Injectable()
export class SensorService {
  constructor(
    // @InjectRepository(SensorDHTHumidity) private sensorDHTHumidityRepository: Repository<SensorDHTHumidity>,
    // @InjectRepository(SensorDHTTemperature) private sensorDHTTemperatureRepository: Repository<SensorDHTTemperature>,
    // @InjectRepository(SensorSoilMoisture) private sensorSoilMoistureRepository: Repository<SensorSoilMoisture>,
    // @InjectRepository(SensorSoilTemperature) private sensorSoilTemperatureRepository: Repository<SensorSoilTemperature>,

    private connection: Connection
  ) { }

  private convertSortToObject(sortBy: string, sortValue: number): DurationObject {
    let current: DurationObject = {};
    if (sortBy === 'hour') {
      if (sortValue <= 1) {
        sortValue = 1;
      } else if (sortValue >= 24) {
        sortValue = 24;
      }
      current = {
        hours: sortValue
      };
    } else if (sortBy === 'day') {
      if (sortValue <= 1) {
        sortValue = 1;
      } else if (sortValue >= 30) {
        sortValue = 30;
      }
      current = {
        days: sortValue
      };
    } else if (sortBy === 'month') {
      if (sortValue <= 1) {
        sortValue = 1;
      } else if (sortValue >= 12) {
        sortValue = 12;
      }
      current = {
        months: sortValue
      };
    } else {
      if (sortValue <= 1) {
        sortValue = 1;
      } else if (sortValue >= 24) {
        sortValue = 24;
      }
      current = {
        hours: sortValue
      };
    }
    return current;
  }

  async getDHTHumidity(sortBy: string = 'hour', sortValue: number = 1) {
    return await this.connection.getRepository(SensorDHTHumidity)
      .createQueryBuilder('row')
      .select('row.humidity')
      .addSelect('row.createdAt')
      .where('row.createdAt > :createdAt', {
        createdAt: DateTime.now().minus(this.convertSortToObject(sortBy, sortValue)).toSQLDate()
      })
      .orderBy('row.createdAt', 'DESC')
      .getMany();
  }

  async getDHTTemperature(sortBy: string = 'hour', sortValue: number = 1) {
    return await this.connection.getRepository(SensorDHTTemperature)
      .createQueryBuilder('row')
      .select('row.temperature')
      .addSelect('row.createdAt')
      .where('row.createdAt > :createdAt', {
        createdAt: DateTime.now().minus(this.convertSortToObject(sortBy, sortValue)).toSQLDate()
      })
      .orderBy('row.createdAt', 'DESC')
      .getMany();
  }

  async getSoilMoisture(sortBy: string = 'hour', sortValue: number = 1) {
    return await this.connection.getRepository(SensorSoilMoisture)
      .createQueryBuilder('row')
      .select('row.moisture')
      .addSelect('row.createdAt')
      .where('row.createdAt > :createdAt', {
        createdAt: DateTime.now().minus(this.convertSortToObject(sortBy, sortValue)).toSQLDate()
      })
      .orderBy('row.createdAt', 'DESC')
      .getMany();
  }

  async getSoilTemperature(sortBy: string = 'hour', sortValue: number = 1) {
    return await this.connection.getRepository(SensorSoilTemperature)
      .createQueryBuilder('row')
      .select('row.temperature')
      .addSelect('row.createdAt')
      .where('row.createdAt > :createdAt', {
        createdAt: DateTime.now().minus(this.convertSortToObject(sortBy, sortValue)).toSQLDate()
      })
      .orderBy('row.createdAt', 'DESC')
      .getMany();
  }

  async getWaterLevel(sortBy: string = 'hour', sortValue: number = 1) {
    return await this.connection.getRepository(SensorWaterLevel)
      .createQueryBuilder('row')
      .select('row.level')
      .addSelect('row.createdAt')
      .where('row.createdAt > :createdAt', {
        createdAt: DateTime.now().minus(this.convertSortToObject(sortBy, sortValue)).toSQLDate()
      })
      .orderBy('row.createdAt', 'DESC')
      .getMany();
  }
}
