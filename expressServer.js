const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
var mysql = require("mysql");
const jwt = require("jsonwebtoken");
const auth = require("./lib/auth");

//mysql에 접근 가능한 사용자 확인 여부
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "8603",//비밀번호
  database: "fintech",
  port: "3306"
});

connection.connect();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public"))); //to use static asset

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/authTest", auth, function (req, res) {//middleware추가
  console.log(req.decoded);
  res.json("로그인이 완료된 사용자가 보는 화면");
});

app.get("/main", function (req, res) {
  res.render("main");
});

app.get("/balance", function (req, res) {
  res.render("balance");
});

app.get("/qrcode", function (req, res) {
  res.render("qrcode");
});

app.get("/qrreader", function (req, res) {
  res.render("qrreader");
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
    if (error) {
      console.error(error);
    } else {
      var accessRequestResult = JSON.parse(body);
      console.log(accessRequestResult);
      res.render("resultChild", { data: accessRequestResult });
    }
  });
});

app.post("/signup", function (req, res) {
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

app.post("/login", function (req, res) {
  console.log(req.body);
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;

  //DB에 있는 데이터랑 확인해서 일치하면 email, pw 존재 -> token발급
  //토큰 사용 이유 : 서비스에 접근하기 위한 유저들을 확인하기 위해

  var sql = "SELECT * FROM user WHERE email = ?";
  connection.query(
    sql, [userEmail], function (error, results) {
      if (error) throw error;
      else {
        if (results.length == 0) {
          res.json("등록되지 않은 회원입니다.");
        } else {
          //회원이 존재한다면 password확인
          var dbPassword = results[0].password;
          console.log("DB에서 가져온 패스워드 : ", dbPassword);

          //db에서 가져온 패스워드랑 같다면 로그인 성공
          if (dbPassword == userPassword) {
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

          } else {
            res.json("비밀번호가 다릅니다.");
          }
        }
      }
    }
  );
});

app.post("/list", auth, function (req, res) {//멀티 유저가 사용 -> auth넣어서
  var userId = req.decoded.userId;//몇번째 유저가 접속했는지 알수 있음!

  //db에 접속해서 access, refreshToken가져오기
  var sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql, [userId], function (error, results) {
    if (error) {
      throw error;
    } else {
      console.log(results[0]);
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/user/me",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + results[0].accesstoken,
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        qs: {
          user_seq_no: results[0].userseqno,
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
    }
  });
});

app.post("/balance", auth, function (req, res) {//사용자정보에 따라 -> auth
  var userId = req.decoded.userId;
  var fin_use_num = req.body.fin_use_num;
  console.log("받아온 데이터 ", userId, fin_use_num);

  var sql = "SELECT * FROM user WHERE id=?";

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991641960U" + countnum;

  connection.query(sql, [userId], function (err, results) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log("밸런스에 받아온 데이터 베이스 값 : ", results);
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + results[0].accesstoken,
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        qs: {
          bank_tran_id: transId,
          fintech_use_num: fin_use_num,
          tran_dtime: "20200715123633" //date만들어두 댐!
        },
      };

      request(option, function (err, response, body) {
        console.log(body);
        var balanceResult = JSON.parse(body);
        res.json(balanceResult);
      });
    }
  });
});

app.post("/transactionList", auth, function (req, res) {
  var userId = req.decoded.userId;
  var fin_use_num = req.body.fin_use_num;
  console.log(userId, fin_use_num + " 의 거래 내역 조회 하기");

  var sql = "SELECT * FROM user WHERE id=?";

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991641960U" + countnum;

  connection.query(sql, [userId], function (err, results) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + results[0].accesstoken,
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        qs: {
          bank_tran_id: transId,
          fintech_use_num: fin_use_num,
          inquiry_type: "A",
          inquiry_base: "D",
          from_date: "20190101",
          to_date: "20200715", //나중에 사용자로 부터 입력을 받아오도록!
          sort_order: "D",
          tran_dtime: "20200715140733"
        },
      };

      request(option, function (err, response, body) {
        console.log(body);
        var transactionListResult = JSON.parse(body);
        res.json(transactionListResult);
      });
    }
  });
});

app.post("/withdraw", auth, function (req, res) {
  //출금이체 코드를 작성해보자!
  //출금이 발생할 핀테크번호는 고정값 사용 -> 199164196057885159724922

  var userId = req.decoded.userId;
  var fin_use_num = req.body.fin_use_num;
  var amount = req.body.amount;
  console.log("받아온 데이터", userId, fin_use_num);

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991641960U" + countnum;

  var sql = "SELECT * FROM user WHERE id=?";

  connection.query(sql, [userId], function (err, results) {
    if(err){
      console.error(err);
      throw err;
    }else{
      var option = {
        method: "POST",
        url: "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + results[0].accesstoken,
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        json: {
          "bank_tran_id": transId,
          "cntr_account_type": "N",
          "cntr_account_num": "0762301594",
          "dps_print_content": "쇼핑몰환불",
          "fintech_use_num": fin_use_num,
          "wd_print_content": "오픈뱅킹출금",
          "tran_amt": amount,
          "tran_dtime": "20200720114100",
          "req_client_name": "홍길동",
          "req_client_num": "HONGGILDONG1234",
          "transfer_purpose": "ST",
          "req_client_fintech_use_num": "199164196057885159724922",
          "recv_client_name": "김오픈",
          "recv_client_bank_code": "097",
          "recv_client_account_num": "0762301594"
        },
      };

      request(option, function (err, response, body) {
        console.log(body);
        res.json(body);
      });
    }
  });
});

app.listen(3000);
