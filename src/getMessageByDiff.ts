interface Item {
  key: string;
  price: number;
}

export const getMessageByDiff = (item1: Item, item2: Item) => {
  if (item1.price > 0 || item2.price > 0) {
    throw new Error(
      "正の数になっている小計があります。支出なので、必ず負の数のはずです。"
    );
  }
  if (item1.price === 0 && item2.price === 0) {
    return "0件なので計算しませんでした。";
  }
  const diff = Math.abs(item1.price) - Math.abs(item2.price);
  if (diff > 0) {
    return getResultMessage({
      receivingSideKey: item1.key,
      payingSideKey: item2.key,
      diff,
    });
  } else if (diff === 0) {
    return `${item1.key}も${item2.key}も、ぴったり同じ金額です。`;
  } else {
    return getResultMessage({
      receivingSideKey: item2.key,
      payingSideKey: item1.key,
      diff,
    });
  }
};

const getResultMessage = (props: {
  receivingSideKey: string;
  payingSideKey: string;
  diff: number;
}) => {
  const half = Math.floor(props.diff / 2);
  return `${props.receivingSideKey}のほうが${Math.abs(
    props.diff
  ).toLocaleString()}円多いです。
${props.payingSideKey}が${props.receivingSideKey}に${Math.abs(
    half
  ).toLocaleString()}円払いましょう！`;
};
