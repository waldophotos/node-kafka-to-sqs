/*
 * kafka-to-sqs
 * Kafka to SQS service, convert Kafka messages to SQS jobs.
 * https://github.com/waldo/node-kafka-to-sqs
 *
 * Copyright © Waldo, Inc.
 * All rights reserved.
 */

/**
* @fileOverview Service responsible for fetching kafka messages
*   and creating SQS jobs based on them.
*/

const Promise = require('bluebird');
const cip = require('cip');
const kafkaLib = require('@waldo/node-kafka');
const sqsLib = require('@waldo/sqs');

const KafkaToSqs = module.exports = cip.extend(function() {
  /** @type {?waldo/node-kafka.Consumer} Consumer instance. */
  this.consumer = null;
  /** @type {?app.services.SqsService} sqs service instance. */
  this.sqs = null;
  /** @type {?Object} The options as passed by the user */
  this.opts = null;
});

/**
 * Initializes the service.
 *
 * @param {Object} opts Options to boot the service.
 *   @param {string} topic The kafka topic to consume on.
 *   @param {Object} log An object containing the methods: info, warn, error.
 *   @param {string} consumerGroup The kafka topic consumer group.
 *   @param {string} sqsUrl The url to the SQS queue.
 * @return {Promise} A Promise.
 */
KafkaToSqs.prototype.init = Promise.method(function (opts) {

  this._validateOptions(opts);

  this.opts = opts;

  this.consumer = new kafkaLib.Consumer({
    topic: this.opts.topic,
    log: this.opts.log,
  });

  let consumerPromise = this.consumer.connect({
    consumerGroup: this.opts.consumerGroup,
    onMessage: this._createSqsJob.bind(this),
    onError: this._onError.bind(this),
  });

  this.sqs = sqsLib({
    sqsUrl: this.opts.sqsUrl,
    concurrentOpsLimit: 1, // we won't be fetching jobs
    logger: this.opts.log,
  });
  let sqsPromise = this.sqs.init();

  return Promise.all([consumerPromise, sqsPromise]);
});

/**
 * Validate incoming options.
 *
 * @param {Object} opts Examine.
 * @throws {TypeError} if options are not good.
 */
KafkaToSqs.prototype._validateOptions = function (opts) {
  if (!opts) {
    throw new TypeError('Options are required');
  }
  if (typeof opts.topic !== 'string' || !opts.topic.length) {
    throw new TypeError('"topic" is required');
  }

  if (typeof opts.log !== 'object') {
    throw new TypeError('"log" is required');
  }

  if (typeof opts.log.info !== 'function' ||
    typeof opts.log.warn !== 'function' ||
    typeof opts.log.error !== 'function') {

    throw new TypeError('"topic" must have methods: info, warn, error');
  }

  if (typeof opts.consumerGroup !== 'string' || !opts.consumerGroup.length) {
    throw new TypeError('"consumerGroup" is required');
  }

  if (typeof opts.sqsUrl !== 'string' || !opts.sqsUrl.length) {
    throw new TypeError('"sqsUrl" is required');
  }
};

/**
 * Handle consumer stream errors.
 *
 * @param {Error} err The error.
 * @private
 */
KafkaToSqs.prototype._onError = function (err) {
  this.opts.log.error('KafkaToSqs._onError() :: Kafka stream error for topic:',
    this.opts.topic, 'Error:', err);
};

/**
 * Transpose a kafka message to an SQS job.
 *
 * @param {Object} message The kafka message.
 * @private
 */
KafkaToSqs.prototype._createSqsJob = function (kafkaMessage) {
  if (!kafkaMessage.value) {
    this.opts.log.warn('KafkaToSqs._createSqsJob() :: No value',
      'provided, skipping SQS creation for topic:', this.opts.topic,
      '. Raw message', kafkaMessage);
    return;
  }
  const message = kafkaMessage.value;

  this.opts.log.info('KafkaToSqs._createSqsJob() :: Received message for topic:',
    this.opts.topic);

  this.sqs.createJob(message)
    .bind(this)
    .catch(function(err) {
      this.opts.log.error('KafkaToSqs._createSqsJob() :: Error creating SQS job',
        'for topic:', this.opts.topic, 'Error:', err);
    });
};
