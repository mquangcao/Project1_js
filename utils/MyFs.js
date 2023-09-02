import fs, { existsSync, writeFileSync } from 'fs';
import path from 'path';
import Logger from './Logger.js';

class Fs {
  static join(fileName) {
    return path.join(process.cwd(), fileName);
  }
  static readJSON(fileName) {
    const fullPath = Fs.join(fileName);
    const parentPath = path.dirname(fullPath);
    if (!existsSync(fullPath)) {
      try {
        fs.mkdirSync(parentPath, { recursive: true });
        writeFileSync(fullPath, JSON.stringify({}, null, 2), 'utf-8');
        return {};
      } catch (error) {
        Logger.error(error.message || error);
        return null;
      }
    }
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  }
  static writeJSON(fileName, data) {
    const fullPath = Fs.join(fileName);
    writeFileSync(fullPath, JSON.stringify(data, null, 2));
  }
}

export default Fs;
