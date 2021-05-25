import { IsNotEmpty } from "class-validator";

export interface PumpSettingAutomationParameter {
  enable: boolean;
  sensor: string;
  value: number;
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