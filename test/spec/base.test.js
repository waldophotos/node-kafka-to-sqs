/**
 * @fileOverview Base API Surface tests.
 */
const chai = require('chai');
const expect = chai.expect;

const KafkaToSqs = require('../..');

describe('Base API Surface', function() {
  describe('Nominal behaviors', function() {
    it('should expose a constructor', function() {
      expect(KafkaToSqs).to.be.a('function');
    });
    it('instance should have expected methods', function() {
      const kafkaToSqs = new KafkaToSqs();

      expect(kafkaToSqs.init).to.be.a('function');
    });
  });
  describe('Erroneous behaviors', function() {
    beforeEach(function() {
      this.kafkaToSqs = new KafkaToSqs();
    });
    it('should not allow init without an object', function() {
      expect(this.kafkaToSqs.init).to.throw(TypeError);
    });
    it('should not allow init without anything defined', function() {
      const kafkaInit = this.kafkaToSqs.init.bind(this.kafkaToSqs, {});

      expect(kafkaInit).to.throw(TypeError);
    });
  });
});
