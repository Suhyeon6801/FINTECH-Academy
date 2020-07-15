//제대로 된 유저인지 확인함. -> middleware로

const jwt = require('jsonwebtoken');
var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%";
const authMiddleware = (req, res, next) => {
   const token = req.headers["ourtoken"] || req.query.token;
   console.error(token);
   if(!token) {//token이 없을 때
       return res.status(403).json({
           server : "우리서버",
           success: false,
           message: "not logged in",
       });
   }
   
   const p = new Promise((resolve, reject) => {
           jwt.verify(token, tokenKey, (err, decoded) => {//verify->token, tokenkey를 확인. decoded-> request에 추가
               if(err) reject(err);//onError로 넘어간다.
               resolve(decoded);
           });
       });

   const onError = (error) => {//reject
       console.log(error);
       res.status(403).json({
            server : "우리서버",
           success: false,
           message: error.message,
       });
   };
   
   p.then((decoded)=>{//resolve
       req.decoded = decoded;//사용자에 대한 정보를 추가 -> 넘겨줌
       next();
    }).catch(onError);
};

module.exports = authMiddleware;
