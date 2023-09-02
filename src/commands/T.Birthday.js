import { Fs, Logger, FormReturn } from "../../utils/index.js";

class BirthDay {
  constructor() {
    this.configs = {
      name: "Birthday",
      version: "1.0.0",
      description: "Đếm ngược thời gian sinh nhật",
    };

    this.config = this.callDefaultConfigs();
  }

  callData(option = "--get", birthday = "", name = "") {
    if (!this.config)
      FormReturn.errorData(
        "Có lỗi xảy ra trong quá trình đọc setting File.",
        null
      );
    switch (option) {
      case "--set":
        const status = this.setBirthDay(birthday, name);
        return status.data
          ? FormReturn.errorData(null, status.data)
          : FormReturn.errorData(status.error, null);
      case "--del":
        const statusS = this.delBirthDay();
        return statusS.data
          ? FormReturn.errorData(null, statusS.data)
          : FormReturn.errorData(statusS.error, null);
      case "--get":
        if (!birthday) {
          if (this.config.isDefault === false)
            return FormReturn.errorData("Chưa set ngày sinh mặc định.", null);
          birthday = this.config.birthday;
          name = this.config.name;
        }
        this.config.history.push([birthday, name]);
        Fs.writeJSON("./configs/BirthDayConfig.json", this.config);
        const data = this.handleBirthDay(birthday);
        return FormReturn.errorData(null, this.formatString(data, name));
      default:
        return FormReturn.errorData("Lựa chọn không hợp lệ", null);
    }
  }

  handleBirthDay(birthday) {
    if (birthday && birthday != "") {
      const mms = Date.parse(birthday) - Date.parse(new Date());
      const seconds = Math.floor((mms / 1000) % 60);
      const minutes = Math.floor((mms / (1000 * 60)) % 60);
      const hours = Math.floor((mms / (1000 * 60 * 60)) % 24);
      const days = Math.floor(mms / (1000 * 60 * 60 * 24));
      return {
        seconds: seconds,
        minutes: minutes,
        hours: hours,
        days: days,
      };
    }
    return null;
  }

  formatString({ seconds, minutes, hours, days }, name) {
    return `🎂🎉 Thời gian còn lại đến sinh nhật của ${name} là: 🎂🍷  ${days} ngày ${hours} tiếng ${minutes} phút ${seconds} giây`;
  }

  setBirthDay(birthday, name) {
    try {
      this.config.isDefault = true;
      this.config.birthday = birthday;
      this.config.name = name;
      this.config.history.push([birthday, name]);
      Fs.writeJSON("./configs/BirthDayConfig.json", this.config);
      return FormReturn.errorData(null, "Set ngày sinh mặc định thành công.");
    } catch (error) {
      Logger.error(error || "UNKNOWN");
      return FormReturn.errorData(
        "Set ngày sinh mặc định gặp vấn đề trong quá trình thực thi.",
        null
      );
    }
  }

  delBirthDay() {
    try {
      this.config.isDefault = false;
      this.config.name = "";
      this.config.birthday = "";
      Fs.writeJSON("./configs/BirthDayConfig.json", this.config);
      return FormReturn.errorData(null, "Del ngày sinh mặc định thành công.");
    } catch (error) {
      Logger.error(error, "UNKNOWN");
      return FormReturn.errorData(
        null,
        "Del ngày sinh mặc định gặp vấn đề trong quá trình thực thi."
      );
    }
  }

  callDefaultConfigs() {
    try {
      const configs = Fs.readJSON("./configs/BirthDayConfig.json");
      if (!configs || Object.keys(configs).length === 0) {
        this.setBeforeConfigs(configs);
        Fs.writeJSON("./configs/BirthDayConfig.json", configs);
      }
      return {
        isDefault: configs.isDefault,
        birthday: configs.birthday,
        name: configs.name,
        history: configs.history,
      };
    } catch (error) {
      Logger.error(error || "UNKNOWN");
      return null;
    }
  }

  setBeforeConfigs(configs) {
    configs.isDefault = false;
    configs.birthday = "";
    configs.name = "";
    configs.history = [];
  }
}

export default BirthDay;
