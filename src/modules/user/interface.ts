import { PumpRoutine } from "@base/core/entities/pump-routine.entity";
import { SensorSoilMoisture } from "@base/core/entities/sensor-soil-moisture.entity";
import { SensorSoilTemperature } from "@base/core/entities/sensor-soil-temperature.entity";
import { PumpSettingAutomationParameter } from "@base/modules/api/action/interface/pump.setting.interface";
import { UserDto } from "@base/modules/user/dto/user.dto";
import { ClientProxy } from "@nestjs/microservices";
import { Repository } from "typeorm";

export interface CronData {
  seconds?: string;
  minutes?: string;
  hours?: string;
}

export interface CronDataCallback {
  userDto?: UserDto;
  pumpRoutineRepository?: Repository<PumpRoutine>;
  sensorSoilMoistureRepository?: Repository<SensorSoilMoisture>;
  sensorSoilTemperatureRepository?: Repository<SensorSoilTemperature>;
  mqttClient?: ClientProxy;
  updateLastAction?: (mcuToken: string) => Promise<void>;
  findUserActionParam?: (userDto: UserDto) => Promise<PumpSettingAutomationParameter[]>;
}