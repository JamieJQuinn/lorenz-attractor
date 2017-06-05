var x = [];
var y = [];
var z = [];

var SIGMA=10;
var BETA=8/3;
var RHO=28;

var SCALE=7;

var WEBGL_ENABLED = false;

var dt = 0.01;

function setup() {
  if (WEBGL_ENABLED) {
    createCanvas(windowHeight, windowHeight, WEBGL);
  } else {
    createCanvas(windowHeight, windowHeight);
  }
  frameRate(60);

  x.push(0.1);
  y.push(0);
  z.push(0);
}

function draw() {
  background(51);
  var px = x[x.length-1];
  var py = y[y.length-1];
  var pz = z[z.length-1];

  var dx = SIGMA*(py-px)*dt;
  var dy = (px*(RHO-pz) - py)*dt;
  var dz = (px*py - BETA*pz)*dt;

  x.push(px+dx);
  y.push(py+dy);
  z.push(pz+dz);

  if (WEBGL_ENABLED) {
  beginShape();
  for (var j = 0; j < x.length; ++j) {
    var val = j/x.length*204 + 51;
    fill(val);
    vertex(SCALE*x[j], SCALE*y[j], SCALE*z[j]);
  }
  endShape();
  } else {
    translate(width/2, height/2);
    for (var j = 1; j < x.length; ++j) {
      var val = j/x.length*204 + 51;
      stroke(val);
      line(SCALE*x[j-1], SCALE*y[j-1], SCALE*x[j], SCALE*y[j]);
    }

}}
