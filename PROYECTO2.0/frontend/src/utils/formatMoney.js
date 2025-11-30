export function formatMoney(value) {
  return Number(value).toLocaleString(undefined, { style: 'currency', currency: 'PEN' });
}

export default formatMoney;
