import { RABBITMQ_PASSWORD, RABBITMQ_PORT, RABBITMQ_USER } from 'constants/env'
import { processMessage } from './redis'
import rascal from 'rascal'
import logger from 'utils/logger'

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
      exchanges: {
        'RedisExchange': {
          assert: true,
          type: 'direct',
          options: {
            durable: true,
          }
        }
      },
      queues: {
        "RedisQueue": {
          assert: true,
          options: {
            durable: true,
            deadLetterExchange: 'RedisExchange'
          },
        }
      },
      bindings: [{
        source: 'RedisExchange',
        destinationType: 'queue',
        destination: 'RedisQueue'
      }],
      publications: {
        "update_redis": {
          queue: "RedisQueue",
        },
      },
      subscriptions: {
        "update_redis": {
          vhost: '/',
          queue: "RedisQueue"
        }
      },
    },
  },
};

const broker: rascal.BrokerAsPromised = await rascal.BrokerAsPromised.create(config)
broker.on('error', (err) => console.error(err))

export default broker

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

await initializeSubscription();

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