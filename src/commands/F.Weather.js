import { default as dataWeather } from "../module/Weather.js";
import { Fs, Logger } from "../../utils/index.js";

class Weather {
  constructor() {
    this.configs = {
      name: "Qan Qan",
      version: "1.0.0",
      dependencies: {
        axios: "axios",
      },
      description: "Check thời tiết",
    };

    this.apiKey = this.getApiKey();
  }
  async callData(option, location = "") {
    if (!this.apiKey) {
      Logger.error("API Weather có vấn đề.");
      Logger.warn(
        "Vui lòng bổ sung API weather để khởi động chức năng xem thời tiết.!!!"
      );
      return {
        error: " - Chức năng thời tiết đang gặp vấn đề.",
        data: undefined,
      };
    }

    const configs = Fs.readJSON("./configs/WeatherConfig.json");
    if (!configs) {
      Logger.error("Không thể tạo được thư mục WeatherConfig.json.");
      return {
        error: " - Chức năng thời tiết đang gặp vấn đề.",
        data: undefined,
      };
    }
    if (!configs?.isDefault || !configs?.Default) {
      configs.isDefault = false;
      configs.Default = "";
      if (!configs?.History) configs.History = [];
    }
    switch (option) {
      case "--get":
        if (configs.Default === "" || configs.isDefault === false) {
          location !== ""
            ? configs.History.push(location)
            : (location = configs.Default);
          Fs.writeJSON("./configs/WeatherConfig.json", configs);
          if (location === "")
            return {
              error: "Vui lòng nhập vào địa điểm muốn tìm kiếm.\n",
              data: undefined,
            };
        }
        break;
      case "--set":
        if (location === "") {
          return {
            error: "Vui lòng nhập vào địa điểm muốn set mặc định.\n",
            data: undefined,
          };
        }
        configs.isDefault = true;
        configs.Default = location;
        location !== ""
          ? configs.History.push(location)
          : (location = configs.Default);
        Fs.writeJSON("./configs/WeatherConfig.json", configs);
        break;
      case "--del":
        if (!configs.isDefault) {
          return {
            error: "Chưa có địa điểm mặc định.\n",
            data: undefined,
          };
        }
        configs.isDefault = false;
        configs.Default = "";
        Fs.writeJSON("./configs/WeatherConfig.json", configs);
        return {
          error: undefined,
          data: "Bạn đã xóa địa điểm mặc định thành công.",
        };
      default:
        return {
          error: "Không có lựa chọn nào như vậy.",
          data: undefined,
        };
    }
    const data = await this.getData(location)
      .then((data) => {
        return { data: data };
      })
      .catch((err) => {
        return {
          error: err.message || err.error || "Vui lòng set địa điểm mặc định.",
          data: undefined,
        };
      });
    return {
      error: data?.error,
      data: data?.data,
    };
  }

  async getData(cityName) {
    const dataKey = await dataWeather
      .getWeather(this.apiKey, cityName)
      .catch((err) => {
        throw err;
      });
    const text = dataKey.formatString();
    const img = dataKey.weather.linkIcon;
    return {
      text: text,
      img: img ? img : null,
    };
  }

  getApiKey() {
    const configsGlobal = Fs.readJSON("./configs/ExtensionConfig.json");
    if (configsGlobal === null) return null;
    if (configsGlobal?.API?.API_Weather) return configsGlobal.API.API_Weather;
    if (configsGlobal instanceof Object) {
      if (!configsGlobal.API) configsGlobal.API = {};
      configsGlobal.API.API_Weather = "";
      Fs.writeJSON("./configs/ExtensionConfig.json", configsGlobal);
      return null;
    }
  }
}

export default new Weather();
