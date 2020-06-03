main();
var gl;
var ext;
var positionBuffer;
var numVertices;
var numInstances;
var matrixData;
var matrices;
var matrixBuffer;
var colorBuffer;

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  gl = canvas.getContext('webgl');
  ext  = gl.getExtension("ANGLE_instanced_arrays");
 

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `

    attribute vec4 a_position;
    attribute mat4 matrix;
    attribute vec4 color;

    varying vec4 v_color;

    void main() {
      gl_Position = matrix * a_position;
      v_color = color;
    }
  `;

  // Fragment shader program

  const fsSource = `
    precision highp float;
    varying vec4 v_color;
    void main() {
      gl_FragColor = v_color;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      a_position: gl.getAttribLocation(shaderProgram, 'a_position'),
      matrix: gl.getAttribLocation(shaderProgram, 'matrix'),
      color: gl.getAttribLocation(shaderProgram, 'color'),
    }
  };

  

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  initBuffers(gl, programInfo);


  function render(now) {
    // Draw the scene
    drawScene(now, gl, programInfo);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}


function initBuffers(gl, programInfo) {

  // postion 
  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -0.1,  0.4,
      -0.1, -0.4,
      0.1, -0.4,
      0.1, -0.4,
      -0.1,  0.4,
      0.1,  0.4,
      0.4, -0.1,
      -0.4, -0.1,
      -0.4,  0.1,
      -0.4,  0.1,
      0.4, -0.1,
      0.4,  0.1,
    ]), gl.STATIC_DRAW);
  numVertices = 12;

  // matrix
  numInstances = 5;
  matrixData = new Float32Array(numInstances * 16);
  matrices = [];
  for (let i = 0; i < numInstances; ++i) {
    const byteOffsetToMatrix = i * 16 * 4;
    const numFloatsForView = 16;
    matrices.push(new Float32Array(matrixData.buffer, byteOffsetToMatrix, numFloatsForView));
  }
  matrixBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);

  // setup colors, one per instance
  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([
          1, 0, 0, 1,  // red
          0, 1, 0, 1,  // green
          0, 0, 1, 1,  // blue
          1, 0, 1, 1,  // magenta
          0, 1, 1, 1,  // cyan
        ]),
      gl.STATIC_DRAW);
}

//
// Draw the scene.
//
function drawScene(time, gl, programInfo) {
  time *= 0.001;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(programInfo.program);


  // setup the position attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(programInfo.attribLocations.a_position);
  gl.vertexAttribPointer(
      programInfo.attribLocations.a_position,  // location
      2,            // size (num values to pull from buffer per iteration)
      gl.FLOAT,     // type of data in buffer
      false,        // normalize
      0,            // stride (0 = compute from size and type above)
      0,            // offset in buffer
  );

  
  // update all the matrices
  matrices.forEach((mat, ndx) => {
    mat4.fromTranslation(mat, [ -0.5 + ndx * 0.25, 0, 0]);
    mat4.rotateZ(mat, mat, time * (0.1 + 0.1 * ndx));
  });

  // upload the new matrix data
  gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

  const bytesPerMatrix = 4 * 16;
  for (let i = 0; i < 4; ++i) {
    const loc = programInfo.attribLocations.matrix + i;
    gl.enableVertexAttribArray(loc);
    // note the stride and offset
    const offset = i * 16;  // 4 floats per row, 4 bytes per float
    gl.vertexAttribPointer(
        loc,              // location
        4,                // size (num values to pull from buffer per iteration)
        gl.FLOAT,         // type of data in buffer
        false,            // normalize
        bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
        offset,           // offset in buffer
    );
    // this line says this attribute only changes for each 1 instance
    ext.vertexAttribDivisorANGLE(loc, 1);
  }

  // set attribute for color
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enableVertexAttribArray(programInfo.attribLocations.color);
  gl.vertexAttribPointer(programInfo.attribLocations.color, 4, gl.FLOAT, false, 0, 0);
  // this line says this attribute only changes for each 1 instance
  ext.vertexAttribDivisorANGLE(programInfo.attribLocations.color, 1);



  ext.drawArraysInstancedANGLE(
    gl.TRIANGLES,
    0,             // offset
    numVertices,   // num vertices per instance
    numInstances,  // num instances
  );

}














//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

