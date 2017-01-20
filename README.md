# kafka-to-sqs

> Kafka to SQS service, convert Kafka messages to SQS jobs.

[![CircleCI](https://circleci.com/gh/waldophotos/node-kafka-to-sqs.svg?style=svg&circle-token=fa0cd4e293286b9953fd84482a925e360cb42845)](https://circleci.com/gh/waldophotos/node-kafka-to-sqs)

## Install

Install the module using NPM:

```
npm install @waldo/kafka-to-sqs --save
```

## Documentation

kafka-to-sqs exports a Constructor that you have to instantiate before starting the service.

```js
const KafkaToSqs = require('@waldo/kafka-to-sqs');

const kafkaToSqs = new KafkaToSqs();
```

To start the service you need to invoke the `init(opts)` method on the instance:

```js
const opts = {
    topic: 'kafka-topic',
    consumerGroup: 'kafka-consumer-group',
    log: logger,
    sqsUrl: 'https://....',
};

kafkaToSqs.init(opts)
    .then(function() {
        console.log('Service is running');
    });
```

The `init(opts)` returns a Bluebird Promise and requires the following options:

* `topic` **String Required** The kafka topic to consume on.
* `consumerGroup` **String Required** The kafka consumer group.
* `log` **Object Required** An object containing the methods: info, warn, error.
* `sqsUrl` **String Required** The url to the SQS queue.


## Releasing

1. Update the changelog bellow.
1. Ensure you are on master.
1. Type: `grunt release`
    * `grunt release:minor` for minor number jump.
    * `grunt release:major` for major number jump.

## Release History

- **v0.1.2**, *20 Jan 2017*
    - Update to @waldo/node-kafka `0.1.1`.
- **v0.1.1**, *18 Jan 2017*
    - Update to @waldo/node-kafka `0.1.0`.
- **v0.1.0**, *17 Jan 2017*
    - Added `dispose()` method.
- **v0.0.1**, *11 Jan 2017*
    - Big Bang

## License

Copyright Waldo, Inc. All rights reserved.
