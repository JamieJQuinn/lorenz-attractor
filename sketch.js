var x = [];
var y = [];
var z = [];

function setup() {
  createCanvas(windowHeight, windowHeight, WEBGL);
  frameRate(30);

  x.push(width/2);
  y.push(height/2);
  z.push(0);
}

function draw() {
  background(51);
}
