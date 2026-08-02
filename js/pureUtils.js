function calculateDiscount(price, quantity, rate = 0.1) {
  const safePrice = Number(price);
  const safeQuantity = Number(quantity);
  const safeRate = Number(rate);

  if (!Number.isFinite(safePrice) || !Number.isFinite(safeQuantity) || !Number.isFinite(safeRate)) {
    return 0;
  }

  const subtotal = safePrice * safeQuantity;
  return Number((subtotal - subtotal * safeRate).toFixed(2));
}

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase();
}

function countWords(value) {
  return String(value ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

module.exports = {
  calculateDiscount,
  normalizeText,
  countWords,
};
