class ChartColors {
  colors = {
    'red': '#e74c3c',
    'blue': '#3498db',
    'orange': "#e67e22",
    'purple': "#8f22dc",
    'sky': '#1abc9c',
    'yellow': '#ffbd63',
    'darkGray': "#34495e",
    'pink': "#ff39f3",
    'green': '#2ecc71'
  }

  getByNameErrorDetect(name){
    const colors = {
      "Другое": this.colors.purple,
      "Канал закрылся": this.colors.blue,
      "ОК": this.colors.green,
      "Отсутствие детекции": this.colors.darkGray,
      "Проблема на астериске": this.colors.red,
      "Проблема транскрибации": this.colors.pink
    }
    return colors[name] || this.colors.sky;
  }

  getColorMyNameTel(name) {
    const colors = {
      'beeline': this.colors.orange,
      "mts": this.colors.red,
      "tele2": this.colors.blue,
      "megafon": this.colors.green,
      "other": this.colors.purple
    }

    return colors[name] || this.colors.sky;
  }

  getColorMyNameStatus(name) {
    const colors = {
      "CANCEL": this.colors.red,
      "ANSWER": this.colors.green,
      "NOANSWER": this.colors.blue,
      "CONGESTION": this.colors.pink,
      "BUSY": this.colors.orange,
      "CHANUNAVAIL": this.colors.purple
    }
    return colors[name] || this.colors.sky
  }
  getRandomColor(index) {
    const colors = [
      this.colors.blue,
      this.colors.green,
      this.colors.red,
      this.colors.yellow,
      this.colors.purple,
      this.colors.sky,
      this.colors.darkGray,
      this.colors.orange
    ];
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return colors[index] || color;
  }
}

export default ChartColors
