import React, { useRef, useEffect, useState } from 'react';

function CanvasViewport({ shapes, onShapesChange }) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current; 
    const ctx = canvas.getContext('2d');

    // Resizing the canvas to match the container
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // Clearing the drawing area
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const shape of shapes) {
      ctx.fillStyle = shape.color;
      if (shape.type === 'rectangle') {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.lineTo(shape.x3, shape.y3);
        ctx.closePath();
        ctx.fill();
      } else if (shape.type === 'polygon') {
        ctx.beginPath();
        ctx.moveTo(shape.vertices[0].x, shape.vertices[0].y);
        for (let i = 1; i < shape.vertices.length; i++) {
          ctx.lineTo(shape.vertices[i].x, shape.vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  }, [shapes]);

  function onMouseDown(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let selectedIndex = -1;
    // Check shapes from topmost (last in array) to bottom
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (isPointInShape(shapes[i], mouseX, mouseY)) {
        selectedIndex = i;
        break;
      }
    }

    if (selectedIndex !== -1) {
      const shape = shapes[selectedIndex];
      let offsetX, offsetY;
      if (shape.type === 'rectangle') {
        offsetX = mouseX - shape.x;
        offsetY = mouseY - shape.y;
      } else if (shape.type === 'triangle') {
        const cx = (shape.x1 + shape.x2 + shape.x3) / 3;
        const cy = (shape.y1 + shape.y2 + shape.y3) / 3;
        offsetX = mouseX - cx;
        offsetY = mouseY - cy;
      } else if (shape.type === 'polygon') {
        let cx = 0, cy = 0;
        for (const v of shape.vertices) {
          cx += v.x;
          cy += v.y;
        }
        cx /= shape.vertices.length;
        cy /= shape.vertices.length;
        offsetX = mouseX - cx;
        offsetY = mouseY - cy;
      }

      setDragging({ shapeIndex: selectedIndex, offsetX, offsetY });
    }
  }

  function onMouseMove(e) {
    if (!dragging) return;
    const { shapeIndex, offsetX, offsetY } = dragging;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newShapes = [...shapes];
    const shape = { ...newShapes[shapeIndex] };

    if (shape.type === 'rectangle') {
      shape.x = mouseX - offsetX;
      shape.y = mouseY - offsetY;
    } else if (shape.type === 'triangle') {
      const cx = (shape.x1 + shape.x2 + shape.x3) / 3;
      const cy = (shape.y1 + shape.y2 + shape.y3) / 3;
      const dx = (mouseX - offsetX) - cx;
      const dy = (mouseY - offsetY) - cy;
      shape.x1 += dx; shape.y1 += dy;
      shape.x2 += dx; shape.y2 += dy;
      shape.x3 += dx; shape.y3 += dy;
    } else if (shape.type === 'polygon') {
      let cx = 0, cy = 0;
      for (const v of shape.vertices) { cx += v.x; cy += v.y; }
      cx /= shape.vertices.length; cy /= shape.vertices.length;
      const dx = (mouseX - offsetX) - cx;
      const dy = (mouseY - offsetY) - cy;
      shape.vertices = shape.vertices.map(v => ({ x: v.x + dx, y: v.y + dy }));
    }

    newShapes[shapeIndex] = shape;
    onShapesChange(newShapes);
  }

  function onMouseUp() {
    setDragging(null);
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ width:'100%', height:'100%' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    />
  );
}

function isPointInShape(shape, x, y) {
  if (shape.type === 'rectangle') {
    return x >= shape.x && y >= shape.y && x <= shape.x + shape.width && y <= shape.y + shape.height;
  } else if (shape.type === 'triangle') {
    return pointInTriangle(x, y, shape.x1, shape.y1, shape.x2, shape.y2, shape.x3, shape.y3);
  } else if (shape.type === 'polygon') {
    return pointInPolygon(x, y, shape.vertices);
  }
  return false;
}

// Using area compression. If area of three triangles(breaking them at px, py) is same then point is in triangle
function pointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
  const areaOrig = Math.abs((x2 - x1)*(y3 - y1) - (x3 - x1)*(y2 - y1));
  const area1 = Math.abs((x1 - px)*(y2 - py) - (x2 - px)*(y1 - py));
  const area2 = Math.abs((x2 - px)*(y3 - py) - (x3 - px)*(y2 - py));
  const area3 = Math.abs((x3 - px)*(y1 - py) - (x1 - px)*(y3 - py));
  return area1 + area2 + area3 === areaOrig;
}

// Using ray casting
function pointInPolygon(px, py, vertices) {
  let inside = false;
  for (let i = 0, j = vertices.length-1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y;
    const xj = vertices[j].x, yj = vertices[j].y;

    const intersect = ((yi > py) !== (yj > py)) && 
                      (px < (xj - xi)*(py - yi)/(yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export default CanvasViewport;
