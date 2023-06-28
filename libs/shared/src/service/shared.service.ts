import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { SharedServiceInterface } from '@app/shared/interfaces/shared.service.interface';

@Injectable()
export class SharedService implements SharedServiceInterface {
  constructor(private readonly configService: ConfigService) {}
  getRmqOptions(queue: string): RmqOptions {
    const USER = this.configService.get<string>('RABBITMQ_USER');
    const PASSWORD = this.configService.get<string>('RABBITMQ_PASS');
    const HOST = this.configService.get<string>('RABBITMQ_HOST');
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef(); //allow particular messenger
    const message = context.getMessage();
    channel.ack(message);
  }
}