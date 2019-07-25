/*
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
        function somethingUnbelievable(str) { // ;)
          let strThetPasses8Tests = str.replace(/\n|\t/g, '').replace(/;;/g,';');
          let arrayThatWillBeJSONStr = strThetPasses8Tests.split(';').map((item) => item.split(': ').map(item => item && '"'+item+'"').join(': ')).join(',').split('');
          arrayThatWillBeJSONStr.pop();
          arrayThatWillBeJSONStr.push('}');
          arrayThatWillBeJSONStr.unshift('{');
          let  answer = JSON.stringify(JSON.parse(arrayThatWillBeJSONStr.join(''))).slice(1,-1);
          answer+=answer ? ';' : '';
          return answer.replace(/"/g, '').replace(/:/g,': ').replace(/,/g, ';');
        }
        let result = (functionExpressions.length) ?
          functionExpressions.reduce( cbForReduce ,initialString)
          : initialString;
        return somethingUnbelievable(result);
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
