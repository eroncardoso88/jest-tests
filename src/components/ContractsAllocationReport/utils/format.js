const { format } = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export function formatToBRL(money) {
  return format(money);
}

export function formatWithoutBRL(money) {
  return format(money)
    .replace('R$', '')
    .trim();
}

export function parseStringToFloat(money) {
  return parseFloat(money.replace(/[^0-9\-]/g, ''));
}
