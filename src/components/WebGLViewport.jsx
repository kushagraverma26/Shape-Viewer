import React, { useRef, useEffect } from 'react';
import earcut from 'earcut';

function WebGLViewport({ shapes }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Get web gl context
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Clearing the canvas
    gl.clearColor(1, 1, 1, 1);
    // Color the screen
    gl.clear(gl.COLOR_BUFFER_BIT);

    const program = initWebGLProgram(gl);
    gl.useProgram(program);

    // Get triangulated data for all the shapes
    const vertices = createVertexData(shapes);

    // Creating buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Getting location of the attributes
    const a_position = gl.getAttribLocation(program, 'a_position');
    const a_color = gl.getAttribLocation(program, 'a_color');

    const stride = 5 * Float32Array.BYTES_PER_ELEMENT;

    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(
      a_position,
      2, // 2 elements per vertex
      gl.FLOAT,
      false, // Not normalized
      stride, // X, y and 3 for color so 5 * float size
      0 // no offset
    );

    gl.enableVertexAttribArray(a_color);
    gl.vertexAttribPointer(
      a_color,
      3, // 3 elements in color
      gl.FLOAT,
      false,
      stride, // X, y and 3 for color so 5 * float size
      2 * Float32Array.BYTES_PER_ELEMENT //offset
    );

    const u_matrix = gl.getUniformLocation(program, "u_matrix");
    const matrix = orthographicMatrix(canvas.width, canvas.height);
    gl.uniformMatrix3fv(u_matrix, false, matrix);

    const vertexCount = vertices.length / 5;
    // Drawing the shapes
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    return () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [shapes]);

  return <canvas ref={canvasRef} style={{width:'100%',height:'100%'}} />;
}

export default WebGLViewport;

function initWebGLProgram(gl) {
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    uniform mat3 u_matrix;
    varying vec3 v_color;
    void main() {
      vec3 pos = u_matrix * vec3(a_position, 1.0);
      gl_Position = vec4(pos.xy, 0, 1);
      v_color = a_color;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;
    void main() {
      gl_FragColor = vec4(v_color, 1.0);
    }
  `;

  // Create and compile shaders
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Creating the program using the shaders
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  // Checking error in linking program
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program failed to link:', gl.getProgramInfoLog(program));
  }

  return program;
}

// Creates shader and compiles
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  // Using compile status to check for errors
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
  }
  return shader;
}

function orthographicMatrix(width, height) {
  return new Float32Array([
    2/width, 0,       -1,
    0,       -2/height, 1,
    0,        0,        1
  ]);
}

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  return [r,g,b];
}

// Breaking into Triangles
function rectToTriangles(shape) {
  const { x, y, width, height } = shape;
  return [
    [ {x:x,y:y}, {x:x+width,y:y}, {x:x,y:y+height} ],
    [ {x:x+width,y:y}, {x:x+width,y:y+height}, {x:x,y:y+height} ]
  ];
}

// Separating points in Triangle vertices 
function triangleToTriangles(shape) {
  return [
    [ {x:shape.x1,y:shape.y1}, {x:shape.x2,y:shape.y2}, {x:shape.x3,y:shape.y3} ]
  ];
}

// Using earcut to convert polygon to triangle
function polygonToTriangles(shape) {
  const coords = [];
  for (const v of shape.vertices) {
    coords.push(v.x, v.y);
  }
  const indices = earcut(coords);
  const triangles = [];
  for (let i = 0; i < indices.length; i+=3) {
    const v1 = shape.vertices[indices[i]];
    const v2 = shape.vertices[indices[i+1]];
    const v3 = shape.vertices[indices[i+2]];
    triangles.push([v1,v2,v3]);
  }
  return triangles;
}

function createVertexData(shapes) {
  const vertexData = [];

  for (const shape of shapes) {
    const color = hexToRGB(shape.color);
    let shapeTriangles = [];

    if (shape.type === 'rectangle') {
      shapeTriangles = rectToTriangles(shape);
    } else if (shape.type === 'triangle') {
      shapeTriangles = triangleToTriangles(shape);
    } else if (shape.type === 'polygon') {
      shapeTriangles = polygonToTriangles(shape);
    }

    for (const tri of shapeTriangles) {
      for (const vert of tri) {
        vertexData.push(vert.x, vert.y, color[0], color[1], color[2]);
      }
    }
  }

  return new Float32Array(vertexData);
}
