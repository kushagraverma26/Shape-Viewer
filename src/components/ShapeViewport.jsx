import React from 'react';
import CanvasViewport from './CanvasViewport';
import WebGLViewport from './WebGLViewport';

function ShapeViewport({ shapes, renderMode }) {
  return (
    <div className="shape-viewport">
      {renderMode === 'canvas' ? (
        <CanvasViewport shapes={shapes} />
      ) : (
        <WebGLViewport shapes={shapes} />
      )}
    </div>
  );
}

export default ShapeViewport;
