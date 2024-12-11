import React, { useRef } from 'react';

function TopToolbar({ fileName, onFileOpen }) {
  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileOpen(file);
    }
  };

  return (
    <div className="top-toolbar">
      <span className="app-name">Shape Viewer</span>
      {fileName ? (
        <span className="file-name">{fileName}</span>
      ) : (
        <button onClick={handleButtonClick}>Open Shape File</button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".txt,.shape"
      />
    </div>
  );
}

export default TopToolbar;
