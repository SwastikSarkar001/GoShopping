import { RABBITMQ_PASSWORD, RABBITMQ_PORT, RABBITMQ_USER } from 'constants/env';
import rascal from 'rascal'
import redis from './redis';
import logger from 'utils/logger';

// const config: rascal.BrokerConfig = {
//   vhosts: {
//     '/': {
//       exchanges: {
//         'main-exchange': {
//           type: 'direct',
//           durable: true,
//         },
//       },
//       queues: {
//         'task-queue': {
//           durable: true,
//           bind: 'main-exchange',
//           arguments: {
//             'x-dead-letter-exchange': '', // Default exchange
//             'x-dead-letter-routing-key': 'task-dlq', // DLQ routing key
//           },
//         },
//         'dead-letter-queue': {
//           durable: true,
//         },
//       },
//       bindings: [
//         {
//           source: 'main-exchange',   // The source (exchange)
//           destination: 'task-queue', // The destination (queue)
//           routingKeys: ['task'],        // The routing key
//         },
//         {
//           source: 'main-exchange',
//           destination: 'dead-letter-queue',
//           routingKeys: ['task-dlq'],
//         },
//       ],
//       publish: {
//         'task': {
//           routingKey: 'task',
//           persistent: true,
//         },
//       },
//       consume: {
//         'task': {
//           queue: 'task-queue',
//           prefetch: 1,
//         },
//       },
//     },
//   },
//   retry: {
//     retries: 5,
//     factor: 2, // Exponential backoff
//     minTimeout: 1000, // 1 second
//     maxTimeout: 5000, // 5 seconds
//   },
//   deadLetter: {
//     enabled: true,
//     delay: 1000, // 1 second delay before retrying failed messages
//   },
// };

const config: rascal.BrokerConfig = {
  vhosts: {
    "/": {
      connection: {
        url: "amqp://localhost",
        user: RABBITMQ_USER,
        port: RABBITMQ_PORT,
        password: RABBITMQ_PASSWORD,
        options: {
          reconnect: {
            strategy: 'exponential',
            min: 1000,
            max: 60000,
            factor: 2,
          },
        },
      },
      queues: {
        "update_redis_queue": {
          assert: true,
          options: {
            durable: true,
            deadLetterExchange: "dead_letters",
            
          },
        },
        "dead_letters": {
          assert: true,
          options: {
            durable: true,
          },
        },
      },
      publications: {
        "update_redis": {
          queue: "update_redis_queue",
        },
      },
      subscriptions: {
        "update_redis": {
          queue: "update_redis_queue",
        },
        "dead_letters": {
          queue: "dead_letters",
        },
      },
    },
  },
};

let broker: rascal.BrokerAsPromised

async function processMessage(message: {content: {operation: string, data: {key: string, value: string}}, ack: () => void, nack: () => void}) {
  try {
    const { operation, data } = message.content;
    
    if (operation === 'update' && redis.status === 'ready') {
      await redis.set(data.key, data.value);
      console.log('Data updated on Redis successfully');
      logger.info('Data updated on Redis successfully');
      // Acknowledge message
      message.ack();
    }
    else {
      console.error('Failed to process message');
      // Optionally requeue the message for later processing
      message.nack();
    }
  } catch (error) {
    console.error('Failed to process message', error);
    // Optionally requeue the message for later processing
    message.nack();
  }
}

async function initializeSubscription() {
  try {
    rascal.Broker.create(config, (err, broker) => {
      if (err) {
        console.error('Error creating Rascal broker', err);
        return;
      }
    
      // Subscribe to the queue
      broker.subscribe('update_redis', (err, subscription) => {
        if (err) {
          console.error('Error subscribing to queue', err);
          return;
        }
    
        subscription.on('message', (message, content, ackOrNack) => {
          processMessage({
            content,
            ack: () => ackOrNack(undefined),
            nack: () => ackOrNack(new Error('Requeue'))
          });
        }).on('error', (err) => {
          console.error('Subscription error', err);
        });
      });
    })
  } catch (err) {
    console.error('Error initializing subscription', err);
  }
}

// async function initializeSubscription() {
//   try {
//     const broker = await rascal.BrokerAsPromised.create(config);

//     // Subscribe to the queue
//     const subscription = await broker.subscribe('update_redis');

//     subscription.on('message', (message, content, ackOrNack) => {
//       processMessage({
//         content,
//         ack: () => ackOrNack(),
//         nack: () => ackOrNack(new Error('Requeue'))
//       });
//     }).on('error', (err) => {
//       console.error('Subscription error', err);
//     });

//   } catch (err) {
//     console.error('Error initializing subscription', err);
//   }
// }

initializeSubscription();

export async function publishUpdate(operation: string, data: { key: string, value: string }) {
  try {
    rascal.Broker.create(config, (err, broker) => {
      if (err) {
        console.error('Error creating Rascal broker', err);
        logger.error('Failed to create Rascal broker');
        return false;
      }

      // Function to publish messages to the queue
      broker.publish('update_redis', { operation, data }, (err, publication) => {
        if (err) {
          console.error('Publication error', err);
          return false;
        } else {
          publication.on('success', () => {
            console.log('Message published successfully');
            logger.info('Data published on RabbitMQ');
          }).on('error', (err) => {
            console.error('Publication error', err);
            logger.error('Failed to publish data on RabbitMQ');
          });
        }
      });
    });
    return true
  } catch (err) {
    console.error('Failed to publish message', err);
    logger.error('Failed to publish message');
    return false
  }
};