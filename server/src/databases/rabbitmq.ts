import rascal from 'rascal'

const config: rascal.BrokerConfig = {
  vhosts: {
    '/': {
      exchanges: {
        'main-exchange': {
          type: 'direct',
          durable: true,
        },
      },
      queues: {
        'task-queue': {
          durable: true,
          bind: 'main-exchange',
          arguments: {
            'x-dead-letter-exchange': '', // Default exchange
            'x-dead-letter-routing-key': 'task-dlq', // DLQ routing key
          },
        },
        'dead-letter-queue': {
          durable: true,
        },
      },
      bindings: [
        {
          source: 'main-exchange',   // The source (exchange)
          destination: 'task-queue', // The destination (queue)
          routingKeys: ['task'],        // The routing key
        },
        {
          source: 'main-exchange',
          destination: 'dead-letter-queue',
          routingKeys: ['task-dlq'],
        },
      ],
      publish: {
        'task': {
          routingKey: 'task',
          persistent: true,
        },
      },
      consume: {
        'task': {
          queue: 'task-queue',
          prefetch: 1,
        },
      },
    },
  },
  retry: {
    retries: 5,
    factor: 2, // Exponential backoff
    minTimeout: 1000, // 1 second
    maxTimeout: 5000, // 5 seconds
  },
  deadLetter: {
    enabled: true,
    delay: 1000, // 1 second delay before retrying failed messages
  },
};

rascal.createBroker(config, (err, broker) => {
  if (err) {
    console.error('Error creating broker:', err);
    return;
  }

  // Broker is now set up, you can use it for publishing, subscribing, etc.
  broker.publish('task', { taskId: 1, content: 'Do work' }, (publishErr) => {
    if (publishErr) {
      console.error('Failed to publish message:', publishErr);
    } else {
      console.log('Message published!');
    }

    broker.close(); // Always close the broker after usage
  });
});