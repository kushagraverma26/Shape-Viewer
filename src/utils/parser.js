export function parseShapesFromText(contents) {
    const lines = contents.trim().split('\n');
    const shapes = [];

    for (let line of lines) {
        // Cleanup, comments igore
        line = line.trim();
        if (!line || line.startsWith('//')) continue;
        line = line.replace(/;$/, '');

        const parts = line.split(',').map(p => p.trim());
        const shapeType = parts[0].toLowerCase();

        switch (shapeType) {
            case 'rectangle': {
                // Rectangle, x, y, z, width, height, colorHex
                const [_, x, y, z, w, h, c] = parts;
                shapes.push({
                    type: 'rectangle',
                    x: parseFloat(x),
                    y: parseFloat(y),
                    z: parseInt(z, 10),
                    width: parseFloat(w),
                    height: parseFloat(h),
                    color: '#' + c
                });
                break;
            }
            case 'triangle': {
                // Triangle, x1, y1, x2, y2, x3, y3, z, colorHex
                const [_, x1, y1, x2, y2, x3, y3, z, c] = parts;
                shapes.push({
                    type: 'triangle',
                    x1: parseFloat(x1),
                    y1: parseFloat(y1),
                    x2: parseFloat(x2),
                    y2: parseFloat(y2),
                    x3: parseFloat(x3),
                    y3: parseFloat(y3),
                    z: parseInt(z, 10),
                    color: '#' + c
                });
                break;
            }
            case 'polygon': {
                const [_, z, c, ...coords] = parts;
                const zIndex = parseInt(z, 10);
                const color = '#' + c;

                if (coords.length < 6) {
                    console.warn(`Polygon must have at least three vertices. Line: ${line}`);
                    continue;
                }

                const vertices = [];
                for (let i = 0; i < coords.length; i += 2) {
                    const vx = parseFloat(coords[i]);
                    const vy = parseFloat(coords[i + 1]);
                    vertices.push({ x: vx, y: vy });
                }

                shapes.push({
                    type: 'polygon',
                    z: zIndex,
                    color,
                    vertices
                });
                break;
            }
            default:
                console.warn(`Unknown shape type: ${shapeType}`);
        }
    }

    shapes.sort((a, b) => a.z - b.z);

    return shapes;
}
