import React, { useRef, useEffect } from 'react';

function WebGLViewport({ shapes }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;


  }, [shapes]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}

export default WebGLViewport;
