import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Map as OlMapInstance } from 'ol';
import { OSM } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';
import type OlMap from '@openlayers-elements/core/ol-map';
import GeoTIFF from 'ol/source/GeoTIFF';
import '@openlayers-elements/core/ol-map';
import './cog-url-input';
import { Store } from '../store';

@customElement('gcp-marker')
export class GcpMarker extends LitElement {
  private map!: OlMapInstance;
  @property({ type: Number }) zoom = 4;
  @property({ type: Number }) cogUrl = '';

  static styles = css`
    :host {
      display: block;
      padding: 10px;
    }
    #map-container {
      display: flex;
      height: 85vh;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
    }
  `;

  firstUpdated(): void {
    const mapEl: OlMap = this.renderRoot.querySelector('ol-map#gcp-map')!;
    mapEl.updateComplete.then(() => {
      this.map = mapEl.map!;
      // load osm base layer
      const osm = new TileLayer({ source: new OSM() });
      this.map.addLayer(osm);
    });
  }

  public async loadImage(): Promise<void> {
    const cogUrl = this.cogUrl;
    if (!cogUrl) {
      alert('Please provide a valid COG URL.');
      return;
    }

    try {
      const geoTiffSource = new GeoTIFF({
        sources: [{ url: cogUrl }],
      });

      const imageLayer = new TileLayer({
        source: geoTiffSource,
      });

      this.map.addLayer(imageLayer);
      console.log('COG loaded successfully.');
      this.map.setView(geoTiffSource.getView());
      this.map.getView().animate({ zoom: this.zoom });
    } catch (error) {
      console.error('Error loading COG:', error);
      alert('Failed to load the COG file.');
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(Store.COG_URL_UPDATE, this.handleGcpDataUpdate.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener(Store.COG_URL_UPDATE, this.handleGcpDataUpdate.bind(this));
    super.disconnectedCallback();
  }

  handleGcpDataUpdate(event: Event) {
    const CustomEvent = event as CustomEvent<any>;
    this.cogUrl = CustomEvent?.detail;
  }

  render() {
    return html`
      <div id="map-container">
        <ol-map id="gcp-map"></ol-map>
      </div>
    `;
  }
}
