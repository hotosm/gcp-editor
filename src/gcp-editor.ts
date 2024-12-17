// import '@openlayers-elements/core/ol-map';
// import type OlMap from '@openlayers-elements/core/ol-map';
// import { Map as OlMapInstance } from 'ol';
// import GeoTIFF from 'ol/source/GeoTIFF';
// import TileLayer from 'ol/layer/WebGLTile.js';
// import { fromLonLat, toLonLat } from 'ol/proj';
// import { Feature } from 'ol';
// import { Point } from 'ol/geom';
// import { Style, Icon, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
// import VectorSource from 'ol/source/Vector';
// import VectorLayer from 'ol/layer/Vector';
// import { LitElement, html, css } from 'lit';
// import { customElement, property, state } from 'lit/decorators.js';

// @customElement('gcp-editor')
// export class GcpEditor extends LitElement {
//   // The level to zoom to when loading the COG
//   @property({ type: Number }) zoom = 4;

//   @state() private hoverCoords: { lat: number; lon: number } | null = null;
//   @state() private userGcpPoint: Feature<Point> | null = null;
//   private map!: OlMapInstance;

//   static styles = css`
//     :host {
//       display: block;
//     }
//     #map-container {
//       display: flex;
//       height: 70vh;
//       width: 95vw;
//     }
//     button {
//       margin: 8px 0;
//     }
//     .coordinates-box {
//       position: absolute;
//       top: 8px;
//       right: 8px;
//       background: rgba(255, 255, 255, 0.8);
//       padding: 4px 8px;
//       border-radius: 4px;
//       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//       font-size: 0.875rem;
//       z-index: 1000;
//       pointer-events: none;
//     }
//   `;

//   firstUpdated(): void {
//     const mapEl: OlMap = this.renderRoot.querySelector('ol-map#gcp-map')!;
//     mapEl.updateComplete.then(() => {
//       this.map = mapEl.map!;

//       // Add pointermove event listener
//       this.map.on('pointermove', (event) => this.handlePointerMove(event));

//       // Add map click event listener
//       this.map.on('singleclick', (event) => this.handleMapClick(event));
//     });
//   }

//   private handleMapClick(event: any): void {
//     const coordinate = event.coordinate;

//     if (this.userGcpPoint) {
//       this.userGcpPoint.getGeometry()?.setCoordinates(coordinate);
//     } else {
//       this.userGcpPoint = new Feature({
//         geometry: new Point(coordinate),
//       });

//     // Add vector layer for the blue user correct GCP point
//       const blueDotLayer = new VectorLayer({
//         source: new VectorSource({
//           features: [this.userGcpPoint],
//         }),
//         style: new Style({
//           image: new CircleStyle({
//             radius: 6,
//             fill: new Fill({ color: 'blue' }),
//             stroke: new Stroke({ color: 'white', width: 2 }),
//           }),
//         }),
//       });

//       this.map.addLayer(blueDotLayer);
//     }
//   }

//   private handlePointerMove(event: any): void {
//     const coordinate = event.coordinate;
//     const [lon, lat] = toLonLat(coordinate);
//     this.hoverCoords = { lat: parseFloat(lat.toFixed(6)), lon: parseFloat(lon.toFixed(6)) };
//   }

//   private async loadImage(): Promise<void> {
//     const cogUrl = (this.renderRoot.querySelector('#cog-url') as HTMLInputElement)?.value.trim();
//     if (!cogUrl) {
//       alert('Please provide a valid COG URL.');
//       return;
//     }

//     try {
//       const geoTiffSource = new GeoTIFF({
//         sources: [{ url: cogUrl }],
//       });

//       const imageLayer = new TileLayer({
//         source: geoTiffSource,
//       });

//       this.map.addLayer(imageLayer);
//       console.log('COG loaded successfully.');
//       this.map.setView(geoTiffSource.getView());
//       this.map.getView().animate({ zoom: this.zoom });
//     } catch (error) {
//       console.error('Error loading COG:', error);
//       alert('Failed to load the COG file.');
//     }
//   }

//   private loadGcpCoord(): void {
//     const latInput = (this.renderRoot.querySelector('#lat') as HTMLInputElement)?.value.trim();
//     const lonInput = (this.renderRoot.querySelector('#lon') as HTMLInputElement)?.value.trim();

//     if (!latInput || !lonInput) {
//       alert('Please provide valid latitude and longitude.');
//       return;
//     }

//     const lat = parseFloat(latInput);
//     const lon = parseFloat(lonInput);

//     if (isNaN(lat) || isNaN(lon)) {
//       alert('Invalid coordinate values.');
//       return;
//     }

//     const coordinate = fromLonLat([lon, lat]);

//     // Add vector layer for the red GCP point
//     const gcpPointLayer = new VectorLayer({
//       source: new VectorSource({
//         features: [
//           new Feature({
//             geometry: new Point(coordinate),
//           })
//         ]
//       }),
//       style: new Style({
//         image: new CircleStyle({
//           radius: 5,
//           fill: new Fill({ color: 'red' }),
//           stroke: new Stroke({ color: 'white', width: 2 }),
//         }),
//       }),
//     });

//     this.map.addLayer(gcpPointLayer);

//     console.log('Coordinate loaded successfully.');
//   }

//   render() {
//     return html`
//       <div>
//         <label for="cog-url">COG URL:</label>
//         <input
//           id="cog-url"
//           type="text"
//           placeholder="Enter S3 COG URL"
//           value="https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif"
//         />
//         <button @click="${this.loadImage}">Load Image</button>
//       </div>
//       <div>
//         <label for="lat">Latitude:</label>
//         <input id="lat" type="text" placeholder="Enter Latitude" value="16.351169" />
//         <label for="lon">Longitude:</label>
//         <input id="lon" type="text" placeholder="Enter Longitude" value="4.917483" />
//         <button @click="${this.loadGcpCoord}">Load Coordinate</button>
//       </div>
//       <div id="map-container">
//         <ol-map id="gcp-map">
//         </ol-map>
//         ${this.hoverCoords
//           ? html`
//               <div class="coordinates-box">
//                 Lat: ${this.hoverCoords.lat}, Lon: ${this.hoverCoords.lon}
//               </div>
//             `
//           : ''}
//       </div>
//     `;
//   }
// }

// declare global {
//   interface HTMLElementTagNameMap {
//     'gcp-editor': GcpEditor;
//   }
// }
