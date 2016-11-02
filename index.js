'use-strict';

const delay = (period) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, period);
  });
}

const work = (queue, period) => {
  if (queue.length === 0) {
    return;
  }

  const fn = queue.shift();
  if (period) {
    return delay(period)
      .then(fn);
  }

  fn();
}

module.exports = (max, period) => {
  if (typeof max !== 'number') {
    throw new TypeError('`throttle` expects a valid number');
  }

  let current = 0;
  const queue = [];

  return (fn) => {
    return new Promise((resolve, reject) => {
      function handle() {
        if (current < max) {
          current++;
          fn()
            .then((val) => {
              resolve(val);
              current--;
              work(queue, period);
            })
            .catch((err) => {
              reject(err);
              current--;
              work(queue, period);
            });
        } else {
          queue.push(handle);
        }
      }
      handle();
    });
  }
}
