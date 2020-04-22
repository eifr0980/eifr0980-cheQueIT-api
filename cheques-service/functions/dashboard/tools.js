export const sumAmounts = (arr) =>
  arr.reduce((a, b) => a + Number(b.amount), 0);

export const sumDeposited = (arr) =>
  arr.reduce((a, b) => (b.deposited ? a + Number(b.amount) : a + 0), 0);

export const groupByMonth = (data) => {
  const res = {};
  let fn = (year, month, o = res, array = data) => {
    o[month] = array.filter(
      ({ date: d }) => `${year}-${month}` === d.slice(0, 7)
    );
  };
  for (let { date } of data) {
    let [year, month] = date.match(/\d+/g);
    if (!res[month]) res[month] = {};
    fn(year, month);
  }
  return res;
};

export const countChequesPerMonth = (cheques) => {
  const res = {};
  for (let month in cheques) {
    res[month] = cheques[month].length;
  }
  return res;
};

export const sumGroupedCheques = (cheques) => {
  const res = {};
  for (let property in cheques) {
    res[property] = cheques[property].reduce((a, b) => a + b.amount, 0);
  }
  return res;
};

export const groupByCategory = (data) => {
  const res = {};
  data.forEach((b) => {
    res[b.category] = data.filter((cheque) => cheque.category === b.category);
  }, {});
  return res;
};
