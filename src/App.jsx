import React, { useState } from 'react';
import TopToolbar from './components/TopToolbar.jsx';
import LeftMenu from './components/LeftMenu.jsx';
import ShapeViewport from './components/ShapeViewport.jsx';

import { parseShapesFromText } from './utils/parser.js';

function App() {
  const [shapes, setShapes] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [renderMode, setRenderMode] = useState('canvas');

  const handleFileOpen = async (file) => {
    const text = await file.text();
    const parsedShapes = parseShapesFromText(text);
    setShapes(parsedShapes);
    setFileName(file.name);
  };

  return (
    <div className="app-container">
      <TopToolbar fileName={fileName} onFileOpen={handleFileOpen} />
      <div className="content-area">
        <LeftMenu onFileOpen={handleFileOpen} 
          onChangeRenderMode={mode => setRenderMode(mode)}
        />
        <ShapeViewport shapes={shapes} renderMode={renderMode} />
      </div>
    </div>
  );
}

export default App;