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
    NAME: ['STOP', 'START', 'FORCE STOP'],
    FROM: ['DASHBOARD', 'AUTOMATION', 'ROUTINE']
};

export const TELEGRAM_BOT = {
    token: process.env.TELEGRAM_BOT_TOKEN,
};

export const MAILGUN = {
    domain: process.env.MAILGUN_DOMAIN,
    apiKey: process.env.MAILGUN_SECRET,
    from: process.env.MAIL_FROM_ADDRESS,
    name: process.env.MAIL_FROM_NAME,
};

export const FIREBASE_ADMIN = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_ADMIN_CLIENT_ID,
    databaseURL: process.env.FIREBASE_ADMIN_DATABASE_URL,
};
