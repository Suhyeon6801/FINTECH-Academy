const express = require("express")
const app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/addRouter',function(req,res){
    console.log("router working");
    res.send("안녕하세요, 새로 추가 된 라우터 입니다.");
});
 
app.listen(3000)