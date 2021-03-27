import { Test, TestingModule } from '@nestjs/testing';
import { MqttHandlerController } from './mqtt-handler.controller';

describe('MqttHandlerController', () => {
  let controller: MqttHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MqttHandlerController],
    }).compile();

    controller = module.get<MqttHandlerController>(MqttHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
