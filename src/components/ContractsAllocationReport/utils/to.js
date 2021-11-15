export default promise =>
  promise.then(data => [undefined, data]).catch(error => [error, undefined]);
