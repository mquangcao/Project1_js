class kbb {
  constructor(select) {
    this.configs = {
      name: "Kéo búa bao",
      version: "1.0.0",
      description: "Game vui kéo búa bao",
    };
    this.data = this.kbb(select);
  }
  callData() {
    return this.formatString();
  }

  kbb(select) {
    const items = {
      kéo: 0,
      búa: 1,
      bao: 2,
    };
    if (select === undefined || select === "") {
      if (!Object.keys(items).includes(select) && select !== "")
        return { error: "Lựa chọn chỉ có thể là kéo/búa/bao.", data: null };
      return { error: "Vui lòng nhập vào lựa chọn của bạn.", data: null };
    }
    const player = items[select];
    const bot = Math.floor(Math.random() * 3);
    const botSelect = Object.keys(items)[bot];
    return {
      error: null,
      data: {
        selectPlayer: select,
        player: player,
        bot: bot,
        botSelect: botSelect,
      },
    };
  }

  formatString() {
    if (this.data.data) {
      let text = `Bạn chọn ${this.data.data.selectPlayer}\nBot chọn ${this.data.data.botSelect}\n`;
      if (this.data.data.player === this.data.data.bot) text += "2 bên hòa.";
      else if (
        this.data.data.player - this.data.data.bot === 1 ||
        this.data.data.player - this.data.data.bot === -2
      )
        text += "Bạn thắng";
      else text += "Bạn thua.";
      return text;
    }
    return this.data.error;
  }
}

export default kbb;
