import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { DateTime, DurationObject } from "luxon";

import { SensorDHTHumidity } from '@entities/sensor-dht-humidity.entity';
import { SensorDHTTemperature } from '@entities/sensor-dht-temperature.entity';
import { SensorSoilMoisture } from '@entities/sensor-soil-moisture.entity';
import { SensorSoilTemperature } from '@entities/sensor-soil-temperature.entity';

interface ChartJsFormatDatasets {
  label: string;
  data: number[];
}
interface ChartJsFormat {
  labels: string[];
  datasets: ChartJsFormatDatasets[];
}

interface ClassifiedData {
  date: string;
  values: number[];
  valueAverage: number;
  valueMin: number;
  valueMax: number;
}

@Injectable()
export class SensorService {
  constructor(
    // @InjectRepository(SensorDHTHumidity) private sensorDHTHumidityRepository: Repository<SensorDHTHumidity>,
    // @InjectRepository(SensorDHTTemperature) private sensorDHTTemperatureRepository: Repository<SensorDHTTemperature>,
    // @InjectRepository(SensorSoilMoisture) private sensorSoilMoistureRepository: Repository<SensorSoilMoisture>,
    // @InjectRepository(SensorSoilTemperature) private sensorSoilTemperatureRepository: Repository<SensorSoilTemperature>,

    private connection: Connection
  ) { }

  findArrayByDate(source: ClassifiedData[], findDate: string) {
    let currentIndex = -1;
    source.forEach((value, index) => {
      if (DateTime.fromISO(value.date).equals(DateTime.fromISO(findDate))) {
        currentIndex = index;
      }
    });
    return currentIndex;
  }

  findDataByDate(source: ClassifiedData[], findDate: string): ClassifiedData {
    let currentIndex: ClassifiedData = null;
    source.forEach((value) => {
      if (DateTime.fromISO(value.date).equals(DateTime.fromISO(findDate))) {
        currentIndex = value;
      }
    });
    return currentIndex;
  }

  findAverage(source: number[]): number {
    return source.reduce((a, b) => a + b) / source.length;
  }

  findMax(source: number[]): number {
    return Math.max(...source);
  }

  findMin(source: number[]): number {
    return Math.min(...source);
  }

  generateChartJsData(source: any, fieldValue: string, dateFormat: number): any {
    const getDatesEmpty = this.generateEmptyDataByDateFormat(dateFormat);
    let returnData: ChartJsFormatDatasets[] = [];
    let classifiedByDate: ClassifiedData[] = [];
    getDatesEmpty.forEach(date => {
      classifiedByDate.push({
        date: date,
        values: [],
        valueAverage: 0,
        valueMin: 0,
        valueMax: 0
      });
    });
    
    let startBy: any = 'minute';
    let plusData: DurationObject = {
      minute: 1
    };
    if (dateFormat === 3) {
      startBy = 'hour';
      plusData = {
        hour: 1
      };
    } else if (dateFormat === 4) {
      startBy = 'day';
      plusData = {
        day: 1
      };
    } else if (dateFormat === 5) {
      startBy = 'month';
      plusData = {
        month: 1
      };
    }

    source.forEach(value => {
      classifiedByDate.forEach(valueClassified => {
        if (
          DateTime.fromISO(valueClassified.date) >= DateTime.fromJSDate(value.createdAt).startOf(startBy) &&
          DateTime.fromISO(valueClassified.date) < DateTime.fromJSDate(value.createdAt).startOf(startBy).plus(plusData)
        ) {
          valueClassified.values.push(value[fieldValue]);
        }
      });
    });

    classifiedByDate.forEach(value => {
      if (value.values.length === 0) {
        value.values = [0];
      }

      value.valueAverage = this.findAverage(value.values);
      value.valueMax = this.findMax(value.values);
      value.valueMin = this.findMin(value.values);
    });

    let currentAverage: number[] = [];
    let currentMin: number[] = [];
    let currentMax: number[] = [];
    getDatesEmpty.forEach(date => {
      const findDate = this.findDataByDate(classifiedByDate, date);
      if (findDate !== null) {
        currentAverage.push(findDate.valueAverage);
        currentMin.push(findDate.valueMin);
        currentMax.push(findDate.valueMax);
      }
    });

    returnData.push({
      data: currentAverage,
      label: 'Rata rata'
    });

    returnData.push({
      data: currentMin,
      label: 'Terkecil'
    });

    returnData.push({
      data: currentMax,
      label: 'Terbesar'
    });
    return returnData;
  }

  generateEmptyDataByDateFormat(dateFormat: number): string[] {
    const now = DateTime.now();
    let returnData: string[] = [];
    if (dateFormat === 2) {
      returnData.push(now.startOf('minutes').toUTC().toString());
      for (let index = 1; index <= 59; index++) {
        returnData.push(now.minus({
          minute: index
        }).startOf('minutes').toUTC().toString());
      }
    } else if (dateFormat === 3) {
      returnData.push(now.startOf('hours').toUTC().toString());
      for (let index = 1; index <= 23; index++) {
        returnData.push(now.minus({
          hour: index
        }).startOf('hours').toUTC().toString());
      }
    } else if (dateFormat === 4) {
      returnData.push(now.startOf('days').toUTC().toString());
      for (let index = 1; index <= 29; index++) {
        returnData.push(now.minus({
          day: index
        }).startOf('days').toUTC().toString());
      }
    } else if (dateFormat === 5) {
      returnData.push(now.startOf('months').toUTC().toString());
      for (let index = 1; index <= 11; index++) {
        returnData.push(now.minus({
          month: index
        }).startOf('months').toUTC().toString());
      }
    }
    return returnData;
  }

  private convertSortToObject(dateFormat: number): DurationObject {
    let current: DurationObject = {};
    if (dateFormat === 2) {
      current = {
        hour: 1
      };
    } else if (dateFormat === 3) {
      current = {
        hours: 24
      };
    } else if (dateFormat === 4) {
      current = {
        days: 30
      };
    } else if (dateFormat === 5) {
      current = {
        months: 12
      };
    }
    return current;
  }

  async getDHTHumidity(userId: number, dateFormat: number = 1) {
    const query = this.connection.getRepository(SensorDHTHumidity)
      .createQueryBuilder('row')
      .select('row.humidity')
      .addSelect('row.createdAt')
      .where('row.userId = :userId', {
        userId: userId
      })
      .orderBy('row.createdAt', 'DESC');

    if (dateFormat === 1) {
      query.limit(30)
    } else {
      query.where('row.createdAt > :createdAt', {
        createdAt: DateTime.now().minus(this.convertSortToObject(dateFormat)).toSQLDate()
      })
    }

    return await query.getMany();
  }

  async getDHTTemperature(userId: number, dateFormat: number = 1) {
    const query = this.connection.getRepository(SensorDHTTemperature)
      .createQueryBuilder('row')
      .select('row.temperature')
      .addSelect('row.createdAt')
      .where('row.userId = :userId', {
        userId: userId
      })
      .orderBy('row.createdAt', 'DESC');

    if (dateFormat === 1) {
      query.limit(30)
    } else {
      query.where('row.createdAt > :createdAt', {
        createdAt: DateTime.now().minus(this.convertSortToObject(dateFormat)).toSQLDate()
      })
    }

    return await query.getMany();
  }

  async getSoilMoisture(userId: number, dateFormat: number = 1) {
    const query = this.connection.getRepository(SensorSoilMoisture)
      .createQueryBuilder('row')
      .select('row.moisture')
      .addSelect('row.createdAt')
      .where('row.userId = :userId', {
        userId: userId
      })
      .orderBy('row.createdAt', 'DESC');

    if (dateFormat === 1) {
      query.limit(30)
    } else {
      query.where('row.createdAt > :createdAt', {
        createdAt: DateTime.now().minus(this.convertSortToObject(dateFormat)).toSQLDate()
      })
    }

    return await query.getMany();
  }

  async getSoilTemperature(userId: number, dateFormat: number = 1) {
    const query = this.connection.getRepository(SensorSoilTemperature)
      .createQueryBuilder('row')
      .select('row.temperature')
      .addSelect('row.createdAt')
      .where('row.userId = :userId', {
        userId: userId
      })
      .orderBy('row.createdAt', 'DESC');

    if (dateFormat === 1) {
      query.limit(30)
    } else {
      query.where('row.createdAt > :createdAt', {
        createdAt: DateTime.now().minus(this.convertSortToObject(dateFormat)).toSQLDate()
      })
    }

    return await query.getMany();
  }

}
