import axios from 'axios';
import { configs } from '../../utils/index.js';

class Weather {
  static async getWeather(api, cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api}&units=metric&lang=vi`;
    const { data } = await axios.get(url).catch((err) => {
      if (err?.response?.status && err?.response?.status !== 200) {
        if (err?.response?.status === 404) throw new Error('Không tìm thấy địa điểm !!!');
        throw err?.response?.statusText || 'UNKNOWN';
      }
      throw new Error(' - Vui lòng kiểm tra kết nối mạng.');
    });
    try {
      return {
        weather: {
          main: data.weather[0].main,
          description: data.weather[0].description,
          linkIcon: data.weather[0].icon ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` : 'http://openweathermap.org/img/wn/10d@2x.png',
        },
        main: {
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          temp_min: data.main.temp_min,
          temp_max: data.main.temp_max,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
        },
        wind: {
          speed: data.wind.speed,
          deg: data.wind.deg,
        },
        country: data.sys.country,
        name: data.name,

        formatString() {
          let text = '';
          text += `🏡 Thời tiết tại ${this.name}:\n`;
          text += configs.line + '\n';
          text += `🌡️ Nhiệt độ: ${this.main.temp}°C\n`;
          text += `🌡️ Nhiệt độ thấp nhất: ${this.main.temp_min}°C\n`;
          text += `🌡️ Nhiệt độ cao nhất: ${this.main.temp_max}°C\n`;
          text += configs.line + '\n';
          text += `💦 Độ ẩm: ${this.main.humidity}%\n`;
          text += `🌬️ Tốc độ gió: ${this.wind.speed}m/s\n`;
          text += `🌤️ Thời tiết: ${this.weather.description}\n`;
          return text;
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default Weather;
