function multi(p1,p2){
    return p1*p2;
}

// const multi = (p1,p2)=>{
//     return p1*p2;
// };

//#workl func 3개 추가 : 더하기/빼기/나누기
function plus(p1,p2){
    return p1+p2;
}

function sub(p1,p2){
    return p1-p2;
}

function div(p1,p2){
    // if(p2!=0)
    //     return p1/p2;
    // else
    //     console.log("나눌 수 없어요!!");
    return p1/p2;
}

console.log(multi(1,2));
console.log(plus(1,2));
console.log(sub(1,2));
console.log(div(1,2));
console.log(div(1,0));