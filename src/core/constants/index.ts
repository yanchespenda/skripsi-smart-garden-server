import * as dotenv from 'dotenv';
dotenv.config();

export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';

export const MQTT_SERVICE = 'MQTT_SERVICE';

export const MQTT_TOPIC_DHT_TEMPERATURE_HANDLER = 'sensor.dht.temperature/';
export const MQTT_TOPIC_DHT_HUMIDITY_HANDLER = 'sensor.dht.humidity/';

export const MQTT_TOPIC_SOIL_MOISTURE_HANDLER = 'sensor.soil.moisture/';
export const MQTT_TOPIC_SOIL_TEMPERATURE_HANDLER = 'sensor.soil.temperature/';

export const MQTT_TOPIC_ESP_ACTION_HANDLER = 'esp.action/';

export const JWT_CONSTANT_CONFIG = {
    SECRET: process.env.JWT_SECRET,
    EXPIRED: process.env.JWT_EXPIRED,
};

export const SIGNUP_TOKEN = process.env.REGISTER_TOKEN;
