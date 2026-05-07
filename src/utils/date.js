export function formatDateDMY(date = new Date()) {
  return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('-');
}

export function formatDateYMD(date = new Date()) {
  return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-');
}

function pad(value) {
  return String(value).padStart(2, '0');
}
