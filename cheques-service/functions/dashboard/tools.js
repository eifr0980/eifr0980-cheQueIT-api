export const sumAmounts = (arr) =>
  arr.reduce((a, b) => a + Number(b.amount), 0);

export const sumDeposited = (arr) =>
  arr.reduce((a, b) => (b.deposited ? a + Number(b.amount) : a + 0), 0);
