export const sumAmounts = (arr) =>
  arr.reduce((a, b) => a + Number(b.amount), 0);
