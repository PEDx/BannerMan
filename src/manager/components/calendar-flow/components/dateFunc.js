var shortMonth = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
var defMonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const dateFunc = {
  getDuration(date) {
    // how many days of this month
    const dt = new Date(date);
    // let month = dt.getMonth();
    dt.setMonth(dt.getMonth() + 1);
    dt.setDate(0);
    return dt.getDate();
  },
  changeDay(date, num) {
    const dt = new Date(date);
    return new Date(dt.setDate(dt.getDate() + num));
  },
  getStartDate(date) {
    // return first day of this month
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },
  getEndDate(date) {
    // get last day of this month
    const dt = new Date(date.getFullYear(), date.getMonth() + 1, 1); // 1st day of next month
    return new Date(dt.setDate(dt.getDate() - 1)); // last day of this month
  },
  format(date, format, monthNames) {
    let monthNames1;
    let date1 = (monthNames1 = null);
    monthNames1 = monthNames || defMonthNames;
    if (typeof date === 'string') {
      date1 = new Date(date.replace(/-/g, '/'));
    } else {
      date1 = new Date(date);
    }

    var map = {
      M: date1.getMonth() + 1,
      d: date1.getDate(),
      h: date1.getHours(),
      m: date1.getMinutes(),
      s: date1.getSeconds(),
      q: Math.floor((date1.getMonth() + 3) / 3),
      S: date1.getMilliseconds()
    };

    const formatStr = format.replace(/([yMdhmsqS])+/g, (all, t) => {
      // console.log('all', all, t, format)
      var v = map[t];
      if (v !== undefined) {
        if (all === 'MMMM') {
          return monthNames1[v - 1];
        }
        if (all === 'MMM') {
          return shortMonth[v - 1];
        }
        if (all.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }
        return v;
      } else if (t === 'y') {
        return String(date1.getFullYear()).substr(4 - all.length);
      }
      return all;
    });
    // console.log('format res', format)
    return formatStr;
  }
};

module.exports = dateFunc;
