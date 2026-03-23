export function format(num: number) {
  return (
    "$" +
    num.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })
  );
}
