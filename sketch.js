var INIT_SIGMA=10;
var INIT_BETA=8/3;
var INIT_RHO=28;
var MAX_PARTICLES = 100;
var MAX_PATH_LENGTH = 500;
var SCALE=12;
var ALPHA_PARTICLES = 0.05;
var BG_COLOUR = 51;

var dt = 0.0005;

var paths = [];
var particles = [];

var sigmaBox;
var betaBox;
var rhoBox;

var addParticlesButton;
var removeParticlesButton;
var colourEnabledButton;
var colourEnabled = false;

var alphaBlendingButton;
var alphaBlending = false;
var clearEnabled = true;
var alphaVal = 1;

var depthEnabled = false;

var paused = false;

function addParticles() {
  for(var i=0; i<MAX_PARTICLES; ++i) {
    particles.push(new Particle(random(-width/4, width/4)/SCALE, random(-height/4, height/4)/SCALE, random(10, 30)));
    if (colourEnabled) {
      particles[i].colour[0] = random(0, 1);
      particles[i].colour[1] = random(0, 1);
      particles[i].colour[2] = random(0, 1);
      particles[i].colour[3] = alphaVal;
    }
  }
}

function removeParticles() {
  particles = particles.slice(0, -MAX_PARTICLES);
}

function toggleAlphaBlending() {
  if (alphaBlending) {
    alphaVal = 1;
  } else {
    background(BG_COLOUR);
    alphaVal = ALPHA_PARTICLES;
  }
  for(var i=0; i<particles.length; ++i) {
    particles[i].colour[3] = alphaVal;
  }
  for(var i=0; i<paths.length; ++i) {
    paths[i].colour[3] = alphaVal;
  }
  alphaBlending = !alphaBlending;
  clearEnabled = !clearEnabled;
}

function toggleColours() {
  if (colourEnabled) {
    for(var i=0; i<particles.length; ++i) {
      particles[i].colour = [1, 1, 1, alphaVal];
    }
    for(var i=0; i<paths.length; ++i) {
      paths[i].colour = [1, 1, 1, alphaVal];
    }
  } else {
    for(var i=0; i<particles.length; ++i) {
      particles[i].colour = [random(0, 1), random(0, 1), random(0, 1), alphaVal];
    }
    for(var i=0; i<paths.length; ++i) {
      paths[i].colour = [random(0, 1), random(0, 1), random(0, 1), alphaVal];
    }
  }
  colourEnabled = !colourEnabled;
}

function rotateY(x, z, theta) {
  return [x*Math.cos(theta) - z*Math.sin(theta), x*Math.sin(theta) + z*Math.cos(theta)];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  background(BG_COLOUR);

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

  removePathButton = createButton('Remove Path');
  removePathButton.position(20, 260);
  removePathButton.mousePressed(function() {
    paths = paths.slice(0, -1);
  });

  colourEnabledButton = createButton('Toggle Colours');
  colourEnabledButton.position(20, 140);
  colourEnabledButton.mousePressed(toggleColours);

  alphaBlendingButton = createButton('Toggle Alpha Blending');
  alphaBlendingButton.position(20, 170);
  alphaBlendingButton.mousePressed(toggleAlphaBlending);

  pauseButton = createButton('Pause/Play');
  pauseButton.position(20, 200);
  pauseButton.mousePressed(function() {paused = ! paused;});

  depthEnabledButton = createButton('Toggle Depth');
  depthEnabledButton.position(20, 230);
  depthEnabledButton.mousePressed(function() {depthEnabled = ! depthEnabled;});
}

function mousePressed() {
  if (mouseButton == LEFT) {
    var x = (mouseX - width/2)/SCALE;
    var y = (mouseY - height/2)/SCALE;
    if (mouseX > width/4 && mouseX < width*3/4 && mouseY > height/4 && mouseY < height*3/4) {
      paths.push(new Path(x, y, 10));
      if (colourEnabled) {
        paths[paths.length-1].colour = [random(0, 1), random(0, 1), random(0, 1), alphaVal];
      }
    }
  }
}

function calc_attractor(x, y, z, sigma, rho, beta) {
    return [sigma*(y-x), x*(rho-z) - y, x*y - beta*z];
}

function draw() {
  if ( !paused ) {
    var sigma = sigmaBox.value();
    var beta = betaBox.value();
    var rho = rhoBox.value();
    for (var i=0; i < paths.length; ++i) {
      var p = paths[i];
      dxdydz = calc_attractor(p.x[p.last], p.y[p.last], p.z[p.last], sigma, rho, beta);
      p.velocity.set(dxdydz[0], dxdydz[1], dxdydz[2]);
      randomSign = random(1) - 0.5 < 0 ? -1 : 1;
      p.offset[(p.last+1)%MAX_PATH_LENGTH] = randomSign*map(dxdydz[2], -10, 10, 0, 0.005);
      p.update();
    }
    for(var i=0; i < particles.length; ++i) {
      var p = particles[i];
      dxdydz = calc_attractor(p.x, p.y, p.z, sigma, rho, beta);
      p.x += dxdydz[0] * dt;
      p.y += dxdydz[1] * dt;
      p.z += dxdydz[2] * dt;
    }
  }

  if ( !(alphaBlending && paused) ) {
    translate(width/2, height/2);
    if (clearEnabled) {
      background(BG_COLOUR);
    }
    strokeWeight(1);
    for (var i=0; i < paths.length; ++i) {
      var p = paths[i];
      p.display();
    }
    strokeWeight(1);
    for(var i=0; i < particles.length; ++i) {
      var p = particles[i];
      stroke(255*p.colour[0], 255*p.colour[1], 255*p.colour[2], 255*p.colour[3]);
      point(SCALE*p.x, SCALE*p.y);
    }
  }
}

var Particle = function(x0, y0, z0) {
  this.x = x0;
  this.y = y0;
  this.z = z0;
  this.colour = [1, 1, 1, alphaVal];
};

// A simple Path class
var Path = function(x_0, y_0, z_0) {
  this.x = Array.apply(null, Array(MAX_PATH_LENGTH)).map(Number.prototype.valueOf,x_0);
  this.y = Array.apply(null, Array(MAX_PATH_LENGTH)).map(Number.prototype.valueOf,y_0);
  this.z = Array.apply(null, Array(MAX_PATH_LENGTH)).map(Number.prototype.valueOf,z_0);
  this.offset = Array.apply(null, Array(MAX_PATH_LENGTH)).map(Number.prototype.valueOf,0);
  this.last = 0;
  this.velocity = createVector(0, 0, 0);
  this.colour = [1, 1, 1, alphaVal];
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
  if (!alphaBlending) {
    while (count < MAX_PATH_LENGTH - 1 ){
      pj = j;
      j = (j+1) % MAX_PATH_LENGTH;
      ++count;
      var val = map(count, 0, MAX_PATH_LENGTH, 0, 255-BG_COLOUR);
      stroke(val*this.colour[0]+BG_COLOUR,
             val*this.colour[1]+BG_COLOUR,
             val*this.colour[2]+BG_COLOUR);
      if (depthEnabled) {
        var linewidth = map(this.z[pj], 10, 40, 0.2, 2);
        strokeWeight(linewidth);
      }
      xOld = SCALE*this.x[pj]-SCALE*this.y[pj]*this.offset[pj]
      yOld = SCALE*this.y[pj]+SCALE*this.x[pj]*this.offset[pj]
      xNew = SCALE*this.x[ j]-SCALE*this.y[ j]*this.offset[ j]
      yNew = SCALE*this.y[ j]+SCALE*this.x[ j]*this.offset[ j]
      line(xOld, yOld, xNew, yNew);
      //ellipse(SCALE*this.x[j], SCALE*this.y[j], linewidth, linewidth);
    }
  } else {
    var j = this.last;
    var pj = (this.last-1)%MAX_PATH_LENGTH;
    var val = 255-BG_COLOUR;
    stroke(val*this.colour[0]+BG_COLOUR,
           val*this.colour[1]+BG_COLOUR,
           val*this.colour[2]+BG_COLOUR,
           255*this.colour[3]);
    xOld = SCALE*this.x[pj]-SCALE*this.y[pj]*this.offset[pj]
    yOld = SCALE*this.y[pj]+SCALE*this.x[pj]*this.offset[pj]
    xNew = SCALE*this.x[ j]-SCALE*this.y[ j]*this.offset[ j]
    yNew = SCALE*this.y[ j]+SCALE*this.x[ j]*this.offset[ j]
    line(xOld, yOld, xNew, yNew);
  }
};
