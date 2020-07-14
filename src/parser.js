const split = (str) => str.split('\r\n');

const getExtraCount = function (str) {
  const counter = { '*': Number(str.slice(1)), $: 1 };
  return counter[str[0]] || 0;
};

const parseRes = function (res) {
  const splittedRes = res.match(/.*\r\n/g);
  const parsedRes = [];
  let count = 0;
  let temp = '';
  for (let i = 0; i < splittedRes.length; i++) {
    temp += splittedRes[i];
    count += getExtraCount(splittedRes[i]);
    if (count === 0) {
      parsedRes.push(temp);
      temp = '';
    } else {
      count--;
    }
  }
  return parsedRes;
};

const formatRes = function (resArr) {
  const first = resArr.shift();
  const [type, value] = [first[0], first.slice(1)];

  if (type == '-') return `(error) ${value}`;
  if (type == '$') return resArr.shift();
  if (type == '+') return value;
  if (type == ':') return Number(value);
  if (type == '*') {
    const array = new Array(Number(value));
    for (let index = 0; index < array.length; index++) {
      array[index] = formatRes(resArr);
    }
    return array;
  }
};

const parser = function (res) {
  return parseRes(res).map((e) => {
    if (split(e)[0][0] == '-') return { err: formatRes(split(e)), res: null };
    return { err: null, res: formatRes(split(e)) };
  });
};

const getObject = function (array) {
  const pairs = {};
  for (let index = 0; index < array.length; index += 2) {
    pairs[array[index]] = array[index + 1];
  }
  return pairs;
};

module.exports = { parser, getObject };
