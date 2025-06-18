# GeoServer Legend to Canvas

This project use WMS GetLegendGraphic in application/json format :
https://docs.geoserver.org/latest/en/user/services/wms/get_legend_graphic/index.html


This project dynamically generates **responsive vector map legends** in HTML using **WMS GetLegendGraphic JSON** responses from GeoServer (with `FORMAT=application/json`).

> **Warning Legend as JSON only works with GeoServer version > = 2.21.**


## 🧩 What it does

- Fetches legend data from one or more WMS layers using GetLegendGraphic.
- Parses vector or image-based symbolizers (Point, Line, Polygon, ExternalGraphic).
- Renders a clean, responsive HTML legend using `<canvas>` or `<img>`.
- Displays each rule with its symbol and title in a flexible layout.

## 🧪 Features

- ✅ Supports vector styles: fill color, stroke, size, opacity
- ✅ Supports icons (external graphics) for point symbols
- ✅ Responsive layout using CSS Flexbox
- ✅ Easy to add multiple layers via URL list

## 📦 Structure

- `index.html` – Base HTML structure with a placeholder div (`#parent-container`)
- `main.js` – Core logic to fetch and render legends
- `style.css` – Responsive and clean styles for canvas and image symbols

## 🚀 How to use

1. Clone sources locally
2. Install NodeJs > = 20 (if not already installed)
3. Install dependancies (`npm install`)
4. Start (`npm run dev`)

## 🔗 Example WMS Sources

**Legend as JSON only works with GeoServer version > = 2.21.**

- [GeoServer - Région Bretagne](https://ows.region-bretagne.fr/geoserver/)

## 📌 Requirements

* NodeJs
* This code use a pure HTML/JS/CSS


