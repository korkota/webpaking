"use strict";

import foo from './foo';
import bar from './bar';
import 'whatwg-fetch';

fetch('http://api.fixer.io/latest')
  .then(function(response) {
    return response.text()
  }).then(function(body) {
    alert('about-' + foo + bar() + body);
  });


