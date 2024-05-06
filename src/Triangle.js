class Triangle{
    constructor(){
      this.type = 'triangle';
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
  
      this.buffer = null;
      this.uvBuffer = null;
    }
  
    render(){
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
    
    
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
      gl.uniform1f(u_Size, size);
  
      // gl.drawArrays(gl.POINTS, 0, 1);
      var d = this.size/200.0;
      drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d])
    }
  
  }
  
  
  
  function drawTriangle(vertices) {
    
    var n = 3; 
  
    
    if (this.buffer == null) {
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
  
    // return n;
  }
  
  function drawTriangle3D(vertices) {
  
    var n = vertices.length/3;
  
    // Create a buffer object
    if (this.buffer == null) {
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
  
    
  }
  
  function drawTriangle3DUV(vertices, uv) {
    // var n = 3; // The number of vertices
    var n = vertices.length/3;
  
    
    if (this.buffer == null) {
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    }
  
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    
    if (this.uvBuffer == null) {
      this.uvBuffer = gl.createBuffer();
      if (!this.uvBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
  
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  
    
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  
    
    gl.enableVertexAttribArray(a_UV);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
  
   
  }