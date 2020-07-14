const types = {
  '+': (str) => str,
  ':': (str) => Number(str),
  '*': (str) => new Array(Number(str)),
};

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

  if (type == '$') return resArr.shift();
  if (type != '*') return types[type](value);

  const array = types[type](value);
  for (let index = 0; index < array.length; index++) {
    array[index] = formatRes(resArr);
  }
  return array;
};

const parser = (res) => parseRes(res).map((e) => formatRes(split(e)));

module.exports = { parser };
