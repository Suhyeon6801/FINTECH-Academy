const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
var mysql = require("mysql");
const jwt = require("jsonwebtoken");
const auth = require("./lib/auth");

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

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/authTest", auth, function(req,res){//middleware추가
    res.json("로그인이 완료된 사용자가 보는 화면");
});

app.get("/main", function(req,res){
    res.render("main");
});
//========================= view / login ============================

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

app.post("/login", function(req,res){
    console.log(req.body);
    var userEmail=req.body.userEmail;
    var userPassword = req.body.userPassword;

    //DB에 있는 데이터랑 확인해서 일치하면 email, pw 존재 -> token발급
    //토큰 사용 이유 : 서비스에 접근하기 위한 유저들을 확인하기 위해

    var sql = "SELECT * FROM user WHERE email = ?";
    connection.query(
    sql,[userEmail],function (error, results) {
      if (error) throw error;
      else {
        if(results.length == 0){
            res.json("등록되지 않은 회원입니다.");
        }else{
            //회원이 존재한다면 password확인
            var dbPassword = results[0].password;
            console.log("DB에서 가져온 패스워드 : ", dbPassword);

            //db에서 가져온 패스워드랑 같다면 로그인 성공
            if(dbPassword==userPassword){
                //여기서 token 발급!! -> 여기서 만들어진 토큰은 accessToken이랑은 다르다!
                //우리서비스에 접근하기 위한 key
                var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%";
                jwt.sign(
                    {
                        userId: results[0].id,
                        userEmail: results[0].email,
                    },
                        tokenKey,
                    {
                        expiresIn: "10d",//10일짜리 키
                        issuer: "fintech.admin",
                        subject: "user.login.info",
                    },
                    function (err, token) {
                        console.log("로그인 성공", token);
                        res.json(token);
                    }
                );

            }else{
                res.json("비밀번호가 다릅니다.");
            }
        }
      }
    }
  );
});

app.post("/list", function (req, res) {
    //request 계좌 목록 조회 요청 만들기 request 모듈 활용
    //res.json(aPI 결과 body 객체)

    var jwtToken = req.headers.jwtToken;
    //var user_seq_no ="1100760515";
    console.log("token :" ,jwtToken);

    var option = {
      method: "GET",
      url: "https://testapi.openbanking.or.kr/v2.0/user/me",
      headers: {
        "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzYwNTE1Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE2MDIzOTQ1MDYsImp0aSI6IjNlOTZhYWE5LWQyMDEtNDc5NS04YTE4LTQyMjNiOTk4MDRiYiJ9.a7hxTAIk3qvLaT5sWFxOYb7N4azE2axtKc_luO-Q970",
      },
      //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
      qs :{
        "user_seq_no" : "1100760515"
      }
    };

    request(option, function (error, response, body) {
      if (error) {
        console.error(error);
        throw error;
      } else {
        var resultJson = JSON.parse(body);
        console.log(resultJson);
        res.json(resultJson);
      }
    });
  });

app.listen(3000);
