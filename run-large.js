const Benchmark = require('./benchmark');
const { largeCases } = require('./utils');

const suite = new Benchmark('large-sample');

largeCases.forEach(testCase => {
  suite.add(...testCase);
});

suite.run();
