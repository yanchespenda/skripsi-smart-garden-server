import * as dotenv from 'dotenv';
// import * as fs from 'fs';
dotenv.config();

export const MQTT_CONFIG = {
    url: process.env.MQTT_URL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    protocol: process.env.MQTT_PROTOCOL || 'mqtt',
};

export const ACTION_CONFIG = {
    SETTING_AUTOMATION_SENSOR_VALIDATION: ['soil.temperature', 'soil.moisture'],
    NAME: ['START', 'STOP', 'FORCE STOP']
};
