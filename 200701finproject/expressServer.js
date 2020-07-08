const express = require("express");
const { request } = require("express");
const app = express();
const path = require("path");

app.set("views", __dirname+"/views");
app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'public')));//to use static asset
 
app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get("/ejsTest", function(req,res){
    res.render('test');
});

app.get("/ejsTable", function(req,res){
    console.log("table test");
    res.render('testTable');
});

app.post("/ajaxTest", function(req,res){
    var userID = req.body.sendUserID;
    var userPW = req.body.sendUserPW;
    var userName = req.body.sendUserName;
    var userEmail = req.body.sendUSerEmail;

    console.log("요청 바디 : ", req.body);
    // console.log("사용자의 아이디는 : ", userID);
    // console.log("사용자의 비빌번호는 : ", userPW);

    res.json("로그인에 성공하셨습니다.");
});

app.get('/addRouter',function(req,res){
    console.log("router working");
    res.send("안녕하세요, 새로 추가 된 라우터 입니다.");
});
 
app.listen(3000)