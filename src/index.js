/* first task
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
*/
// second task
function styled(initExpresion = null) {
    if (!initExpresion) throw new Error('Wrong extended element');
    return function (strings,...functionExpressions) {
      return function (objArgs = {}) {
        let initialString = '';
        if (typeof initExpresion == 'function') initialString += initExpresion(objArgs);
        initialString += strings[0] || '' ;
        function cbForReduce(acc, expression, index) {
          return acc += expressionResult(expression)+ strings[index+1];
        }
        function expressionResult(expression) {
          return ((typeof expression === 'function') ? expressionResult(expression(objArgs)) : expression) || '';
        }
        function strToArray(str) {
          let strReplace = str.replace(/\n|\t/g, '').replace(/;;/g,';') // remove newline, tab characters, and ';;' from string
          let arrayStrEl = strReplace .split(';').map((item) => item.split(': ').map(item => item && '"'+item+'"').join(': ')); // return array ['"key": "value"', '"key":"value"',...]
          let resultArray = arrayStrEl.join(',').split(''); // join array element by ',', ant splite string to result array of symbol
          return resultArray
        }
        function arrayToJsonStr(arr) {
          arr.pop(); // delete last empty element
          // add start '{' and end '}' brackets to the result array
          arr.push('}');
          arr.unshift('{');
          return arr.join('');
        }
        function jsonObjToResultStr(obj) {
          let  jsonStr = JSON.stringify(obj);
          let result = jsonStr.slice(1,-1); // remove "{" and "}" from beginning and end of string
          if (result != '') { // if result str not empty: remove '"', add space symbol after ':', change ',' on ';' and add ';' to the end of string
            result = result.replace(/"/g, '').replace(/:/g,': ').replace(/,/g, ';') + ';' ;
          }
          return result;
        }
        function restructResult(str) {
          let arrayOfSymbol = strToArray(str);
          let jsonStr = arrayToJsonStr(arrayOfSymbol);
          let jsonObj = JSON.parse(jsonStr);
          let  result = jsonObjToResultStr(jsonObj);
          return result;
        }

        let result = (functionExpressions.length) ?
          functionExpressions.reduce( cbForReduce ,initialString)
          : initialString;
        return restructResult(result);
      }
    };
}
styled = new Proxy(styled,{
  get(target, phrase) {
    if (phrase in target) {
      return target[phrase]
    } else {
      return target(phrase);
    }
  }
});
module.exports = styled;
