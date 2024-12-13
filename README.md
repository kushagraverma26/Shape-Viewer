# Shape Viewer

**Shape Viewer** is a browser-based single-page application (SPA) that allows users to open and visualize 2D shape data from a custom text-based shape file format. The application’s UI and layout are built using React. The rendering can be performed using either the HTML5 Canvas API or WebGL. The code also supports shape transformations.

## Features

- **File Upload & Parsing**:  
  Users can select a `.shapefile` file (a text-based file). The application parses the file to extract shape data, including rectangles, triangles, and polygons.
  
- **Choice of Rendering**:  
  The application supports two rendering modes:
  1. **Canvas**: Uses the Canvas 2D API for straightforward shape rendering.
  2. **WebGL**: Uses WebGL for potentially higher performance and scalability.
  
  The user can switch between the rendering method.

- **Shape Types**:  
  - **Rectangle**: `(x, y, z, width, height, color)`
  - **Triangle**: `(x1, y1, x2, y2, x3, y3, z, color)`
  - **Polygon**: `(z, color, [x1, y1, x2, y2, ..., xN, yN])`
  
  Color is defined by a 6-digit hex code (e.g., `ff0000` for red). The z-index determines drawing order.

- **Z-Index Support**:  
  Shapes are drawn in order of their `z` index. Lower `z` values appear behind higher `z` values.

## File Format

Shapes are stored line-by-line, with fields separated by commas, and each line ending with a semicolon. Use `//` for comments.

**Example (`my-shape-file.shapefile`):**

// Red rectangle at (0,0), z=0, 50x50  
Rectangle, 0, 0, 0, 50, 50, ff0000;

// Green rectangle at (70,70), z=1, 100x200  
Rectangle, 70, 70, 1, 100, 200, 00ff00;

// Blue triangle with vertices (10,10), (60,10), (35,50), z=2  
Triangle, 10, 10, 60, 10, 35, 50, 2, 0000ff;

// Polygon with four vertices, z=3, purple  
Polygon, 3, ff00ff, 50,50, 100,50, 120,100, 60,110;


## Installation & Running

1. **Install dependencies**:
   ```bash
   npm install
2. **Run the development server**:
   ```bash
   npm run dev
3. **Open the application in your browser at http://localhost:5173 (default Vite port)**.

## Usage

**Open a Shape File:**  
Click "Open Shape File" in the top toolbar or left menu and choose a `.shapefile`.

**View Shapes:**  
Once the file is loaded, shapes appear in the viewport according to their parameters.

**Switching Render Modes:**  
Use the left menu to switch between "Canvas" and "WebGL" rendering modes. Canvas supports shape translation. Drag and drop shapes to rearrange them. You can also save the translated shapes into a shapefile of your own.