export const stringToNumber = (str: string): number => {
  if (str === "") {
    throw new Error("Invalid input: empty string");
  }
  const numericStr = str.replace(/,/g, "");
  const result = Number(numericStr);
  if (isNaN(result)) {
    throw new Error("Invalid input: not a number");
  }
  return result;
};
