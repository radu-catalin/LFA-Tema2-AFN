const fs = require('fs');

class ReadStream {
  constructor(fileLocation) {
    this.data = fs.readFileSync(fileLocation).toString();

    // adaugam '\r\n' la sfarsit daca nu exista
    if (this.data[this.data.length - 1] !== '\n') {
      this.data += '\r\n';
    }
  }

  getLine() {
    const endOfLine = this.data.indexOf('\n');
    const line = this.data.slice(0, endOfLine - 1); // citim pana la \n (am pus endOfLine - 1 deoarece inaintea lui \n se afla un \r)
    if (this.data.length) {
      this.data = this.data.substr(endOfLine + 1); // scoatem linia citita
      return line;
    }

    return '';
  }
}

// functie care iti construieste un tablou de dimensiune (pos1,pos2) cu fiecare element egal cu str
const fillArray = (str, pos1, pos2) => {
  let v = [];
  for (let i = 0; i < pos1; i++) {
    let list = [];
    for (let j = 0; j < pos2; j++) {
      list.push(str);
    }
    v.push(list);
  }

  return v;
};

module.exports = { fillArray, ReadStream };
