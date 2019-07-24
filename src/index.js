module.exports = function styled(startObj = null) {
  return function (strArr,...functs) {
    return function (objArgs) {
      let result = '';
      if(startObj != null) result = startObj(objArgs);
      result += strArr[0] || '' ;
      if(functs.length > 0) {
        functs.forEach((val, index) =>{
          result += (objArgs ? val(objArgs) : val({})) +strArr[index+1]
      })}
      return result.replace(/\n|\t/g, '');
    }
  };
}
