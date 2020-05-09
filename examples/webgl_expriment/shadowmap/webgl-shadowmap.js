var cubeRotation = 0.0;
var resolution = 1024;
var offset_width = resolution;
var offset_height = resolution;
var light_pos = [4, 8.0, -6.0];
var canvas;

main();

//
// Start here
//
function main() {
  canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  //============================ create shadow program
  const shadow_create_vsSource = `
  precision highp float;
  attribute vec4 aVertexPosition;
  uniform mat4 uMvpMatrix;
  void main(void) {
    gl_Position = uMvpMatrix * aVertexPosition;
  }
`;


const shadow_create_fsSource = `
  precision highp float;
  void main(void) {
    const vec4 bitShift = vec4(1.0, 256.0, 256.0*256.0, 256.0*256.0*256.0);
    const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
    vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);
    rgbaDepth -= rgbaDepth.gbaa * bitMask;
    gl_FragColor = rgbaDepth;
  }
`;


const shadow_create_shaderProgram = initShaderProgram(gl, shadow_create_vsSource, shadow_create_fsSource);

  const shadow_create_shaderProgram_info = {
    program: shadow_create_shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shadow_create_shaderProgram, 'aVertexPosition')
    },
    uniformLocations: {
      uMvpMatrix: gl.getUniformLocation(shadow_create_shaderProgram, 'uMvpMatrix')
    },
  };


// ====================== shadwo display program

const shadow_display_vsSource = `
precision highp float;

attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMvpMatrix;
uniform mat4 uMvpMatrixFromLight;

varying vec4 v_PositionFromLight;
varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uMvpMatrix * aVertexPosition;
  v_PositionFromLight = uMvpMatrixFromLight * aVertexPosition;
  vTextureCoord = aTextureCoord;
}
`;


const shadow_display_fsSource = `
precision highp float;
uniform sampler2D uNormalTexture;
uniform sampler2D uShadowMap;
varying vec4 v_PositionFromLight;
varying highp vec2 vTextureCoord;

float unpackDepth(const in vec4 rgbaDepth){
    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
    float depth = dot(rgbaDepth, bitShift);
    return depth;
}

void main(void) {
    vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0 + 0.5;
    vec4 rgbaDepth = texture2D(uShadowMap, shadowCoord.xy);
    float depth = unpackDepth(rgbaDepth);
    float visibility = (shadowCoord.z > depth + 0.0015) ? 0.5 : 1.0;
    vec4 textureColor = texture2D(uNormalTexture, vTextureCoord);
    gl_FragColor = vec4(textureColor.rgb * visibility, textureColor.a);
}
`;


const shadow_display_shaderProgram = initShaderProgram(gl, shadow_display_vsSource, shadow_display_fsSource);

const shadow_display_shaderProgram_info = {
  program: shadow_display_shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shadow_display_shaderProgram, 'aVertexPosition'),
    textureCoord: gl.getAttribLocation(shadow_display_shaderProgram, 'aTextureCoord'),
  },
  uniformLocations: {
    uMvpMatrix: gl.getUniformLocation(shadow_display_shaderProgram, 'uMvpMatrix'),
    uMvpFromLight: gl.getUniformLocation(shadow_display_shaderProgram, 'uMvpMatrixFromLight'),
    uNormalTexture: gl.getUniformLocation(shadow_display_shaderProgram, 'uNormalTexture'),
    uShadowMap: gl.getUniformLocation(shadow_display_shaderProgram, 'uShadowMap')
  },
};

// ======================= normal program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uMvpMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uMvpMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      uMvpMatrix: gl.getUniformLocation(shaderProgram, 'uMvpMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  // ================= cube 
  const cubeBuffers = initCubeBuffers(gl);
  const cubeTexture = loadTexture(gl, 'cubetexture.png');
  const cubeModelViewMatrix = mat4.create();


  mat4.translate(cubeModelViewMatrix,     // destination matrix
    cubeModelViewMatrix,     // matrix to translate
    [0.0, 0.0, 0.0]);  // amount to translate


  mat4.rotate(cubeModelViewMatrix,  // destination matrix
  cubeModelViewMatrix,  // matrix to rotate
  45,     // amount to rotate in radians
  [0, 0, 1]);       // axis to rotate around (Z)


  mat4.rotate(cubeModelViewMatrix,  // destination matrix
  cubeModelViewMatrix,  // matrix to rotate
  45,// amount to rotate in radians
  [0, 1, 0]);       // axis to rotate around (X)

// ===================== plane 

const planeBuffers = initCubeBuffers(gl);
const planeTexture = loadTexture(gl, 'floor.png');
const planeModelViewMatrix = mat4.create();


mat4.translate(planeModelViewMatrix,     // destination matrix
  planeModelViewMatrix,     // matrix to translate
  [0.0, -5.0, 0.0]);  // amount to translate


mat4.scale(planeModelViewMatrix,     // destination matrix
    planeModelViewMatrix,     // matrix to translate
    [10, 0.01, 10]); 


// =============================== light

 const lightBuffers = initCubeBuffers(gl);
 const lightTexture = loadTexture(gl, 'white1.png');
 const lightModelViewMatrix = mat4.create();


  mat4.translate(lightModelViewMatrix,     // destination matrix
    lightModelViewMatrix,     // matrix to translate
    light_pos);  // amount to translate


  mat4.scale(lightModelViewMatrix,  // destination matrix
    lightModelViewMatrix,  // matrix to rotate
  [0.3, 0.3, 0.3]);       // axis to rotate around (X)


  var then = 0;


  // ================ perspective camera 
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 1000.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);


  let cameraViewMatrix = mat4.create();
  mat4.lookAt(cameraViewMatrix, [0.0, 0.0, 20], [0,0,0], [0,1,0]);
  mat4.mul(projectionMatrix, projectionMatrix, cameraViewMatrix);


  // ===============  view project matrix from light
  const viewProjectMatrixFromLight = mat4.create();
  mat4.ortho(viewProjectMatrixFromLight,
                   -40.0,
                   40.0,
                   -40.0,
                   40.0,
                   -40.0,
                   90);
  let lookAtMatrix_light = mat4.create();
  mat4.lookAt(lookAtMatrix_light, light_pos, [0,0,0], [0,1,0]);
  mat4.mul(viewProjectMatrixFromLight, viewProjectMatrixFromLight, lookAtMatrix_light);


 // ====== create init framebuffer
  var fbo = initFramebufferObject(gl);
  if(!fbo){
      console.error("inite framebuffer fail!");
      return;
  }

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0.0,0.0,offset_height,offset_height);

    
    // create cube shadow
    var mvpFromLight_cube = mat4.create();
    mat4.mul(mvpFromLight_cube, viewProjectMatrixFromLight, cubeModelViewMatrix);
    drawShadow(gl, shadow_create_shaderProgram_info, cubeBuffers, mvpFromLight_cube);

    // create plane shadow
    var mvpFromLight_plane = mat4.create();
    mat4.mul(mvpFromLight_plane, viewProjectMatrixFromLight, planeModelViewMatrix);
    drawShadow(gl, shadow_create_shaderProgram_info, planeBuffers, mvpFromLight_plane);

    // save shadow image
    // createImageFromTexture(gl, fbo.texture, offset_width, offset_height);

    gl.viewport(0.0,0.0,canvas.width,canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mvp_cube = mat4.create();
    mat4.mul(mvp_cube, projectionMatrix, cubeModelViewMatrix);
    drawSceneWithShadow(gl, shadow_display_shaderProgram_info, cubeBuffers, mvp_cube, mvpFromLight_cube, cubeTexture, fbo.texture);
    
    var mvp_plane = mat4.create();
    mat4.mul(mvp_plane, projectionMatrix, planeModelViewMatrix);
    drawSceneWithShadow(gl, shadow_display_shaderProgram_info, planeBuffers, mvp_plane, mvpFromLight_plane, planeTexture, fbo.texture);

    // var mvpMatrix_cube = mat4.create();
    // mat4.mul(mvpMatrix_cube, projectionMatrix, cubeModelViewMatrix);
    // drawScene(gl, programInfo, cubeBuffers, mvpMatrix_cube, cubeTexture);

    // var mvpMatrix_plane = mat4.create();
    // mat4.mul(mvpMatrix_plane, projectionMatrix, planeModelViewMatrix);
    // drawScene(gl, programInfo, planeBuffers, mvpMatrix_plane, planeTexture);

    var mvpMatrix_light = mat4.create();
    mat4.mul(mvpMatrix_light, projectionMatrix, lightModelViewMatrix);
    drawScene(gl, programInfo, lightBuffers, mvpMatrix_light, lightTexture);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}


function initCubeBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];


  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}



function initPlaneBuffers(gl) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Now set up the texture coordinates for the faces.

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}


//
// Draw the scene.
//
function drawSceneWithShadow(gl, programInfo, buffers, mvpMatrix, mvpFromLightMatrix, normalTexture, shadowMapTexture) {

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the texture coordinates from
  // the texture coordinate buffer into the textureCoord attribute.
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.textureCoord);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.uMvpMatrix,
      false,
      mvpMatrix);
      
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.uMvpFromLight,
      false,
      mvpFromLightMatrix);

  // Specify the texture to map onto the faces.

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, normalTexture);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, shadowMapTexture);

  gl.uniform1i(programInfo.uniformLocations.uNormalTexture, 0);
  gl.uniform1i(programInfo.uniformLocations.uShadowMap, 1);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, mvpMatrix, texture) {

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the texture coordinates from
  // the texture coordinate buffer into the textureCoord attribute.
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.textureCoord);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.uMvpMatrix,
      false,
      mvpMatrix);
      

  // Specify the texture to map onto the faces.

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

}


function drawShadow(gl, programInfo, buffers, mvpMatrix) {

  {
    

    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }


  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.uMvpMatrix,
      false,
      mvpMatrix);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  

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


function initFramebufferObject(gl) {
  var framebuffer, texture, depthBuffer;

  //定义错误函数
  function error() {
      if(framebuffer) gl.deleteFramebuffer(framebuffer);
      if(texture) gl.deleteFramebuffer(texture);
      if(depthBuffer) gl.deleteFramebuffer(depthBuffer);
      return null;
  }

  //创建帧缓冲区对象
  framebuffer = gl.createFramebuffer();
  if(!framebuffer){
      console.log("无法创建帧缓冲区对象");
      return error();
  }

  //创建纹理对象并设置其尺寸和参数
  texture = gl.createTexture();
  if(!texture){
      console.log("无法创建纹理对象");
      return error();
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, offset_width, offset_height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  framebuffer.texture = texture;//将纹理对象存入framebuffer

  //创建渲染缓冲区对象并设置其尺寸和参数
  depthBuffer = gl.createRenderbuffer();
  if(!depthBuffer){
      console.log("无法创建渲染缓冲区对象");
      return error();
  }

  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, offset_width, offset_height);

  //将纹理和渲染缓冲区对象关联到帧缓冲区对象上
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER,depthBuffer);

  //检查帧缓冲区对象是否被正确设置
  var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if(gl.FRAMEBUFFER_COMPLETE !== e){
      console.log("渲染缓冲区设置错误"+e.toString());
      return error();
  }

  //取消当前的focus对象
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  return framebuffer;
}



function createImageFromTexture(gl, texture, width, height) {
  // Create a framebuffer backed by the texture
  var framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  // Read the contents of the framebuffer
  var data = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

  gl.deleteFramebuffer(framebuffer);

  // Create a 2D canvas to store the result 
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');

  // Copy the pixels to a 2D canvas
  var imageData = context.createImageData(width, height);
  imageData.data.set(data);
  context.putImageData(imageData, 0, 0);

  // var img = new Image();
  // img.src = canvas.toDataURL();
  // return img;

  canvas.toBlob(
    blob => {
      const anchor = document.createElement('a');
      anchor.download = 'my-file-name.png'; // optional, but you can give the file a name
      anchor.href = URL.createObjectURL(blob);
      anchor.click(); // ✨ magic!
      URL.revokeObjectURL(anchor.href); // remove it from memory and save on memory! 
    },
    'image/png',
    0.9,
  );
}
