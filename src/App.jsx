import React, { useState } from 'react';
import TopToolbar from './components/TopToolbar.jsx';
import LeftMenu from './components/LeftMenu.jsx';
import ShapeViewport from './components/ShapeViewport.jsx';
import { parseShapesFromText } from './utils/parser.js';

function App() {
  // File name
  const [fileName, setFileName] = useState(null);
  // Shapes
  const [shapes, setShapes] = useState([]);
  // Selected mode. Default is canvas
  const [renderMode, setRenderMode] = useState('canvas');

  const handleFileOpen = async (file, text) => {
    // Parse using parser utility
    const parsedShapes = parseShapesFromText(text);
    setShapes(parsedShapes);
    setFileName(file.name);
  };

  return (
    <div className="app-container">
      <TopToolbar fileName={fileName} onFileOpen={(file, text) => handleFileOpen(file, text)} />
      <div className="content-area">
        <LeftMenu 
          onFileOpen={handleFileOpen} 
          shapes={shapes} 
          onChangeRenderMode={mode => setRenderMode(mode)} 
          renderMode={renderMode} 
        />
        <ShapeViewport 
          shapes={shapes} 
          renderMode={renderMode} 
          onShapesChange={updated => setShapes(updated)} 
        />
      </div>
    </div>
  );
}

export default App;