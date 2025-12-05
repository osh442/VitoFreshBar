export const BGN_TO_EUR_RATE = 1.95583;

export const convertBgnToEur = (value) => Number((Number(value || 0) / BGN_TO_EUR_RATE).toFixed(2));

export const formatCurrency = (value, currency = 'BGN') => {
  const formatted = Number(value || 0).toFixed(2);
  return currency === 'EUR' ? `${formatted} €` : `${formatted} лв.`;
};

export const formatPricePair = (value) => ({
  bgn: formatCurrency(value, 'BGN'),
  eur: formatCurrency(convertBgnToEur(value), 'EUR'),
});
