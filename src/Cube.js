class Cube{
   constructor(color=null){
     this.type = 'cube';
    
     this.color = [1.0, 1.0, 1.0, 1.0];
     if(color){
       this.color = color;
     }
     
     
     this.matrix = new Matrix4();
 
     this.buffer = null;
 
     this.textureNum = -1;
   }
 
   render(){
     
     var rgba = this.color;
     // var size = this.size;
 
     gl.uniform1i(u_whichTexture, this.textureNum);
 
     // Pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
 
     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
 
 
     // front
     drawTriangle3DUV( [0,0,0,   1,1,0,   1,0,0], [0,0,   1,1,   1,0] );
    drawTriangle3DUV( [0,0,0,   1,1,0,   0,1,0], [0,0,   1,1,   0,1] );
     
     let num = 0.9;
     // pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);
 
     
     drawTriangle3DUV( [0,1,0,   1,1,1,   0,1,1], [0,0,   1,1,   0,1] );
     drawTriangle3DUV( [0,1,0,   1,1,1,   1,1,0], [0,0,   1,1,   1,0] );
 
 
     num = 0.4;
     // pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);
 
     
     drawTriangle3DUV( [0,1,1,   0,0,0,   0,1,0], [0,1,   1,0,   1,1] );
       drawTriangle3DUV( [0,1,1,   0,0,0,   0,0,1], [0,1,   1,0,   0,0] );
     // 0,1,   0,0,   0,1
     // 0,1,   0,0,   0,0
 
 
     num = 0.8;
     // pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);
 
     
     drawTriangle3DUV( [1,0,1,   1,1,0,   1,0,0], [1,0,   0,1,   0,0] );
       drawTriangle3DUV( [1,0,1,   1,1,0,   1,1,1], [1,0,   0,1,   1,1] );
 
 
     num = 0.7;
     // pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);
 
     
     drawTriangle3DUV( [1,0,1,   0,0,0,   1,0,0], [1,0,   0,1,   1,1] );
       drawTriangle3DUV( [1,0,1,   0,0,0,   0,0,1], [1,0,   0,1,   0,0] );
 
 
     num = 0.6;
     // pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0]*num, rgba[1]*num, rgba[2]*num, rgba[3]);

     drawTriangle3DUV( [1,0,1,   0,1,1,   1,1,1], [0,0,   1,1,   0,1] );
    drawTriangle3DUV( [1,0,1,   0,1,1,   0,0,1], [0,0,   1,1,   1,0] );
 
   }
 
 }