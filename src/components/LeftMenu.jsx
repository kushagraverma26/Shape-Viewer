import React, { useRef } from 'react';

function LeftMenu({ onFileOpen }) {
  const fileInputRef = useRef();

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileOpen(file);
    }
  };

  return (
    <div className="left-menu">
      <h2>Controls</h2>
      <button onClick={handleFileClick}>Open Shape File</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".shapefile"
      />
    </div>
  );
}

export default LeftMenu;
