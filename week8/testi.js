
console.log("Start of script");

function printer(value) {
  console.log("The value: " + value);
}

function calculator(number1, number2, callback) {
  const sum = number1 + number2;
  callback(sum);
}

function timeOutCallback() {
  calculator(5, 7, printer);
}

setTimeout(timeOutCallback, 3000);

console.log("End of script");