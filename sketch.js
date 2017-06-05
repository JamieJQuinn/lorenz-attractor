var SIGMA=10;
var BETA=8/3;
var RHO=28;

var MAX_POINTS = 200;

var SCALE=7;

var dt = 0.01;

var paths = []

function setup() {
  createCanvas(windowHeight, windowHeight);
  frameRate(60);
}

function mouseReleased() {
  var x = (mouseX - width/2)/SCALE;
  var y = (mouseY - width/2)/SCALE;
  paths.push(new Path(x, y, 0));
}

function draw() {
  background(51);
  translate(width/2, height/2);
  for (var i=0; i < paths.length; ++i) {
    p = paths[i];
    var px = p.x[p.last];
    var py = p.y[p.last];
    var pz = p.z[p.last];

    var dx = SIGMA*(py-px);
    var dy = px*(RHO-pz) - py;
    var dz = px*py - BETA*pz;

    p.velocity.set(dx, dy, dz);

    p.update();
    p.display();
  }
}

// A simple Path class
var Path = function(x_0, y_0, z_0) {
  this.x = Array.apply(null, Array(MAX_POINTS)).map(Number.prototype.valueOf,x_0);
  this.y = Array.apply(null, Array(MAX_POINTS)).map(Number.prototype.valueOf,y_0);
  this.z = Array.apply(null, Array(MAX_POINTS)).map(Number.prototype.valueOf,z_0);
  this.last = 0;
  this.velocity = createVector(0, 0, 0);
};

Path.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Path.prototype.update = function(){
  var prev = this.last;
  this.last = (this.last+1) % MAX_POINTS;
  this.x[this.last] = this.x[prev] + this.velocity.x * dt;
  this.y[this.last] = this.y[prev] + this.velocity.y * dt;
  this.z[this.last] = this.z[prev] + this.velocity.z * dt;
};

// Method to display
Path.prototype.display = function() {
  var count = 0;
  var j = (this.last+1)%MAX_POINTS;
  var pj = this.last;
  while (count < MAX_POINTS - 1 ){
    pj = j;
    j = (j+1) % MAX_POINTS;
    ++count;
    var val = count/MAX_POINTS*204 + 51;
    stroke(val);
    var linewidth = map(this.z[j], 14, 30, 0.5, 2);
    //strokeWeight(linewidth);
    //line(SCALE*this.x[pj], SCALE*this.y[pj], SCALE*this.x[j], SCALE*this.y[j]);
    ellipse(SCALE*this.x[j], SCALE*this.y[j], linewidth, linewidth);
  }
};
