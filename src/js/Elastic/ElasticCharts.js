import ChartColors from "@/js/Elastic/ChartColors";


class ElasticCharts extends ChartColors{
  url = 'http://es-cl001-node05.local.rk-env.ru:9200'
  projectUrl = '/robot-ivr-cdr/_search'

  debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  getTimeFormat(period, timeRange) {
    if (!Array.isArray(period) || period.length < 2) return 'DD HH:mm';
    const [startDate, endDate] = period;

    const diffInMilliseconds = Math.abs(new Date(endDate) - new Date(startDate));

    if (diffInMilliseconds >= 24 * 60 * 60 * 1000) {
      return 'DD HH:mm';
    } else {
      return 'HH:mm';
    }
  }

  TIME_INTERVALS = {
    ONE_MONTH: 30 * 24 * 60 * 60,     // 31 день
    SEVEN_DAYS: 7 * 24 * 60 * 60, // 7.1 дней в секундах
    FORTY_EIGHT_HOURS: 48 * 60 * 60, // 48 часов в секундах
    THIRTY_SIX_HOURS: 36 * 60 * 60,  // 36 часов в секундах
    TWENTY_FORE_HOURS: 24 * 60 * 60,      // 20 часов в секундах
    TWENTY_HOURS: 20 * 60 * 60,      // 20 часов в секундах
    TWELVE_HOURS: 12 * 60 * 60,     // 12 часов в секундах
    EIGHT_HOURS: 8 * 60 * 60,        // 8 часов в секундах
    THREE_HOURS: 3 * 60 * 60,        // 3 часа в секундах
    ONE_HOUR: 1 * 60 * 60,           // 1 час в секундах
    THIRTY_MINUTES: 30 * 60,         // 30 минут в секундах
    TEN_MINUTES: 10 * 60,            // 10 минут в секундах
    FIVE_MINUTES: 5 * 60,            // 10 минут в секундах
    ONE_MINUTES: 1 * 60,            // 10 минут в секундах
  };

  TIME_INTERVALS_IN_MILISEC = {
    ONE_MONTH: 30 * 24 * 60 * 60 * 1000,     // 31 день
    SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000, // 7.1 дней в мс
    FORTY_EIGHT_HOURS: 48 * 60 * 60 * 1000, // 48 часов в мс
    THIRTY_SIX_HOURS: 36 * 60 * 60 * 1000,  // 36 часов в мс
    TWENTY_FORE_HOURS: 24 * 60 * 60 * 1000,      // 20 часов в мс
    TWENTY_HOURS: 20 * 60 * 60 * 1000,      // 20 часов в мс
    TWELVE_HOURS: 12 * 60 * 60 * 1000,      // 12 часов в мс
    EIGHT_HOURS: 8 * 60 * 60 * 1000,        // 8 часов в мс
    THREE_HOURS: 3 * 60 * 60 * 1000,        // 3 часа в мс
    ONE_HOUR: 1 * 60 * 60 * 1000,           // 1 час в мс
    THIRTY_MINUTES: 30 * 60 * 1000,         // 30 минут в мс
    TEN_MINUTES: 10 * 60 * 1000,            // 10 минут в мс
    FIVE_MINUTES: 5 * 60 * 1000,            // 5 минут в мс
    ONE_MINUTES: 1 * 60 * 1000,            // 1 минута в мс
  };

  chartJsUnitTime = {
    "auto": {
      unit: false
    },
    '1m': {
      unit: 'minute',
    },
    '5m': {
      unit: 'minute',
    },
    '10m': {
      unit: 'minute',
    },
    '30m': {
      unit: 'minute',
    },
    '1h': {
      unit: 'hour',
    },
    '3h': {
      unit: 'hour',
    },
    '12h': {
      unit: 'hour',
    },
    '1d': {
      unit: 'day',
    },
  }

  calculateInterval(period, timeRange, inMiliseconds = false, isRange) {
    if(timeRange && timeRange !== 'auto'){
      if(!isRange){
        return timeRange
      }

      return this.chartJsUnitTime[timeRange]
    }

    if (!Array.isArray(period) || period.length < 2) return '1s';
    const [startDate, endDate] = period;

    if (inMiliseconds) {
      const diffInSeconds = Math.abs((new Date(endDate) - new Date(startDate)) / 1000);
      switch (true) {
        case diffInSeconds >= this.TIME_INTERVALS.ONE_MONTH:
          return this.TIME_INTERVALS.TWENTY_FORE_HOURS; // 12 часа в секундах
        case diffInSeconds >= this.TIME_INTERVALS.SEVEN_DAYS:
          return this.TIME_INTERVALS.TWELVE_HOURS; // 12 часа в секундах
        case diffInSeconds >= this.TIME_INTERVALS.FORTY_EIGHT_HOURS:
          return this.TIME_INTERVALS.THREE_HOURS; // 3 часа в секундах
        case diffInSeconds >= this.TIME_INTERVALS.THIRTY_SIX_HOURS:
          return this.TIME_INTERVALS.ONE_HOUR; // 1 час в секундах
        case diffInSeconds >= this.TIME_INTERVALS.TWENTY_HOURS:
          return this.TIME_INTERVALS.THIRTY_MINUTES; // 30 минут в секундах
        case diffInSeconds >= this.TIME_INTERVALS.EIGHT_HOURS:
          return this.TIME_INTERVALS.TEN_MINUTES; // 10 минут в секундах
        case diffInSeconds >= this.TIME_INTERVALS.THREE_HOURS:
          return this.TIME_INTERVALS.FIVE_MINUTES; // 5 минут в секундах
        case diffInSeconds >= this.TIME_INTERVALS.ONE_HOUR:
          return this.TIME_INTERVALS.ONE_MINUTES; // 1 минута в секундах
        default:
          return 30; // 30 секунд в секундах
      }
    } else {
      const diffInMilliseconds = Math.abs(new Date(endDate) - new Date(startDate));

      if (diffInMilliseconds >= this.TIME_INTERVALS_IN_MILISEC.ONE_MONTH) {
        return isRange ? "day" : '1d';
      } else if (diffInMilliseconds >= this.TIME_INTERVALS_IN_MILISEC.SEVEN_DAYS) {
        return isRange ? "hour" : '12h';
      }  else if (diffInMilliseconds >= this.TIME_INTERVALS_IN_MILISEC.FORTY_EIGHT_HOURS) {
        return isRange ? "hour" : '3h';
      } else if (diffInMilliseconds >= this.TIME_INTERVALS_IN_MILISEC.THIRTY_SIX_HOURS) {
        return isRange ? "hour" : '1h';
      } else if (diffInMilliseconds >= this.TIME_INTERVALS_IN_MILISEC.TWENTY_HOURS) {
        return isRange ? "minute" : '30m';
      } else if (diffInMilliseconds >= this.TIME_INTERVALS_IN_MILISEC.EIGHT_HOURS) {
        return isRange ? "minute" : '10m';
      } else if (diffInMilliseconds >= this.TIME_INTERVALS_IN_MILISEC.THREE_HOURS) {
        return isRange ? "minute" : '5m';
      } else if (diffInMilliseconds >= this.TIME_INTERVALS_IN_MILISEC.ONE_HOUR) {
        return isRange ? "second" : '1m';
      } else {
        return isRange ? "second" : '30s';
      }
    }
  }

  fetchWrapper = async () => {

  }
}

export default ElasticCharts
