const request = require('request');
const minimist = require('minimist');


const argv = minimist(process.argv.slice(2));

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getLetter() {
  const A = 65;
  const Z = 91;
  const letter = getRandomInt(A, Z);
  return String.fromCharCode(letter);
}

function getNumber() {
  return getRandomInt(1000, 10000);
}

function getPlate() {
  let plate = getLetter() + getLetter() + getLetter();
  plate += ' ';
  plate += getNumber();
  return plate;
}

function options() {
  return {
    method: 'POST',
    url: 'https://sitmenow.herokuapp.com/gasStations/' + argv.gasStation + '/turns',
    json: {
      name: 'Bismarck Lepe',
      plates: getPlate(),
      email_address: 'elbis@lagranW.com',
    },
  };
}

function job(timeout) {
  request(options(), function (error, response, body) {
    console.log(error);
    console.log(body);
  });

  setTimeout(() => job(timeout), timeout);
}

job(getRandomInt(1000, 10000));

