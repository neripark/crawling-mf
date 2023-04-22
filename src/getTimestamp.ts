export const getTimestamp = () => {
  const date = new Date();
  const timestamp = `${date.getFullYear()}_${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}_${date.getDate().toString().padStart(2, "0")}-${date
    .getHours()
    .toString()
    .padStart(2, "0")}_${date.getMinutes().toString().padStart(2, "0")}_${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}_${date.getMilliseconds().toString().padStart(3, "0")}`;
  return timestamp;
};
