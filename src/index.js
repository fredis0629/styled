
module.exports = function styled(initExpresion = null) {
  // receive initExpresion
  return function (strings,...functionExpressions) { // returns function that parses template strings
    return function (objArgs) { // returns function that build the resulting string
      let result = '';

      if(initExpresion != null) result = initExpresion(objArgs); // discharge initExpresion if necessary
      result += strings[0] || '' ; // adds first string element from template (if exist) to result string variable
      // if functionExpressions
      if(functionExpressions.length) {
        //if functionExpressions were passed assemble discharged functionExpressions and template strings to result string
        functionExpressions.forEach((expression, index) => {
          result += (objArgs ? expression(objArgs) : expression({})) + strings[index+1]
        })
      }
      return result.replace(/\n|\t/g, ''); // remove newline and tab characters from result string and return it as answer
    }
  };
}


module.exports = function styled(initExpresion = null) {
  // receive initExpresion
  return function (strings,...functionExpressions) {  // returns function that parses template strings
    return function (objArgs) { // returns function that build the resulting string
      let initialString = '';

      if(initExpresion != null) initialString = initExpresion(objArgs); // discharge initExpresion if necessary
      initialString += strings[0] || '' ; // adds first string element from template (if exist) to initialString

      // callback function for reduce that assembles discharged functionExpressions and template strings to result string
      function cbForReduce(acc, expression, index) {
        return acc += (objArgs ? expression(objArgs) : expression({})) +strings[index+1];
      }
      // build result string
      let result = (functionExpressions.length) ?
        functionExpressions.reduce( cbForReduce ,initialString) // assemble discharged functionExpressions and template strings to result string with initialString as initialValue for reduce
        : initialString; // if there now functionExpressions assign initialString to result string

      return result.replace(/\n|\t/g, ''); // remove newline and tab characters from result string and return it as answer
    }
  };
}
