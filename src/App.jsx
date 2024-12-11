import React, { useState } from 'react';
import TopToolbar from './components/TopToolbar.jsx';
import LeftMenu from './components/LeftMenu.jsx';
import ShapeViewport from './components/ShapeViewport.jsx';

function App() {
  const [fileName, setFileName] = useState(null);

  const handleFileOpen = (file) => {
    setFileName(file.name);
  };

  return (
    <div className="app-container">
      <TopToolbar fileName={fileName} onFileOpen={handleFileOpen} />
      <div className="content-area">
        <LeftMenu onFileOpen={handleFileOpen} />
        <ShapeViewport />
      </div>
    </div>
  );
}

export default App;
