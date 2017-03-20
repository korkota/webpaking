"use strict";

import foo from './foo';
import bar from './bar';

Symbol();

new Observable(observer => {
  observer.next('hello');
  observer.next('world');
  observer.complete();
}).forEach(it => console.log(it))
  .then(_ => console.log('!'));

async function test() {
  return new Promise();
}

fetch('http://api.fixer.io/latest')
  .then(function(response) {
    return response.text()
  }).then(function(body) {
    alert('about-' + foo + bar() + body + '*'.repeat(10));
  });


