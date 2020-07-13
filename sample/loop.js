var cars=["Saab","Volvo","BMW","Ford","Fiat","Audi"];
var text="";
var i;

for(i=0; i<cars.length; i++){
    text+=cars[i];
    console.log(cars[i]);
}

cars.map((car)=>{
    console.log(car,"es6 map");
});

console.log(text);

