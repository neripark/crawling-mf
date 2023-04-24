interface Item {
  key: string;
  price: number;
}

export const calcDiff = (item1: Item, item2: Item) => {
  if (item1.price > 0 || item2.price > 0) {
    throw new Error(
      "価格が正の数になっているレコードがあります。支出なので、必ず負の数のはずです。"
    );
  }
  const sum = Math.abs(item1.price) - Math.abs(item2.price);
  if (sum > 0) {
    return `${item1.key}のほうが${Math.abs(sum).toLocaleString()}円多いです。`;
  } else if (sum === 0) {
    return `${item1.key}も${item2.key}も、ぴったり同じ金額です。`;
  } else {
    return `${item2.key}のほうが${Math.abs(sum).toLocaleString()}円多いです。`;
  }
};
