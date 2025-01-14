import React, { useRef } from 'react';

function TopToolbar({ fileName, onFileOpen }) {
  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

   // File upload
   const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    onFileOpen(file, text);
};

  return (
    <div className="top-toolbar">
      <span className="app-name">Shape Viewer</span>
      {fileName ? (
        <span className="file-name">{fileName}</span>
      ) : (
        <button onClick={handleButtonClick}>Open Shape File</button>
      )}
      {/* Hidden. Button + ref used to upload file. */}
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

export default TopToolbar;
