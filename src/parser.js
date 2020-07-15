const split = (str) => str.split('\r\n');

const getCount = function (str) {
  const counter = { '*': Number(str.slice(1)), $: 1 };
  return counter[str[0]] || 0;
};

const groupRelatedRes = function (res) {
  const splittedRes = res.match(/.*\r\n/g);
  const parsedRes = [];
  let count = 0;
  let temp = '';
  for (let index = 0; index < splittedRes.length; index++) {
    temp += splittedRes[index];
    count += getCount(splittedRes[index]);
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

const getResponses = function (rawRes) {
  return groupRelatedRes(rawRes).map((relatedRes) => {
    if (split(relatedRes)[0][0] == '-') {
      return { err: formatRes(split(relatedRes)), res: null };
    }
    return { err: null, res: formatRes(split(relatedRes)) };
  });
};

const formatAsObject = function (array) {
  const pairs = {};
  for (let index = 0; index < array.length; index += 2) {
    pairs[array[index]] = array[index + 1];
  }
  return pairs;
};

module.exports = { getResponses, formatAsObject };
