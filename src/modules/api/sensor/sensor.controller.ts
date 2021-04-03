import { Controller, Get, Query } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { DateTime } from "luxon";

interface ChartJsFormatDatasets {
  label: string;
  data: number[];
}
interface ChartJsFormat {
  labels: string[];
  datasets: ChartJsFormatDatasets[];
  lastUpdate?: string;
}

/* 
  dateFormatSelect: UniversalSelect[] = [
    {
      itemue: 1,
      viewitemue: 'Last 30 data'
    },
    {
      itemue: 2,
      viewitemue: 'Last 1 hour (list per minutes)'
    },
    {
      itemue: 3,
      viewitemue: 'Last 24 hours (list per hour)'
    },
    {
      itemue: 4,
      viewitemue: 'Last 30 Days (list per day)'
    },
    {
      itemue: 5,
      viewitemue: 'Last 12 Months (list per month)'
    },
  ];
*/

@Controller()
export class SensorController {
  constructor(
    private sensorServices: SensorService
  ) { }

  @Get('dht-temperature')
  async getDHTTemperature(@Query('date-format') dateFormat: number = 1) {
    const dateFormatParse = Number(dateFormat);
    let currentReturn: ChartJsFormat = {
      labels: [],
      datasets: [],
      lastUpdate: null
    };

    if (dateFormatParse !== 1) {
      currentReturn.labels = this.sensorServices.generateEmptyDataByDateFormat(dateFormatParse);
    }
    const getData = await this.sensorServices.getDHTTemperature(dateFormatParse);
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
  async getDHTHumidity(@Query('date-format') dateFormat: number = 1) {
    const dateFormatParse = Number(dateFormat);
    let currentReturn: ChartJsFormat = {
      labels: [],
      datasets: [],
      lastUpdate: null
    };

    if (dateFormatParse !== 1) {
      currentReturn.labels = this.sensorServices.generateEmptyDataByDateFormat(dateFormatParse);
    }

    const getData = await this.sensorServices.getDHTHumidity(dateFormatParse);
    if (getData) {
      if (dateFormatParse === 1) {
        currentReturn.labels = getData.map(item => DateTime.fromJSDate(item.createdAt).toUTC().toString());

        let datasets: ChartJsFormatDatasets = {
          data: [],
          label: 'Humidity'
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
  async getSoilTemperature(@Query('date-format') dateFormat: number = 1) {
    const dateFormatParse = Number(dateFormat);
    let currentReturn: ChartJsFormat = {
      labels: [],
      datasets: [],
      lastUpdate: null
    };
    if (dateFormatParse !== 1) {
      currentReturn.labels = this.sensorServices.generateEmptyDataByDateFormat(dateFormatParse);
    }
    const getData = await this.sensorServices.getSoilTemperature(dateFormatParse);
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
  async getSoilMoisture(@Query('date-format') dateFormat: number = 1) {
    const dateFormatParse = Number(dateFormat);
    let currentReturn: ChartJsFormat = {
      labels: [],
      datasets: [],
      lastUpdate: null
    };

    if (dateFormatParse !== 1) {
      currentReturn.labels = this.sensorServices.generateEmptyDataByDateFormat(dateFormatParse);
    }
    const getData = await this.sensorServices.getSoilMoisture(dateFormatParse);
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

  @Get('water-level')
  async getWaterLevel(@Query('date-format') dateFormat: number = 1) {
    const dateFormatParse = Number(dateFormat);
    let currentReturn: ChartJsFormat = {
      labels: [],
      datasets: [],
      lastUpdate: null
    };

    if (dateFormatParse !== 1) {
      currentReturn.labels = this.sensorServices.generateEmptyDataByDateFormat(dateFormatParse);
    }
    const getData = await this.sensorServices.getWaterLevel(dateFormatParse);
    if (getData) {
      if (dateFormatParse === 1) {
        currentReturn.labels = getData.map(item => DateTime.fromJSDate(item.createdAt).toUTC().toString());

        let datasets: ChartJsFormatDatasets = {
          data: [],
          label: 'Nilai'
        }
        getData.forEach(item => {
          datasets.data.push(item.level);
        });
        currentReturn.datasets.push(datasets);
      } else {
        currentReturn.datasets = this.sensorServices.generateChartJsData(getData, 'level', dateFormatParse);
      }
      const getLastUpdate = getData[0]?.createdAt;
      currentReturn.lastUpdate = getLastUpdate ? DateTime.fromJSDate(getLastUpdate).toUTC().toString() : null;
    }

    return currentReturn;
  }
}
