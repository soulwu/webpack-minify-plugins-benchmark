const kolor = require('kolorist');
const { Suite } = require('benchmark');

function SimpleLogger(log = console.log) {
  return {
    start(name) {
      log(kolor.underline(`${name}:`));
    },
    complete(fastest) {
      log(`\nFastest is ${kolor.green(fastest)}\n`);
    },
    cycle(name, ops, delta, runs) {
      const opsDisplay = kolor.yellow(
        new Intl.NumberFormat('en', {
          maximumFractionDigits: 3,
          useGrouping: true,
        }).format(ops),
      );

      const deltaDisplay = delta.toFixed(2);

      log(
        `${name} ${kolor.dim('x')} ${opsDisplay} ${kolor.dim('ops/sec')} ±${deltaDisplay} ${kolor.dim(
          `(${runs} runs sampled)`,
        )}`,
      );
    },
  };
}

module.exports = class Benchmark {
  constructor(name = '', logger = SimpleLogger(), suite = new Suite()) {
    this.name = name;
    this.logger = logger;
    this.suite = suite;
    this.hasErrored = false;

    if (this.name !== '') {
      this.suite.on('start', () => {
        this.logger.start(this.name);
      });
    }

    this.suite.on('cycle', event => {
      if (this.hasErrored) {
        return;
      }

      const bench = event.target;
      this.logger.cycle(bench.name, bench.hz, bench.stats.rme, bench.stats.sample.length);
    });
  }

  add(name, fn, options) {
    this.suite.add(name, fn, options);
    return this;
  }

  run() {
    return new Promise((resolve, reject) => {
      const self = this;
      this.suite.on('complete', function () {
        if (self.hasErrored) {
          return;
        }
        const winner = this.filter('fastest').map('name');
        self.logger.complete(winner);
        resolve();
      });
      this.suite.on('error', event => {
        self.hasErrored = true;
        reject(event.target.error);
      });
      this.suite.run({ async: true });
    });
  }
};
