import OlMap from '@openlayers-elements/core/ol-map';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Map as OlMapInstance } from 'ol';
import TileLayer from 'ol/layer/WebGLTile.js';
import { OSM } from 'ol/source';
import '@openlayers-elements/core/ol-map';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { GeoJSON } from 'ol/format';
import { Style, Icon } from 'ol/style';
import GeoTIFF from 'ol/source/GeoTIFF';
import MarkerIcon from '../../assets/markerIcon.png';
import { Store } from '../../store';

@customElement('map-section')
export class MapSection extends LitElement {
  @property({ type: Object }) gcpPointGeojson: String[][] = Store.getGcpGeojson();
  @property({ type: Object }) cogUrl: string = Store.getCogUrl();

  private map!: OlMapInstance;

  static styles = css`
    :host {
      display: block;
      padding: 10px;
    }
    #map-container {
      display: flex;
      height: 80vh;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }
  `;

  firstUpdated(): void {
    const mapEl: OlMap = this.renderRoot.querySelector('ol-map#gcp-map')!;
    this.gcpPointGeojson = Store.getGcpGeojson();

    mapEl?.updateComplete?.then(() => {
      this.map = mapEl.map!;
      // load osm base layer
      const osm = new TileLayer({ source: new OSM() });
      this.map.addLayer(osm);
      this.loadGcpPoints(this.gcpPointGeojson);

      if (this.cogUrl) {
        this.loadImage(this.cogUrl);
      }
    });
  }

  private async loadImage(cogUrl: string): Promise<void> {
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
      this.map.getView().animate({ zoom: 0 });
    } catch (error) {
      console.error('Error loading COG:', error);
      alert('Failed to load the COG file.');
    }
  }

  loadGcpPoints(geojson: any) {
    // Add vector layer for the GCP point
    const gcpPointSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:3857', // Projection for OpenLayers map
      }),
    });

    const gcpPointLayer = new VectorLayer({
      source: gcpPointSource,
      style: new Style({
        image: new Icon({
          src: MarkerIcon,
          scale: 0.5,
        }),
      }),
    });

    this.map.addLayer(gcpPointLayer);
    gcpPointLayer.setZIndex(99);
    console.log('Points loaded successfully.');
    this.map
      .getView()
      .fit(gcpPointSource.getExtent(), { size: this.map.getSize(), padding: [100, 100, 100, 100], duration: 1000 });
  }

  protected render() {
    return html`
      <div id="map-container">
        <ol-map id="gcp-map"></ol-map>
      </div>
    `;
  }
}
