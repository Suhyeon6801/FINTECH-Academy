var fs = require('fs');

console.log('first func');

function callbackFunc(callback) {

    fs.readFile('./example/test.txt', 'utf8', function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        } else {
            console.error("두번재 기능인데 파일을 읽어오느라 시간이... 조큼... 걸려요");
            callback(result);
        }
    });
}

callbackFunc(function (resultInCallback){
    console.log(resultInCallback);
    console.log("third!!");
})