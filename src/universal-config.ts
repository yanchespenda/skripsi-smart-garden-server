import * as dotenv from 'dotenv';
// import * as fs from 'fs';
dotenv.config();

export const MQTT_CONFIG = {
    url: process.env.MQTT_URL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    protocol: process.env.MQTT_PROTOCOL || 'mqtt',

    // ca: fs.readFileSync(__dirname + '/../cert/AmazonRootCA1.pem'),
    // cert: fs.readFileSync(__dirname + '/../cert/b11593ea74-certificate.pem.crt'),
    // private: fs.readFileSync(__dirname + '/../cert/b11593ea74-private.pem.key'),
    // public: fs.readFileSync(__dirname + '/../cert/b11593ea74-public.pem.key'),
};