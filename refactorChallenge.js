// Messy JavaScript code
var x = [1,2,3,4,5];
var y = [];
for(var i=0;i<x.length;i++){
  if(x[i]%2==0){
    y.push(x[i]*2)
  }else{
    y.push(x[i])
  }
}
console.log(y);

// Refactored JavaScript code using modern ES6+ features
const numbers = [1, 2, 3, 4, 5];

// Execution with proper error handling
try {
  const inputNumbers = [1, 2, 3, 4, 5];
  const processedNumbers = doubleEvenNumbers(inputNumbers);

  console.log(processedNumbers);
} catch (error) {
  console.error('Error processing numbers:', error.message);
}