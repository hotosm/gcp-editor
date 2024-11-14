import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import maplibre, { Map, StyleSpecification } from 'maplibre-gl';
import maplibreglStyle from "maplibre-gl/dist/maplibre-gl.css";

/**
 * A map component built in MapLibre to edit Ground Control Points.
 *
 */
@customElement('gcp-editor')
export class GcpEditor extends LitElement {
  @property({ type: String }) container = 'map';
  @property({ type: Number }) latitude = 45;
  @property({ type: Number }) longitude = 45;
  @property({ type: Number }) zoom = 0;
  @property({ type: Boolean }) interactive = true;
  @property({ type: Object }) mapStyle: StyleSpecification = {
    id: 'OSM Raster',
    version: 8,
    name: 'OpenStreetMap',
    sources: {
      osm: {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ],
        minzoom: 0,
        maxzoom: 19,
        attribution: '© <a target="_blank" rel="noopener" href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm',
        layout: {
          visibility: 'visible',
        },
      },
    ],
  };

  private map: Map | null = null;

  static styles = css`
    ${maplibreglStyle}
    :host, .map {
      width: 100%;
      height: 100%;
    }
  `;

  firstUpdated() {
    this.initMap();
  }

  private initMap() {
    const mapConfig = {
      container: this.container,
      center: [this.longitude, this.latitude],
      zoom: this.zoom,
      style: this.mapStyle,
      interactive: this.interactive,
    };

    this.map = new maplibre.Map(mapConfig);
  }

  render() {
    return html`<div id="${this.container}" style="width: 100%; height: 100%;"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gcp-editor': GcpEditor,
  }
}
