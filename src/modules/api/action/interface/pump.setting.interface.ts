import { IsNotEmpty } from "class-validator";

export interface PumpSettingAutomationParameter {
  enable: boolean;
  sensor: string;
  value: number;
  operator: string;
}

export interface PumpSettingAutomation {
  automationEnable: boolean;
  automationAttemp: number;
  automationParameter: string;
}

export class PumpSettingAutomationDto {
  @IsNotEmpty()
  automationEnable: boolean;

  @IsNotEmpty()
  automationAttemp: number;

  @IsNotEmpty()
  automationParameter: string;
}

export interface PumpSettingRoutime {
  routineEnable: boolean;
  routineSkipParamater: boolean;
  routineTime: string;
}

export class PumpSettingRoutimeDto {
  @IsNotEmpty()
  routineEnable: boolean;

  @IsNotEmpty()
  routineSkipParamater: boolean;

  @IsNotEmpty()
  routineTime: string;
}

