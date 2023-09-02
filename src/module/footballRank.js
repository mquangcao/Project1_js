import { parse } from 'node-html-parser';
import axios from 'axios';
import * as dotenv from 'dotenv';
import Config from '../../utils/Config.js';
dotenv.config();

const laliga_Link = process.env.URL_LALIGA || '';

class footballRank {
  static async getInfo(url) {
    try {
      const response = await axios.get(url).catch((err) => {
        if (err.response.status !== 200) if (err.response.status === 404) throw new Error("Couldn't find");
        throw new Error(err.response.statusText);
      });
      const data = await parse(response.data);
      const table = data.querySelector('.table');
      const tbody = table.querySelector('tbody');
      const tr = tbody.querySelectorAll('tr');
      const dataList = tr.map((e, i) => {
        return {
          index: i + 1,
          img: e.querySelector('.info-club').childNodes[1].rawAttrs.split('"')[1],
          infoClub: e.querySelector('.info-club').childNodes[2].innerText.trim(),
          point: e.querySelectorAll('strong')[1].innerText,
          nom: e.querySelectorAll('strong')[0].innerText,
        };
      });
      return {
        dataList,
        formatString() {
          let text = '    - Bảng xếp hạng laliga - \n';
          text += Config.line + '\n';
          this.dataList.forEach((e) => {
            text += `Tên câu lạc bộ : ${e.infoClub}\n`;
            text += `Xếp hạng : ${e.index}\n`;
            text += `Số trận : ${e.nom}\n`;
            text += `Điểm : ${e.point}\n`;
            text += Config.line + '\n';
          });
          return text;
        },
      };
    } catch (error) {
      if (error.response.status === 404) return Promise.reject('Lỗi lấy dữ liệu.');
      return Promise.reject('Lỗi ' + error.response.status);
    }
  }
}

export default footballRank;
