module.exports = (res,isSuccess ,message,code,data) => {
 
  return res.status(code).json( {
    status :isSuccess,
    message,
    code,
    data,
  });
}