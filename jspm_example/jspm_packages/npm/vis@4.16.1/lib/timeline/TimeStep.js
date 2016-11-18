/* */ 
var moment = require('../module/moment');
var DateUtil = require('./DateUtil');
var util = require('../util');
function TimeStep(start, end, minimumStep, hiddenDates) {
  this.moment = moment;
  this.current = this.moment();
  this._start = this.moment();
  this._end = this.moment();
  this.autoScale = true;
  this.scale = 'day';
  this.step = 1;
  this.setRange(start, end, minimumStep);
  this.switchedDay = false;
  this.switchedMonth = false;
  this.switchedYear = false;
  if (Array.isArray(hiddenDates)) {
    this.hiddenDates = hiddenDates;
  } else if (hiddenDates != undefined) {
    this.hiddenDates = [hiddenDates];
  } else {
    this.hiddenDates = [];
  }
  this.format = TimeStep.FORMAT;
}
TimeStep.FORMAT = {
  minorLabels: {
    millisecond: 'SSS',
    second: 's',
    minute: 'HH:mm',
    hour: 'HH:mm',
    weekday: 'ddd D',
    day: 'D',
    month: 'MMM',
    year: 'YYYY'
  },
  majorLabels: {
    millisecond: 'HH:mm:ss',
    second: 'D MMMM HH:mm',
    minute: 'ddd D MMMM',
    hour: 'ddd D MMMM',
    weekday: 'MMMM YYYY',
    day: 'MMMM YYYY',
    month: 'YYYY',
    year: ''
  }
};
TimeStep.prototype.setMoment = function(moment) {
  this.moment = moment;
  this.current = this.moment(this.current);
  this._start = this.moment(this._start);
  this._end = this.moment(this._end);
};
TimeStep.prototype.setFormat = function(format) {
  var defaultFormat = util.deepExtend({}, TimeStep.FORMAT);
  this.format = util.deepExtend(defaultFormat, format);
};
TimeStep.prototype.setRange = function(start, end, minimumStep) {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    throw "No legal start or end date in method setRange";
  }
  this._start = (start != undefined) ? this.moment(start.valueOf()) : new Date();
  this._end = (end != undefined) ? this.moment(end.valueOf()) : new Date();
  if (this.autoScale) {
    this.setMinimumStep(minimumStep);
  }
};
TimeStep.prototype.start = function() {
  this.current = this._start.clone();
  this.roundToMinor();
};
TimeStep.prototype.roundToMinor = function() {
  switch (this.scale) {
    case 'year':
      this.current.year(this.step * Math.floor(this.current.year() / this.step));
      this.current.month(0);
    case 'month':
      this.current.date(1);
    case 'day':
    case 'weekday':
      this.current.hours(0);
    case 'hour':
      this.current.minutes(0);
    case 'minute':
      this.current.seconds(0);
    case 'second':
      this.current.milliseconds(0);
  }
  if (this.step != 1) {
    switch (this.scale) {
      case 'millisecond':
        this.current.subtract(this.current.milliseconds() % this.step, 'milliseconds');
        break;
      case 'second':
        this.current.subtract(this.current.seconds() % this.step, 'seconds');
        break;
      case 'minute':
        this.current.subtract(this.current.minutes() % this.step, 'minutes');
        break;
      case 'hour':
        this.current.subtract(this.current.hours() % this.step, 'hours');
        break;
      case 'weekday':
      case 'day':
        this.current.subtract((this.current.date() - 1) % this.step, 'day');
        break;
      case 'month':
        this.current.subtract(this.current.month() % this.step, 'month');
        break;
      case 'year':
        this.current.subtract(this.current.year() % this.step, 'year');
        break;
      default:
        break;
    }
  }
};
TimeStep.prototype.hasNext = function() {
  return (this.current.valueOf() <= this._end.valueOf());
};
TimeStep.prototype.next = function() {
  var prev = this.current.valueOf();
  if (this.current.month() < 6) {
    switch (this.scale) {
      case 'millisecond':
        this.current.add(this.step, 'millisecond');
        break;
      case 'second':
        this.current.add(this.step, 'second');
        break;
      case 'minute':
        this.current.add(this.step, 'minute');
        break;
      case 'hour':
        this.current.add(this.step, 'hour');
        this.current.subtract(this.current.hours() % this.step, 'hour');
        break;
      case 'weekday':
      case 'day':
        this.current.add(this.step, 'day');
        break;
      case 'month':
        this.current.add(this.step, 'month');
        break;
      case 'year':
        this.current.add(this.step, 'year');
        break;
      default:
        break;
    }
  } else {
    switch (this.scale) {
      case 'millisecond':
        this.current.add(this.step, 'millisecond');
        break;
      case 'second':
        this.current.add(this.step, 'second');
        break;
      case 'minute':
        this.current.add(this.step, 'minute');
        break;
      case 'hour':
        this.current.add(this.step, 'hour');
        break;
      case 'weekday':
      case 'day':
        this.current.add(this.step, 'day');
        break;
      case 'month':
        this.current.add(this.step, 'month');
        break;
      case 'year':
        this.current.add(this.step, 'year');
        break;
      default:
        break;
    }
  }
  if (this.step != 1) {
    switch (this.scale) {
      case 'millisecond':
        if (this.current.milliseconds() < this.step)
          this.current.milliseconds(0);
        break;
      case 'second':
        if (this.current.seconds() < this.step)
          this.current.seconds(0);
        break;
      case 'minute':
        if (this.current.minutes() < this.step)
          this.current.minutes(0);
        break;
      case 'hour':
        if (this.current.hours() < this.step)
          this.current.hours(0);
        break;
      case 'weekday':
      case 'day':
        if (this.current.date() < this.step + 1)
          this.current.date(1);
        break;
      case 'month':
        if (this.current.month() < this.step)
          this.current.month(0);
        break;
      case 'year':
        break;
      default:
        break;
    }
  }
  if (this.current.valueOf() == prev) {
    this.current = this._end.clone();
  }
  DateUtil.stepOverHiddenDates(this.moment, this, prev);
};
TimeStep.prototype.getCurrent = function() {
  return this.current;
};
TimeStep.prototype.setScale = function(params) {
  if (params && typeof params.scale == 'string') {
    this.scale = params.scale;
    this.step = params.step > 0 ? params.step : 1;
    this.autoScale = false;
  }
};
TimeStep.prototype.setAutoScale = function(enable) {
  this.autoScale = enable;
};
TimeStep.prototype.setMinimumStep = function(minimumStep) {
  if (minimumStep == undefined) {
    return;
  }
  var stepYear = (1000 * 60 * 60 * 24 * 30 * 12);
  var stepMonth = (1000 * 60 * 60 * 24 * 30);
  var stepDay = (1000 * 60 * 60 * 24);
  var stepHour = (1000 * 60 * 60);
  var stepMinute = (1000 * 60);
  var stepSecond = (1000);
  var stepMillisecond = (1);
  if (stepYear * 1000 > minimumStep) {
    this.scale = 'year';
    this.step = 1000;
  }
  if (stepYear * 500 > minimumStep) {
    this.scale = 'year';
    this.step = 500;
  }
  if (stepYear * 100 > minimumStep) {
    this.scale = 'year';
    this.step = 100;
  }
  if (stepYear * 50 > minimumStep) {
    this.scale = 'year';
    this.step = 50;
  }
  if (stepYear * 10 > minimumStep) {
    this.scale = 'year';
    this.step = 10;
  }
  if (stepYear * 5 > minimumStep) {
    this.scale = 'year';
    this.step = 5;
  }
  if (stepYear > minimumStep) {
    this.scale = 'year';
    this.step = 1;
  }
  if (stepMonth * 3 > minimumStep) {
    this.scale = 'month';
    this.step = 3;
  }
  if (stepMonth > minimumStep) {
    this.scale = 'month';
    this.step = 1;
  }
  if (stepDay * 5 > minimumStep) {
    this.scale = 'day';
    this.step = 5;
  }
  if (stepDay * 2 > minimumStep) {
    this.scale = 'day';
    this.step = 2;
  }
  if (stepDay > minimumStep) {
    this.scale = 'day';
    this.step = 1;
  }
  if (stepDay / 2 > minimumStep) {
    this.scale = 'weekday';
    this.step = 1;
  }
  if (stepHour * 4 > minimumStep) {
    this.scale = 'hour';
    this.step = 4;
  }
  if (stepHour > minimumStep) {
    this.scale = 'hour';
    this.step = 1;
  }
  if (stepMinute * 15 > minimumStep) {
    this.scale = 'minute';
    this.step = 15;
  }
  if (stepMinute * 10 > minimumStep) {
    this.scale = 'minute';
    this.step = 10;
  }
  if (stepMinute * 5 > minimumStep) {
    this.scale = 'minute';
    this.step = 5;
  }
  if (stepMinute > minimumStep) {
    this.scale = 'minute';
    this.step = 1;
  }
  if (stepSecond * 15 > minimumStep) {
    this.scale = 'second';
    this.step = 15;
  }
  if (stepSecond * 10 > minimumStep) {
    this.scale = 'second';
    this.step = 10;
  }
  if (stepSecond * 5 > minimumStep) {
    this.scale = 'second';
    this.step = 5;
  }
  if (stepSecond > minimumStep) {
    this.scale = 'second';
    this.step = 1;
  }
  if (stepMillisecond * 200 > minimumStep) {
    this.scale = 'millisecond';
    this.step = 200;
  }
  if (stepMillisecond * 100 > minimumStep) {
    this.scale = 'millisecond';
    this.step = 100;
  }
  if (stepMillisecond * 50 > minimumStep) {
    this.scale = 'millisecond';
    this.step = 50;
  }
  if (stepMillisecond * 10 > minimumStep) {
    this.scale = 'millisecond';
    this.step = 10;
  }
  if (stepMillisecond * 5 > minimumStep) {
    this.scale = 'millisecond';
    this.step = 5;
  }
  if (stepMillisecond > minimumStep) {
    this.scale = 'millisecond';
    this.step = 1;
  }
};
TimeStep.snap = function(date, scale, step) {
  var clone = moment(date);
  if (scale == 'year') {
    var year = clone.year() + Math.round(clone.month() / 12);
    clone.year(Math.round(year / step) * step);
    clone.month(0);
    clone.date(0);
    clone.hours(0);
    clone.minutes(0);
    clone.seconds(0);
    clone.milliseconds(0);
  } else if (scale == 'month') {
    if (clone.date() > 15) {
      clone.date(1);
      clone.add(1, 'month');
    } else {
      clone.date(1);
    }
    clone.hours(0);
    clone.minutes(0);
    clone.seconds(0);
    clone.milliseconds(0);
  } else if (scale == 'day') {
    switch (step) {
      case 5:
      case 2:
        clone.hours(Math.round(clone.hours() / 24) * 24);
        break;
      default:
        clone.hours(Math.round(clone.hours() / 12) * 12);
        break;
    }
    clone.minutes(0);
    clone.seconds(0);
    clone.milliseconds(0);
  } else if (scale == 'weekday') {
    switch (step) {
      case 5:
      case 2:
        clone.hours(Math.round(clone.hours() / 12) * 12);
        break;
      default:
        clone.hours(Math.round(clone.hours() / 6) * 6);
        break;
    }
    clone.minutes(0);
    clone.seconds(0);
    clone.milliseconds(0);
  } else if (scale == 'hour') {
    switch (step) {
      case 4:
        clone.minutes(Math.round(clone.minutes() / 60) * 60);
        break;
      default:
        clone.minutes(Math.round(clone.minutes() / 30) * 30);
        break;
    }
    clone.seconds(0);
    clone.milliseconds(0);
  } else if (scale == 'minute') {
    switch (step) {
      case 15:
      case 10:
        clone.minutes(Math.round(clone.minutes() / 5) * 5);
        clone.seconds(0);
        break;
      case 5:
        clone.seconds(Math.round(clone.seconds() / 60) * 60);
        break;
      default:
        clone.seconds(Math.round(clone.seconds() / 30) * 30);
        break;
    }
    clone.milliseconds(0);
  } else if (scale == 'second') {
    switch (step) {
      case 15:
      case 10:
        clone.seconds(Math.round(clone.seconds() / 5) * 5);
        clone.milliseconds(0);
        break;
      case 5:
        clone.milliseconds(Math.round(clone.milliseconds() / 1000) * 1000);
        break;
      default:
        clone.milliseconds(Math.round(clone.milliseconds() / 500) * 500);
        break;
    }
  } else if (scale == 'millisecond') {
    var _step = step > 5 ? step / 2 : 1;
    clone.milliseconds(Math.round(clone.milliseconds() / _step) * _step);
  }
  return clone;
};
TimeStep.prototype.isMajor = function() {
  if (this.switchedYear == true) {
    this.switchedYear = false;
    switch (this.scale) {
      case 'year':
      case 'month':
      case 'weekday':
      case 'day':
      case 'hour':
      case 'minute':
      case 'second':
      case 'millisecond':
        return true;
      default:
        return false;
    }
  } else if (this.switchedMonth == true) {
    this.switchedMonth = false;
    switch (this.scale) {
      case 'weekday':
      case 'day':
      case 'hour':
      case 'minute':
      case 'second':
      case 'millisecond':
        return true;
      default:
        return false;
    }
  } else if (this.switchedDay == true) {
    this.switchedDay = false;
    switch (this.scale) {
      case 'millisecond':
      case 'second':
      case 'minute':
      case 'hour':
        return true;
      default:
        return false;
    }
  }
  var date = this.moment(this.current);
  switch (this.scale) {
    case 'millisecond':
      return (date.milliseconds() == 0);
    case 'second':
      return (date.seconds() == 0);
    case 'minute':
      return (date.hours() == 0) && (date.minutes() == 0);
    case 'hour':
      return (date.hours() == 0);
    case 'weekday':
    case 'day':
      return (date.date() == 1);
    case 'month':
      return (date.month() == 0);
    case 'year':
      return false;
    default:
      return false;
  }
};
TimeStep.prototype.getLabelMinor = function(date) {
  if (date == undefined) {
    date = this.current;
  }
  var format = this.format.minorLabels[this.scale];
  return (format && format.length > 0) ? this.moment(date).format(format) : '';
};
TimeStep.prototype.getLabelMajor = function(date) {
  if (date == undefined) {
    date = this.current;
  }
  var format = this.format.majorLabels[this.scale];
  return (format && format.length > 0) ? this.moment(date).format(format) : '';
};
TimeStep.prototype.getClassName = function() {
  var _moment = this.moment;
  var m = this.moment(this.current);
  var current = m.locale ? m.locale('en') : m.lang('en');
  var step = this.step;
  function even(value) {
    return (value / step % 2 == 0) ? ' vis-even' : ' vis-odd';
  }
  function today(date) {
    if (date.isSame(new Date(), 'day')) {
      return ' vis-today';
    }
    if (date.isSame(_moment().add(1, 'day'), 'day')) {
      return ' vis-tomorrow';
    }
    if (date.isSame(_moment().add(-1, 'day'), 'day')) {
      return ' vis-yesterday';
    }
    return '';
  }
  function currentWeek(date) {
    return date.isSame(new Date(), 'week') ? ' vis-current-week' : '';
  }
  function currentMonth(date) {
    return date.isSame(new Date(), 'month') ? ' vis-current-month' : '';
  }
  function currentYear(date) {
    return date.isSame(new Date(), 'year') ? ' vis-current-year' : '';
  }
  switch (this.scale) {
    case 'millisecond':
      return even(current.milliseconds()).trim();
    case 'second':
      return even(current.seconds()).trim();
    case 'minute':
      return even(current.minutes()).trim();
    case 'hour':
      var hours = current.hours();
      if (this.step == 4) {
        hours = hours + '-h' + (hours + 4);
      }
      return 'vis-h' + hours + today(current) + even(current.hours());
    case 'weekday':
      return 'vis-' + current.format('dddd').toLowerCase() + today(current) + currentWeek(current) + even(current.date());
    case 'day':
      var day = current.date();
      var month = current.format('MMMM').toLowerCase();
      return 'vis-day' + day + ' vis-' + month + currentMonth(current) + even(day - 1);
    case 'month':
      return 'vis-' + current.format('MMMM').toLowerCase() + currentMonth(current) + even(current.month());
    case 'year':
      var year = current.year();
      return 'vis-year' + year + currentYear(current) + even(year);
    default:
      return '';
  }
};
module.exports = TimeStep;
