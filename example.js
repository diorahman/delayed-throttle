'use strict';

const create = require('./');
const fetch = require('node-fetch');
const {load} = require('cheerio');

const throttle = create(/* max number of processes */ 2, /* delay */ 5000);

const urls = [
  'https://hooq.tv',
  'https://google.com',
  'https://bing.com',
  'https://test.com',
  'http://cnn.com',
  'https://woot.com'
];

console.log('delayed 5000 ms + time taken by the process (concurrent level: 2)');

Promise.all(
  urls.map(url => throttle(async () => {
    console.log('GRABBING TITLE FOR', url, 'AT', new Date());
    const res = await fetch(url);
    const data = await res.text();
    const $ = load(data);
    return $('title').text();
  })))
  .then(titles => console.log('Titles:', titles))
  .catch(err => console.error(err.stack));
