// World.js
// Shaun Munshi
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`


var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;     //use color
    }
    else if (u_whichTexture == -1){   //use UV debug color
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    }
    else if (u_whichTexture == 0){      //use texture
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
    else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else if (u_whichTexture == 2){ // this is an additional texture (dirt block)
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }
    else{                  //Error, put red
      gl_FragColor = vec4(1, 0.2, 0.2, 1);
    }
  }` 


let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2; //added a 3rd sampler for 3rd texture
let u_whichTexture;

function setupWebGL(){
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST); //Depth buffer will keep track of whats in front of something else.

}

function connectVariablesToGLSL(){

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // // Get the storage location of a_Position
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix')
    return
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture){
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }


  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements); 
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);   //If professor's guides make things dissapear, probably forgot to initialize something. 
}


// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor=[0.0,0.0,0.0,0.0];
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_globalAngle = 0;
let g_globalAngleY = 0;
let mouse_x = 0;
let mouse_y = 0;

let g1=[0,0,3];
let g2=[0,0,-105];
let g3=[0,2,0];

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addActionForHTMLUI();

  
  canvas.onmousedown = click;
  canvas.onmousemove = function (ev) { if(ev.buttons == 1) {click(ev) } };  //drag and move mouse on canvas

  
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

  requestAnimationFrame(tick);

  initTextures();
}

function addActionForHTMLUI(){
canvas.addEventListener('mousedown', function(ev) {
  canvas.addEventListener('mousemove', mouseMoveHandler);
});
canvas.addEventListener('mouseup', function(ev) {
  canvas.removeEventListener('mousemove', mouseMoveHandler);
});

document.getElementById('camX').addEventListener('input', function() {
  g_globalAngle = this.value; 
  renderAllShapes(); 
});  

document.getElementById('camY').addEventListener('input', function() {
  g_globalAngleY = this.value; 
  renderAllShapes(); 
});
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; 
  var y = ev.clientY; 
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
  
}

function initTextures() {
  var image = new Image();   
  image.src = '../lib/sky.jpg';

  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  image.onload = function(){ printTexture(image,0); }; 

  var image2 = new Image();
  image2.src = '../lib/floor.jpg';
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }
  image2.onload = function(){ printTexture(image2,1); }; 

  var image3 = new Image();
  image3.src = '../lib/dirt_block.jpg' 
  if (!image3) {
    console.log('Failed to create the image3 object');
    return false;
  }
  image3.onload = function(){printTexture(image3,2); };
  
  return true;
}


function printTexture(image, textureUnit) {
  var texture = gl.createTexture();
  if (!texture){
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0 + textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);


  if (textureUnit == 0) {
    gl.uniform1i(u_Sampler0, textureUnit);
  } else if (textureUnit == 1) {
    gl.uniform1i(u_Sampler1, textureUnit);
  } else if (textureUnit == 2) {
    gl.uniform1i(u_Sampler2, textureUnit);
  } 

  return texture;
}




var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now/1000.0-g_startTime;


function tick(){
  
  g_seconds = performance.now()/120.0-g_startTime;
  renderAllShapes();
  requestAnimationFrame(tick);
}


function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev); 
  let point;
  if(g_selectedType==POINT){
    point = new Point();
  }
  else if (g_selectedType==TRIANGLE){
    point = new Triangle();
  }
  else if (g_selectedType==CIRCLE){
    point = new Circle();
    point.segments = g_selectedSegment;  
  }

  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  renderAllShapes();
}

function mouseMoveHandler(ev) {
  let X = ev.clientX - mouse_x;
  let Y = ev.clientY - mouse_y;
  
  g_globalAngle += X * 0.5; 
  g_globalAngleY += Y * 0.5;
  
  mouse_x = ev.clientX;
  mouse_y = ev.clientY;
  
  renderAllShapes(); 
}

function renderAllShapes(){

  var startTime = performance.now();

  
  var projMat = new Matrix4();
  projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  
  var viewMat=new Matrix4();
  viewMat.setLookAt(g1[0], g1[1], g1[2], g2[0], g2[1], g2[2], g3[0], g3[1], g3[2]);  //(eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

 
  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0).rotate(g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 


  var grass = new Cube();
  var background = new Cube();
  var control_cube = new Cube();
  var dirt_block = new Cube();
  var hay_bale = new Cylinder();

  grass.color = [1.0, 0.0, 0.0, 1.0];
  background.color = [1, 1, 0, 1];
  control_cube.color = [1.0, 1.0, 1.0, 1.0];
  dirt_block.color = [1,0,1,1];
  hay_bale.color = [1.0, 1.0, 1.0, 1.0];

  grass.textureNum=1;
  background.textureNum= 0;
  dirt_block.textureNum = 2;
  hay_bale.textureNum = 1;

  grass.matrix.translate(0, -0.75, 0.0);
  grass.matrix.scale(10, 0, 10);
  grass.matrix.translate(-0.5, 0, -0.5);
  grass.render();

  background.matrix.scale(50,50,50);
  background.matrix.translate(-0.5, -0.5, -0.5);
  background.render();
  
  control_cube.matrix.translate(0.5, -0.75, 0.0);
  control_cube.matrix.rotate(-5, 1, 0, 0);
  control_cube.matrix.scale(0.6, 0.6, 0.6);
  control_cube.render();

  dirt_block.matrix.setTranslate(0,-0.75,0.0);
  dirt_block.matrix.rotate(-5, 1, 0, 0);
  dirt_block.matrix.scale(0.75, 0.75, 0.75);
  dirt_block.matrix.translate(-0.5,0,-0.001);
  dirt_block.render();
  
  hay_bale.matrix.translate(-0.75, -0.5, 0.5);
  hay_bale.matrix.scale(0.5, 0.5, 0.5);
  hay_bale.render();
}
