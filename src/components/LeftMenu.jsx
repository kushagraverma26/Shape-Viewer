import React, { useRef } from 'react';

function LeftMenu({ onFileOpen, onChangeRenderMode }) {
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

            <select onChange={e => onChangeRenderMode(e.target.value)}>
                <option value="canvas">Canvas</option>
                <option value="webgl">WebGL</option>
            </select>

        </div>
    );
}

export default LeftMenu;
