var INIT_SIGMA=10;
var INIT_BETA=8/3;
var INIT_RHO=28;
var MAX_POINTS = 200;
var SCALE=12;

var dt = 0.01;

var paths = []

var sigmaBox;
var betaBox;
var rhoBox;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  sigmaBox = createInput();
  sigmaBox.position(20,20);
  sigmaBox.value(INIT_SIGMA);
  betaBox = createInput();
  betaBox.position(20, 50);
  betaBox.value(INIT_BETA);
  rhoBox = createInput();
  rhoBox.position(20, 80);
  rhoBox.value(INIT_RHO);
}

function mouseReleased() {
  var x = (mouseX - width/2)/SCALE;
  var y = (mouseY - height/2)/SCALE;
  if (mouseX > width/4 && mouseX < width*3/4 && mouseY > height/4 && mouseY < height*3/4) {
    paths.push(new Path(x, y, 0));
  }
}

function calc_attractor(x, y, z, sigma, rho, beta) {
    return [sigma*(y-x), x*(rho-z) - y, x*y - beta*z];
}

function draw() {
  background(51);
  translate(width/2, height/2);
  var sigma = sigmaBox.value();
  var beta = betaBox.value();
  var rho = rhoBox.value();
  for (var i=0; i < paths.length; ++i) {
    p = paths[i];

    dxdydz = calc_attractor(p.x[p.last], p.y[p.last], p.z[p.last], sigma, rho, beta);
    p.velocity.set(dxdydz[0], dxdydz[1], dxdydz[2]);

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
    var linewidth = map(this.z[pj], 14, 30, 0.5, 2);
    strokeWeight(linewidth);
    line(SCALE*this.x[pj], SCALE*this.y[pj], SCALE*this.x[j], SCALE*this.y[j]);
    //ellipse(SCALE*this.x[j], SCALE*this.y[j], linewidth, linewidth);
  }
};
