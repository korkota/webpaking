"use strict";

import bar from './bar';
import moment from 'moment';

const now = moment(new Date()).locale('ru').format('LLLL');

alert(`${now}: home- ${bar()}`);
