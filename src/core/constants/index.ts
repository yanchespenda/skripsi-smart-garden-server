import * as dotenv from 'dotenv';
dotenv.config();

export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';

export const MQTT_SERVICE = 'MQTT_SERVICE';

export const MQTT_TOPIC_DHT_TEMPERATURE = 'sensor.dht.temperature';
export const MQTT_TOPIC_DHT_HUMIDITY = 'sensor.dht.humidity';

export const MQTT_TOPIC_SOIL_MOISTURE = 'sensor.soil.moisture';
export const MQTT_TOPIC_SOIL_TEMPERATURE = 'sensor.soil.temperature';

export const MQTT_TOPIC_ESP_ACTION = 'esp.action';

export const JWT_CONSTANT_CONFIG = {
    SECRET: process.env.JWT_SECRET,
    EXPIRED: process.env.JWT_EXPIRED,
};

export const SIGNUP_TOKEN = process.env.REGISTER_TOKEN;
