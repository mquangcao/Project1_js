import { Weather, Deadline, kbb, Birthday } from '../commands/index.js';
import { Logger, Time, configs } from '../../utils/index.js';

class Controller {
  constructor() {
    Logger.check(`${configs.line}${Time.getFullTime()}   ${configs.line}`);
    this.asyncF = this.asyncFunc();
    this.main = this.mainFunc();
  }
  asyncFunc() {
    Promise.all([Weather.callData('--get', 'bình dương'), Deadline.callData()]).then((value) => {
      Logger.log('Loading..............');
      const [weather, deadline] = value;
      weather.data ? Logger.log(weather.data.text) : Logger.error(weather.error);
      deadline.data ? Logger.log(deadline.data) : Logger.error(deadline.error);
    });
  }

  mainFunc() {
    //Khéo búa bao
    const selectKBB = 'bao';
    Logger[selectKBB ? 'log' : 'error'](new kbb(selectKBB).callData());
    //Đếm ngược ngày sinh nhật
    // const birthDay = new Birthday().callData();
    // birthDay.data ? Logger.log(birthDay.data) : Logger.error(birthDay.error);
  }
}

export default Controller;
