import React from 'react';
import CanvasViewport from './CanvasViewport';
import WebGLViewport from './WebGLViewport';

function ShapeViewport({ shapes, renderMode, onShapesChange }) {
    return (
        <div className="shape-viewport">
            {/* Rendering based on user's choice */}
            {renderMode === 'canvas' ? (
                <CanvasViewport shapes={shapes} onShapesChange={onShapesChange} />
            ) : (
                <WebGLViewport shapes={shapes} onShapesChange={onShapesChange} />
            )}
        </div>
    );
}

export default ShapeViewport;
