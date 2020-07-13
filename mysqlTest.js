var mysql      = require('mysql');

//mysql에 접근 가능한 사용자 확인 여부
var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "",//비밀번호
  database : "fintech",
  port : "3306"
});
 
connection.connect();
 
connection.query("SELECT * FROM USER", function (error, results, fields) {
  if (error) throw error;
  console.log("우리 회원들은 : ", results);
});
 
connection.end();