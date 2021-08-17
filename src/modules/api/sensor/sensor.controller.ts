import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { DateTime } from "luxon";
import { AuthGuard } from '@nestjs/passport';

interface ChartJsFormatDatasets {
  label: string;
  data: number[];
}
interface ChartJsFormat {
  labels: string[];
  datasets: ChartJsFormatDatasets[];
  lastUpdate?: string;
}

@Controller()
export class SensorController {
  constructor(
    private sensorServices: SensorService
  ) { }

  @Get('dht-temperature')
  @UseGuards(AuthGuard())
  async getDHTTemperature(@Req() req: any, @Query('date-format') dateFormat: number = 1) {
    const dateFormatParse = Number(dateFormat);
    let currentReturn: ChartJsFormat = {
      labels: [],
      datasets: [],
      lastUpdate: null
    };

    if (dateFormatParse !== 1) {
      currentReturn.labels = this.sensorServices.generateEmptyDataByDateFormat(dateFormatParse);
    }
    const getData = await this.sensorServices.getDHTTemperature(req.user.id, dateFormatParse);
    if (getData) {
      if (dateFormatParse == 1) {
        currentReturn.labels = getData.map(item => DateTime.fromJSDate(item.createdAt).toUTC().toString());

        let datasets: ChartJsFormatDatasets = {
          data: [],
          label: 'Nilai'
        }
        getData.forEach(item => {
          datasets.data.push(item.temperature);
        });
        currentReturn.datasets.push(datasets);
      } else {
        currentReturn.datasets = this.sensorServices.generateChartJsData(getData, 'temperature', dateFormatParse);
      }
      const getLastUpdate = getData[0]?.createdAt;
      currentReturn.lastUpdate = getLastUpdate ? DateTime.fromJSDate(getLastUpdate).toUTC().toString() : null;
    }

    return currentReturn;
  }

  @Get('dht-humidity')
  @UseGuards(AuthGuard())
  async getDHTHumidity(@Req() req: any, @Query('date-format') dateFormat: number = 1) {
    const dateFormatParse = Number(dateFormat);
    let currentReturn: ChartJsFormat = {
      labels: [],
      datasets: [],
      lastUpdate: null
    };

    if (dateFormatParse !== 1) {
      currentReturn.labels = this.sensorServices.generateEmptyDataByDateFormat(dateFormatParse);
    }

    const getData = await this.sensorServices.getDHTHumidity(req.user.id, dateFormatParse);
    if (getData) {
      if (dateFormatParse === 1) {
        currentReturn.labels = getData.map(item => DateTime.fromJSDate(item.createdAt).toUTC().toString());

        let datasets: ChartJsFormatDatasets = {
          data: [],
          label: 'Nilai'
        }
        getData.forEach(item => {
          datasets.data.push(item.humidity);
        });
        currentReturn.datasets.push(datasets);
      } else {
        currentReturn.datasets = this.sensorServices.generateChartJsData(getData, 'humidity', dateFormatParse);
      }
      const getLastUpdate = getData[0]?.createdAt;
      currentReturn.lastUpdate = getLastUpdate ? DateTime.fromJSDate(getLastUpdate).toUTC().toString() : null;
    }

    return currentReturn;
  }

  @Get('soil-temperature')
  @UseGuards(AuthGuard())
  async getSoilTemperature(@Req() req: any, @Query('date-format') dateFormat: number = 1) {
    const dateFormatParse = Number(dateFormat);
    let currentReturn: ChartJsFormat = {
      labels: [],
      datasets: [],
      lastUpdate: null
    };
    if (dateFormatParse !== 1) {
      currentReturn.labels = this.sensorServices.generateEmptyDataByDateFormat(dateFormatParse);
    }
    const getData = await this.sensorServices.getSoilTemperature(req.user.id, dateFormatParse);
    if (getData) {
      if (dateFormatParse === 1) {
        currentReturn.labels = getData.map(item => DateTime.fromJSDate(item.createdAt).toUTC().toString());

        let datasets: ChartJsFormatDatasets = {
          data: [],
          label: 'Nilai'
        }
        getData.forEach(item => {
          datasets.data.push(item.temperature);
        });
        currentReturn.datasets.push(datasets);
      } else {
        currentReturn.datasets = this.sensorServices.generateChartJsData(getData, 'temperature', dateFormatParse);
      }
      const getLastUpdate = getData[0]?.createdAt;
      currentReturn.lastUpdate = getLastUpdate ? DateTime.fromJSDate(getLastUpdate).toUTC().toString() : null;
    }

    return currentReturn;
  }

  @Get('soil-moisture')
  @UseGuards(AuthGuard())
  async getSoilMoisture(@Req() req: any, @Query('date-format') dateFormat: number = 1) {
    const dateFormatParse = Number(dateFormat);
    let currentReturn: ChartJsFormat = {
      labels: [],
      datasets: [],
      lastUpdate: null
    };

    if (dateFormatParse !== 1) {
      currentReturn.labels = this.sensorServices.generateEmptyDataByDateFormat(dateFormatParse);
    }
    const getData = await this.sensorServices.getSoilMoisture(req.user.id, dateFormatParse);
    if (getData) {
      if (dateFormatParse === 1) {
        currentReturn.labels = getData.map(item => DateTime.fromJSDate(item.createdAt).toUTC().toString());

        let datasets: ChartJsFormatDatasets = {
          data: [],
          label: 'Nilai'
        }
        getData.forEach(item => {
          datasets.data.push(item.moisture);
        });
        currentReturn.datasets.push(datasets);
      } else {
        currentReturn.datasets = this.sensorServices.generateChartJsData(getData, 'moisture', dateFormatParse);
      }
      const getLastUpdate = getData[0]?.createdAt;
      currentReturn.lastUpdate = getLastUpdate ? DateTime.fromJSDate(getLastUpdate).toUTC().toString() : null;
    }

    return currentReturn;
  }

}
