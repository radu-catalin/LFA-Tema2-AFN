const fs = require('fs');
const { ReadStream, fillArray } = require('./utility');

const fin = './afn.in'; // fisierul de intrare;
const fout = './afn.out'; // fisierul de iesire

class Afn {
  n; // numarul de stari
  ch; // vectorul caracteristic al starilor
  alphabet; // alfabetul folosit
  states; // vector de stari
  k; // numarul de arce din graf
  v; // matricea de adiacenta
  m; // numarul de cuvinte date
  words; // cuvintele date

  index = 0; // pozitia in cuvant (am nevoie de aceasta variabila pentru functia recursiva)

  constructor(filename) {
    const f = new ReadStream(filename); // deschid fisierul

    // citesc datele si le prelucrez
    this.n = parseInt(f.getLine());
    this.ch = f
      .getLine()
      .split(' ')
      .map((el) => parseInt(el));
    this.alphabet = f.getLine();
    this.states = f
      .getLine()
      .split(' ')
      .map((el) => parseInt(el));
    this.k = parseInt(f.getLine());
    this.v = this.readArray(f);
    this.m = f.getLine();
    this.words = this.readWords(f);
  }

  solve() {
    fs.writeFileSync(fout, '');
    for (let i = 0; i < this.m; i++) {
      const isValid = this.checkWord(0, this.words[i]);
      console.log(this.words[i], isValid);
      fs.appendFileSync(fout, this.words[i] + ' ' + isValid + '\n');
    }
  }

  checkWord(start, word) {
    this.index = 0; // pentru fiecare cuvant initializam index-ul cu 0
    return this.DFS(start, word); // returneaza true/false
  }

  // functie care verifica daca un cuvant este valid (functioneaza ca un DFS)
  DFS(start, word) {
    let isValid; // variabila pentru a opri recursivitatea

    if (this.ch[start] && this.index === word.length) {
      return true; // cuvantul este valid
    }

    // parcurgem starile
    for (let q = 0; q < this.n; q++) {
      // daca exista un arc (start, q) cu eticheta literei de pe pozitia index si valoarea index-ului este mai mica decat lungimea cuvantului
      if (this.v[start][q].includes(word[this.index]) && this.index < word.length) {
        this.index++; // trecem la urmatorul cuvant
        isValid = this.DFS(q, word); // aplicam functia in starea q

        // daca in pasul anterior cuvantul este valid, atunci nu mai are rost sa continuam recursivitatea
        if (isValid) {
          return true;
        }
      }

      if (q === this.n - 1) {
        this.index--;
      }
    }
    return false; // cuvantul nu este valid
  }

  readArray(f) {
    let v = fillArray('', this.n, this.n);
    // introducem datele in matricea v
    for (let i = 0; i < this.k; i++) {
      let data = f
        .getLine()
        .split(' ')
        .filter((num) => num !== ' ');
      data[1] = parseInt(data[1]);
      data[2] = parseInt(data[2]);
      if (this.alphabet.includes(data[0])) {
        v[data[1]][data[2]] += data[0];
      } else {
        console.log('Lista de adiacenta data nu este valida!');
        console.log('ERROR: -->', data[0], data[1], data[2], '. Muchia aceasta contine litere care nu sunt din vocabular');
        fs.writeFileSync(fout, '');
        process.exit();
      }
    }

    return v;
  }

  readWords(f) {
    let words = [];
    // citim m cuvinte
    for (let i = 0; i < this.m; i++) {
      words.push(f.getLine());
    }
    return words;
  }
}

const afn = new Afn(fin);
afn.solve();
