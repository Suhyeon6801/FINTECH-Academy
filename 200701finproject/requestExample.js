//npm js : request 사용해보기
//data.go.kr -> api를 통해 데이터를 요청해서 데이터 가져오기

const request = require("request");
var parseString = require('xml2js').parseString;

var url = "http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109";//json이 아닌 api, XML

//var url = "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json";//코로나 정보(json형태);
request(url, function (error, response, body) {
  //console.error('error:', error); // Print the error if one occurred
  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.

  //json to javascript object
  /*
  var parsedData = JSON.parse(body);
  console.log("parsed Data : ", parsedData.count);
  */
  
  //json이 아닌경우 ex XML -> 태그를 하나하나 풀어도 되지만 시간도 걸리고 귀찮음..;; -> npm에서 XML parser를 찾아보자!!
  //xml to javascript object : xml2js
  parseString(body, function(err,result){
    //필요한 데이터를 뽑아보자!
    console.dir(result.rss.channel[0].item[0].description[0].header[0].wf[0]);//wf에 대한 정보
  });

});
