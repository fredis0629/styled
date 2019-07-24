module.exports = function styled(startObj = null) {
  return function (strArr,...funcs) {
    return function (objArgs) {
      let result = '';
      if(startObj != null) result = startObj(objArgs);
      result += strArr[0] || '' ;
      if(funcs.length > 0) {
        funcs.forEach((val, index) =>{
          result += (objArgs ? val(objArgs) : val({})) +strArr[index+1]
      })}
      return result.replace(/\n|\t/g, '');
    }
  };
}
