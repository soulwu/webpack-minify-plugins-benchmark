const Benchmark = require('./benchmark');
const { mediumCases } = require('./utils');

const suite = new Benchmark('medium-sample');

mediumCases.forEach(testCase => {
  suite.add(...testCase);
});

suite.run();
