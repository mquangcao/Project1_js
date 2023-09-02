import axios from 'axios';
import { parse } from 'node-html-parser';

class deadlineFromHCMUS {
  static async getDeadline(cookie) {
    if (!cookie) throw new Error('Không tìm thấy cookie.');
    const { data } = await axios
      .get('https://courses.fit.hcmus.edu.vn/calendar/view.php?view=month', {
        headers: { cookie: cookie },
      })
      .catch((err) => {
        throw err;
      });
    const key = [];
    try {
      const page = parse(data).getElementById('page'); //query #page
      const tbody = page.querySelector('table').querySelector('tbody'); //query tbody
      const node = tbody.querySelectorAll('.text-md-left'); //query .text-md-left
      node.map((e) => {
        if (e.querySelector('ul')) {
          let temp = [];
          temp.push(this.getDate(e, '.aalink', 'data-day', 'data-month', 'data-year'));
          temp.push(e.querySelector('.eventname').innerHTML);
          key.push(temp);
        }
      });
    } catch (error) {
      throw error;
    }
    return key;
  }

  static getDate = (e, element, ...params) => {
    try {
      const date = [];
      const card = e.querySelector(element);
      params.forEach((e) => {
        date.push(card.getAttribute(e));
      });
      return date;
    } catch (error) {
      throw error;
    }
  };
}

export default deadlineFromHCMUS;
