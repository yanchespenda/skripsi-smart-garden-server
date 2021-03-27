import * as dotenv from 'dotenv';
dotenv.config();

export const MQTT_CONFIG = {
    url: process.env.MQTT_URL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
};