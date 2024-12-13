import React, { useRef } from 'react';

function LeftMenu({ onFileOpen, shapes, onChangeRenderMode, renderMode }) {
    const fileInputRef = useRef();

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    // File upload
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const text = await file.text();
        onFileOpen(file, text);
    };

    // Write to file
    const handleSaveAs = () => {
        const newName = prompt("Enter new filename (without extension):", "my_new_shape_file");
        if (!newName) return;

        const fileText = shapesToFileText(shapes);
        const blob = new Blob([fileText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${newName}.shapefile`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="left-menu">
            <h2>Controls</h2>
            <button onClick={handleFileClick}>Open Shape File</button>
            {/* Hidden. Button + ref used to upload file. */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".shapefile,.txt"
            />
            {/* Select Menu */}
            <div style={{ marginTop: '1rem' }}>
                <label htmlFor="render-mode">Render Mode:</label>
                <select id="render-mode" onChange={e => onChangeRenderMode(e.target.value)} defaultValue="canvas">
                    <option value="canvas">Canvas</option>
                    <option value="webgl">WebGL</option>
                </select>
            </div>
            {/* Translation only in canvas for now. */}
            {renderMode === 'canvas' ? <div>Supports shape translation. Drag and drop shapes to rearrange them.</div> : <div>Does not support shape translation</div>}
            {renderMode === 'canvas' ? <button style={{ marginTop: '1rem' }} onClick={handleSaveAs}>Save</button> : ''}
        </div>
    );
}

// Convert data to text form before putting in file
function shapesToFileText(shapes) {
    return shapes.map(s => {
        if (s.type === 'rectangle') {
            return `Rectangle, ${s.x}, ${s.y}, ${s.z}, ${s.width}, ${s.height}, ${s.color.slice(1)};`;
        } else if (s.type === 'triangle') {
            return `Triangle, ${s.x1}, ${s.y1}, ${s.x2}, ${s.y2}, ${s.x3}, ${s.y3}, ${s.z}, ${s.color.slice(1)};`;
        } else if (s.type === 'polygon') {
            const coords = s.vertices.map(v => `${v.x}, ${v.y}`).join(', ');
            return `Polygon, ${s.z}, ${s.color.slice(1)}, ${coords};`;
        }
        return '';
    }).join('\n');
}

export default LeftMenu;
