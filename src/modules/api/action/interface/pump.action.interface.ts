import { IsBoolean, IsOptional, IsEmail } from "class-validator";

export interface PumpActionDto {
  value: number;
}

export interface NotificationTelegramInit {
  userId: number;
}

export interface NotificationTelegram {
  id: number;
  first_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

export interface NotificationModels {
  emailEnable: boolean;
  email: string;
  telegramEnable: boolean;
  telegram: NotificationTelegram;
  webPushEnable: boolean;
  webPush: string;
}

export interface NotificationField {
  emailEnable: boolean;
  email: string;
  telegramEnable: boolean;
  telegram: string;
  webPushEnable: boolean;
  webPush: string;
}

export class NotificationFieldDto {
  @IsBoolean()
  emailEnable: boolean;

  @IsBoolean()
  telegramEnable: boolean;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  telegram: string;

  @IsBoolean()
  webPushEnable: boolean;

  @IsOptional()
  webPush: string;
}
