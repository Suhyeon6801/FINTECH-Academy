const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
var mysql = require("mysql");

//mysql에 접근 가능한 사용자 확인 여부
var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "8603",//비밀번호
  database : "fintech",
  port : "3306"
});
 
connection.connect();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public"))); //to use static asset

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/authResult", function (req, res) {
  var authCode = req.query.code;
  console.log("사용자 인증코드 : ", authCode);
  var option = {
    method: "POST",
    url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
    form: {
      code: authCode,
      client_id: "C97hgR1f0wrvnhKGLe3SA213vFXtlVKwGLiRHazD",
      client_secret: "PYSbTdUbbnTQ7jTBHS2QCIUi4NlTJKVBj68259e4",
      redirect_uri: "http://localhost:3000/authResult",
      grant_type: "authorization_code",
    },
  };
  request(option, function (error, response, body) {
      if(error){
          console.error(error);
      }else{
          var accessRequestResult = JSON.parse(body);
          console.log(accessRequestResult);
          res.render("resultChild",{data : accessRequestResult});
      }
  });
});

app.post("/signup", function(req,res){
    var userName = req.body.userName;
    var userPassword = req.body.userPassword;
    var userEmail = req.body.userEmail;
    var userAccessToken = req.body.userAccessToken;
    var userRefreshToken = req.body.userRefreshToken;
    var userSeqNo = req.body.userSeqNo;
  
    var sql =
      "INSERT INTO user (`name`, `email`, `password`, `accesstoken`, `refreshtoken`, `userseqno`) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(
      sql,
      [
        userName,
        userEmail,
        userPassword,
        userAccessToken,
        userRefreshToken,
        userSeqNo,
      ],
      function (error, results) {
        if (error) throw error;
        else {
          res.json(1);
        }
      }
    );
});

app.listen(3000);