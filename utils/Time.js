class Time {
  static getTime() {
    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth();
    const hour = date.getHours() < 10 ? `0${date.getHours()}h` : `${date.getHours()}h`;
    const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
    return {
      Date: `| ${Object.keys(dates)[day]} - ${date.getDate()} ${Object.values(months)[month]} |`,
      Time: `⏱ ${hour}:${minute}:${seconds}`,
    };
  }
  static getFullTime() {
    const time = this.getTime();
    return `  ${time.Time} 🔛 ${time.Date}`;
  }
}

const dates = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};
const months = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export default Time;
