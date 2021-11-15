export const formatValueMoney = value =>
  formatToBrSeparators(Number(value).toFixed(2));

const formatToBrSeparators = numberStr =>
  numberStr
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+,)/g, '$1.');

export const formatBrToNumber =
  (numberStr = '') => parseFloat(numberStr.replace(/\./g, '').replace(',', '.')) || 0;

export const formatNumber = value => {
  if (value || value === 0) {
    const formattedValue = value.toFixed(3);

    return formattedValue === '-0.000' ? '0.000' : formatToBrSeparators(formattedValue);
  }

  return value;
};

export const { format: formatValueDecimal } = new Intl.NumberFormat('pt-BR');
