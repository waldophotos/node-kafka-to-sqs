/**
 * @fileOverview Base API Surface tests.
 */
const chai = require('chai');
const expect = chai.expect;

const KafkaToSqs = require('../..');

function throwError() {
  const err = new Error('Should not resolve');
  err.ownError = true;
  throw err;
}

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
      return this.kafkaToSqs.init()
        .then(throwError)
        .catch((err) => {
          if (err.ownError) {
            throw err;
          }

          expect(err).to.be.an.instanceof(TypeError);
        });
    });
    it('should not allow init without anything defined', function() {
      return this.kafkaToSqs.init({})
        .then(throwError)
        .catch((err) => {
          if (err.ownError) {
            throw err;
          }

          expect(err).to.be.an.instanceof(TypeError);
        });
    });
  });
});
