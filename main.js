// Build and display a legend from a GetLegendGraphic JSON URL
async function buildLegend(containerId, url, title) {
  const container = document.getElementById(containerId);

  // Fetch JSON data from WMS GetLegendGraphic
  const data = await fetch(url).then(r => r.json());

  // Set legend title
  container.innerHTML = `<strong>${title || 'Vector legend'}</strong>`;

  // Loop through each layer and rule
  data.Legend.forEach(layer => {
    layer.rules.forEach(rule => {
      const title = rule.title || 'Untitled';
      const symbolizer = rule.symbolizers?.[0];
      if (!symbolizer) return;

      // Create a container for one legend item
      const item = document.createElement('div');
      item.className = 'legend-item';

      let symbolElement;
      const graphic = symbolizer.Point?.graphics?.[0];

      if (graphic?.["external-graphic-url"]) {
        // If it's an icon (image symbol)
        const img = document.createElement('img');
        img.src = graphic["external-graphic-url"];
        img.alt = title;
        img.className = 'legend-image';
        symbolElement = img;
      } else {
        // If it's a vector symbol (Point, Line, Polygon)
        const canvas = createResponsiveCanvas(ctx => {
          if (symbolizer.Point) drawPoint(ctx, 40, symbolizer.Point);
          else if (symbolizer.Line) drawLine(ctx, 40, symbolizer.Line);
          else if (symbolizer.Polygon) drawPolygon(ctx, 40, symbolizer.Polygon);
        });
        symbolElement = canvas;
      }

      // Add label and symbol to the legend item
      const label = document.createElement('span');
      label.textContent = title;

      item.append(symbolElement, label);
      container.appendChild(item);
    });
  });
}

// Create a responsive canvas element and draw on it
function createResponsiveCanvas(drawFn) {
  const canvas = document.createElement('canvas');
  const size = 40;

  // Set internal resolution
  canvas.width = size;
  canvas.height = size;

  // Responsive display
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  canvas.style.aspectRatio = '1 / 1';

  const ctx = canvas.getContext('2d');
  drawFn(ctx, size);
  return canvas;
}

// Draw a point symbol
function drawPoint(ctx, size, p) {
  const radius = (p.size || 10) / 2;
  const center = size / 2;

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.fillStyle = p.fill || '#000';
  ctx.globalAlpha = parseFloat(p['fill-opacity'] || 1);
  ctx.fill();

  if (p.stroke) {
    ctx.strokeStyle = p.stroke;
    ctx.lineWidth = parseFloat(p['stroke-width'] || 1);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

// Draw a line symbol
function drawLine(ctx, size, l) {
  ctx.beginPath();
  ctx.moveTo(5, size / 2);
  ctx.lineTo(size - 5, size / 2);
  ctx.strokeStyle = l.stroke || '#000';
  ctx.lineWidth = parseFloat(l['stroke-width'] || 2);
  ctx.stroke();
}

// Draw a polygon symbol
function drawPolygon(ctx, size, poly) {
  const padding = 5;
  const boxSize = size - 2 * padding;

  ctx.fillStyle = poly.fill || '#000';
  ctx.globalAlpha = parseFloat(poly['fill-opacity'] || 1);
  ctx.fillRect(padding, padding, boxSize, boxSize);
  ctx.globalAlpha = 1;

  if (poly.stroke) {
    ctx.strokeStyle = poly.stroke;
    ctx.lineWidth = parseFloat(poly['stroke-width'] || 1);
    ctx.strokeRect(padding, padding, boxSize, boxSize);
  }
}

// Legend JSON URLs to process
const urls = [
  "https://ows.region-bretagne.fr/geoserver/rb/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&SLD_VERSION=1.1.0&FORMAT=application/json&WIDTH=30&HEIGHT=20&LEGEND_OPTIONS=fontName%3AOpen%20Sans%3BfontAntiAliasing%3Atrue%3BfontColor%3A0x777777%3BfontSize%3A10%3Bdpi%3A96&TRANSPARENT=true&LAYER=rp_struct_pop_geom&STYLE=rphab_densite%40commune",
  "https://ows.region-bretagne.fr/geoserver/rb/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&SLD_VERSION=1.1.0&FORMAT=application/json&WIDTH=30&HEIGHT=20&LEGEND_OPTIONS=fontName%3AOpen%20Sans%3BfontAntiAliasing%3Atrue%3BfontColor%3A0x777777%3BfontSize%3A10%3Bdpi%3A96&TRANSPARENT=true&LAYER=lycee&STYLE=&SLD=https%3A%2F%2Fkartenn.region-bretagne.fr%2Fstyles%2Flycee_secteur.sld"
];

// Loop through each URL and build corresponding legend
for (const url of urls) {
  const layerName = url.split('LAYER=')[1].split('&')[0];

  // Create a container div for this legend
  const containerId = `legend-container-${layerName}`;
  const container = document.createElement('div');
  container.id = containerId;
  container.className = 'legend-container';

  // Append to the main parent container in HTML
  const parentContainer = document.getElementById('parent-container');
  parentContainer.appendChild(container);

  // Build the legend in the new container
  buildLegend(containerId, url, `Legend - ${layerName}`);
}
