import { MQTT_SERVICE } from "@base/core/constants";
import { MqttModule } from "@modules/mqtt/mqtt.module";

export const mqttProviders = [
  {
    provide: MQTT_SERVICE,
    useClass: MqttModule
  },
];