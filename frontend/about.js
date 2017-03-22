'use strict';

import foo from './foo';
import bar from './bar';

new Observable(observer => {
  observer.next('hello');
  observer.next('world');
  observer.complete();
}).forEach(it => console.log(it))
  .then(_ => console.log('!'));

Symbol('test');

async function test() {
  const result = await new Promise((resolve) => resolve('resolved'));
  alert(result);
}

test();

let work = require('imports-loader?workSettings=>{delay:500}!exports-loader?Work!work');
work();

fetch('http://api.fixer.io/latest')
  .then(function(response) {
    return response.text()
  }).then(function(body) {
    alert('about-' + foo + bar() + body + '*'.repeat(10));
  });


