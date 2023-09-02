import deadline from "../module/deadlineHCMUS.js";
import { Fs, Logger, Time } from "../../utils/index.js";

class deadlineHCMUS {
  constructor() {
    this.configs = {
      name: "deadlineCheck",
      version: "1.0.0",
      dependencies: {
        axios: "",
      },
      description: "Kiểm tra deadline của trường HCMUS",
    };

    this.config = Fs.readJSON("./configs/DeadlineConfig.json");
    this.cookie = this.config?.isActive ? this.config.Cookie : this.getCookie();
  }
  async callData() {
    if (!this.config) {
      Logger.error("Không thể tạo được thư mục DeadlineConfig.json.");
      return {
        error: " - Chức năng kiểm tra deadline đang gặp vấn đề.",
        data: undefined,
      };
    }
    if (!this.cookie) {
      this.config.isActive = false;
      this.config.Cookie = "";
      Fs.writeJSON("./configs/DeadlineConfig.json", this.config);
      Logger.error("Cookie có vấn đề ở setting.");
      Logger.warn(
        "Vui lòng bổ sung cookie để khởi động chức năng xem kiểm tra deadline.!!!"
      );
      return {
        error: " - Chức năng kiểm tra deadline đang gặp vấn đề.",
        data: undefined,
      };
    }
    const response = await this.formatString()
      .then((data) => {
        this.config.isActive = true;
        this.config.Cookie = this.cookie;
        this.config?.getTime
          ? this.config.getTime.push(Time.getTime().Time)
          : (this.config.getTime = [Time.getTime().Time]);
        return { data: data };
      })
      .catch((err) => {
        Logger.error(
          (err.message || err.error || err || "UNKNOWN ERROR") +
            " or Cookie hết hạn."
        );
        this.config.isActive = false;
        this.config.Cookie = "";
        return {
          error: " - Chức năng kiểm tra deadline đang gặp vấn đề.",
          data: undefined,
        };
      });

    Fs.writeJSON("./configs/DeadlineConfig.json", this.config);
    return {
      error: response?.error,
      data: response?.data,
    };
  }

  async getData() {
    const data = await deadline.getDeadline(this.cookie).catch((err) => {
      throw err;
    });
    return data;
  }
  async formatString() {
    const response = await this.getData().catch((err) => {
      throw err;
    });
    const data = this.handleData(response);
    let text = "";
    text += `Có ${data.undue.length} deadline cần phải hoàn thành:\n`;
    data.undue.forEach((e) => {
      text += ` - Tới hạn deadline: ${e[2]} ngày, deadline name: ${e[1]}\n`;
    });
    text += ` Có ${data.now.length} deadline cần hoàn thành trong hôm nay.\n`;
    return text;
  }

  handleData(data) {
    const date = new Date();
    const undue = [];
    const now = [];
    data.forEach((ele) => {
      if (ele[0][0] >= date.getDate() && ele[0][1] == date.getMonth() + 1) {
        const late = -date.getDate() + parseInt(ele[0][0]);
        ele.push(late);
        undue.push(ele);
      }
      if (ele[0][0] == date.getDate() && ele[0][1] == date.getMonth() + 1)
        now.push(ele);
    });
    return {
      now: now,
      undue: undue,
    };
  }

  getCookie() {
    const configsGlobal = Fs.readJSON("./configs/ExtensionConfig.json");
    if (configsGlobal === null) return null;
    if (configsGlobal?.COOKIE?.Deadline) return configsGlobal.COOKIE.Deadline;
    if (configsGlobal instanceof Object) {
      if (!configsGlobal.COOKIE) configsGlobal.COOKIE = {};
      configsGlobal.COOKIE.Deadline = "";
      Fs.writeJSON("./configs/ExtensionConfig.json", configsGlobal);
      return null;
    }
  }
}

export default new deadlineHCMUS();
