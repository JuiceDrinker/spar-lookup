export const isValidPnr = (pnr: string) => {
  const pnrArray = pnr
    .replace(/\D/g, "") // keep only numeric digits
    .split("")
    .reverse()
    .slice(0, 10);
  const year = Number(pnrArray.slice(8).reverse().join(""));
  const month = Number(pnrArray.slice(6, 8).reverse().join(""));
  const date = Number(pnrArray.slice(4, 6).reverse().join(""));
  if (isValidDate(year, month, date)) {
    if (pnrArray.length !== 10) {
      return false;
    }

    const sum = pnrArray.map(Number).reduce((acc, current, index) => {
      if (index % 2) {
        current = current * 2;
      }
      if (current > 9) {
        current = current - 9;
      }
      return acc + current;
    });
    return sum % 10 === 0;
  }
  return false;
};

export const reconstructYear = (year: number) => {
  if (year < 24) {
    return 2000 + year;
  }
  return 1900 + year;
};

export const isValidDate = (year: number, month: number, date: number) => {
  if (year < 0) {
    return false;
  }
  const newDate = new Date(reconstructYear(year), month - 1, date);

  if (newDate.getDate() !== date) {
    return false;
  }
  if (newDate.getFullYear() !== reconstructYear(year)) {
    return false;
  }
  if (newDate.getMonth() !== month - 1) {
    return false;
  }

  return true;
};
