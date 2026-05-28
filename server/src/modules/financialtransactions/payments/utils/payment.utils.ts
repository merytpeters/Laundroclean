/*function getCurrencyFactor(currency: string) {
  switch (currency) {
    case "JPY":
      return 1;
    default:
      return 100;
  }
}

function isZeroDecimalCurrency(currency: string) {
  return currency === "JPY";
}*/

const toMinorUnit = (value: string | number): number => {
    return Math.round(Number(Number(value) + 'e2'));
};

function toDisplayAmount(amount: number | string): number {
  const factor = 100;
  return Number(amount) / factor;
}

function generateTransactionRef() {
  return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export default {
    toMinorUnit,
    toDisplayAmount,
    generateTransactionRef
};