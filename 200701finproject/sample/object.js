var car = {
	name: "sonata",
	ph: "500ph",
	start: function () {
		console.log("engine is starting");
	},
	stop: function () {
		console.log("engine is stoped");
	}

};

var car2 = {
	name: "bmw",
	ph: "500ph",
	start: function () {
		console.log("engine is starting");
	},
	stop: function () {
		console.log("engine is stoped");
	}

};

var car3 = {
	name: "volvo",
	ph: "500ph",
	start: function () {
		console.log("engine is starting");
	},
	stop: function () {
		console.log("engine is stoped");
	}

};

var cars = [car, car2, car3];

console.log(cars);

console.log(cars[2].name);//API쓸 때 진짜 많이 쓴다.

console.log("============= map ==============");
cars.map((cars) => {
	console.log(cars.name);
});

console.log("============= if ===============");
//# for if 문을 활용해서 array 자동차 이름이 bmw가 포함되어있으면 find!로그 출력

//map
// cars.map((cars)=>{
// 	if(cars.name=="bmw"){
// 		console.log("find!");
// 	}
// })

//for
var i;
for (i = 0; i < cars.length; i++) {
	if (cars[i].name == "bmw") {
		console.log("find!");
	} else {
		console.log("can not found");
	}
}