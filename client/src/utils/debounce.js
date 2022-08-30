export default function debounce(fn, delay) {
  let timeoutID = null;
  return function dbInner() {
    clearTimeout(timeoutID);
    const args = arguments; // eslint-disable-line
    const that = this;
    timeoutID = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}
