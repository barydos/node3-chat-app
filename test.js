const testFunc = new Promise((resolve, reject) => {
  reject("Error")
  resolve("Success")
});
console.log(type(testFunc))

testFunc.then((result) => console.log(result)).catch((e) => console.log(e));
