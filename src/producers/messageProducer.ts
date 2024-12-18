
import { Partitioners } from 'kafkajs';
import { kafka } from '../config/kafka';
import { Message } from '../models/message';

export class MessageProducer {
  private producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner
  });

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  async publishMessage(topic: string, message: Message) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}

// -------------------------------------------------------- PRODUCER: Message-Event -- //
// -------------------------------------------------------- ----------------------- -- //

export async function messageEventPush(eventTopic:string, eventContent:string) {
 
  const producer = new MessageProducer();
  await producer.connect();

  const eventMessage = {
    id: Date.now().toString(),
    content: eventContent,
    timestamp: Date.now(),
  };

  await producer.publishMessage(eventTopic, eventMessage);
  console.log('Message-Event Push');
  await producer.disconnect();

}

