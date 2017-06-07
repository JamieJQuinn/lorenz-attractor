var INIT_SIGMA=10;
var INIT_BETA=8/3;
var INIT_RHO=28;
var MAX_PARTICLES = 500;
var MAX_PATH_LENGTH = 500;
var SCALE=12;

var dt = 0.01;

var paths = [];
var particles = [];

var sigmaBox;
var betaBox;
var rhoBox;

var addParticlesButton;
var removeParticlesButton;
var colourEnabledButton;
var colourEnabled = false;

function addParticles() {
  for(var i=0; i<MAX_PARTICLES; ++i) {
    particles.push(new Particle(random(-width/4, width/4)/SCALE, random(-height/4, height/4)/SCALE, random(10, 30)));
    if (colourEnabled) {
      particles[i].colour = [random(0, 1), random(0, 1), random(0, 1)];
    }
  }
}

function removeParticles() {
  particles = particles.slice(0, -MAX_PARTICLES);
}

function toggleColours() {
  if (colourEnabled) {
    for(var i=0; i<particles.length; ++i) {
      particles[i].colour = [1, 1, 1];
    }
    for(var i=0; i<paths.length; ++i) {
      paths[i].colour = [1, 1, 1];
    }
  } else {
    for(var i=0; i<particles.length; ++i) {
      particles[i].colour = [random(0, 1), random(0, 1), random(0, 1)];
    }
    for(var i=0; i<paths.length; ++i) {
      paths[i].colour = [random(0, 1), random(0, 1), random(0, 1)];
    }
  }
  colourEnabled = !colourEnabled;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  sigmaBox = createInput();
  sigmaBox.position(20,20);
  sigmaBox.value(INIT_SIGMA);
  betaBox = createInput();
  betaBox.position(20, 50);
  betaBox.value(INIT_BETA);
  rhoBox = createInput();
  rhoBox.position(20, 80);
  rhoBox.value(INIT_RHO);

  addParticlesButton = createButton('+');
  addParticlesButton.position(20, 110);
  addParticlesButton.mousePressed(addParticles);
  removeParticlesButton = createButton('-');
  removeParticlesButton.position(50, 110);
  removeParticlesButton.mousePressed(removeParticles);
  colourEnabledButton = createButton('Toggle Colours');
  colourEnabledButton.position(20, 140);
  colourEnabledButton.mousePressed(toggleColours);
}

function mouseReleased() {
  var x = (mouseX - width/2)/SCALE;
  var y = (mouseY - height/2)/SCALE;
  if (mouseX > width/4 && mouseX < width*3/4 && mouseY > height/4 && mouseY < height*3/4) {
    paths.push(new Path(x, y, 10));
    if (colourEnabled) {
      paths[paths.length-1].colour = [random(0, 1), random(0, 1), random(0, 1)];
    }
  }
}

function calc_attractor(x, y, z, sigma, rho, beta) {
    return [sigma*(y-x), x*(rho-z) - y, x*y - beta*z];
}

function draw() {
  background(51);
  strokeWeight(1);
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
  strokeWeight(1);
  for(var i=0; i < particles.length; ++i) {
    p = particles[i];
    dxdydz = calc_attractor(p.x, p.y, p.z, sigma, rho, beta);
    p.x += dxdydz[0] * dt;
    p.y += dxdydz[1] * dt;
    p.z += dxdydz[2] * dt;

    stroke(255*p.colour[0], 255*p.colour[1], 255*p.colour[2]);
    point(SCALE*p.x, SCALE*p.y);
  }
}

var Particle = function(x0, y0, z0) {
  this.x = x0;
  this.y = y0;
  this.z = z0;
  this.colour = [1, 1, 1];
};

// A simple Path class
var Path = function(x_0, y_0, z_0) {
  this.x = Array.apply(null, Array(MAX_PATH_LENGTH)).map(Number.prototype.valueOf,x_0);
  this.y = Array.apply(null, Array(MAX_PATH_LENGTH)).map(Number.prototype.valueOf,y_0);
  this.z = Array.apply(null, Array(MAX_PATH_LENGTH)).map(Number.prototype.valueOf,z_0);
  this.last = 0;
  this.velocity = createVector(0, 0, 0);
  this.colour = [1, 1, 1];
};

Path.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Path.prototype.update = function(){
  var prev = this.last;
  this.last = (this.last+1) % MAX_PATH_LENGTH;
  this.x[this.last] = this.x[prev] + this.velocity.x * dt;
  this.y[this.last] = this.y[prev] + this.velocity.y * dt;
  this.z[this.last] = this.z[prev] + this.velocity.z * dt;
};

// Method to display
Path.prototype.display = function() {
  var count = 0;
  var j = (this.last+1)%MAX_PATH_LENGTH;
  var pj = this.last;
  while (count < MAX_PATH_LENGTH - 1 ){
    pj = j;
    j = (j+1) % MAX_PATH_LENGTH;
    ++count;
    var val = count/MAX_PATH_LENGTH*204;
    stroke(val*this.colour[0]+51, val*this.colour[1]+51, val*this.colour[2]+51);
    var linewidth = map(this.z[pj], 14, 30, 0.5, 2);
    strokeWeight(linewidth);
    line(SCALE*this.x[pj], SCALE*this.y[pj], SCALE*this.x[j], SCALE*this.y[j]);
    //ellipse(SCALE*this.x[j], SCALE*this.y[j], linewidth, linewidth);
  }
};
