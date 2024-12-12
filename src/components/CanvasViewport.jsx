import React, { useRef, useEffect } from 'react';

function CanvasViewport({ shapes }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

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

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}

export default CanvasViewport;
