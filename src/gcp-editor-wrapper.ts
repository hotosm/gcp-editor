import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './components/csv-upload';
import './components/csv-preview';
import './components/gcp-marker';
import './components/projection-input';
import './components/load-btn';
import { GcpMarker } from './components/gcp-marker';

@customElement('gcp-editor')
export class GcpEditor extends LitElement {
  // Property to hold the gcp
  @property({ type: Object }) gcpFile: File | null = null;

  static styles = css`
    :host {
      display: block;
    }
    .wrapper {
      height: 100vh;
      width: 100vw;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
    .input-section {
      width: 100%;
      height: 100%;
      /* background: #73ee87; */
      overflow: auto;
    }
    .map-section {
      width: 100%;
      height: 100%;
      /* background: #73c7ee; */
    }
    .main-input-wrapper {
      display: grid;
      width: 100%;
      grid-template-columns: 1fr 250px;
      gap: 12px;
    }
  `;

  // Handle the custom event and call the function from gcp marker
  private handleTriggerFunction() {
    const gcpMarker = this.shadowRoot?.querySelector('gcp-marker') as GcpMarker;
    if (gcpMarker) {
      gcpMarker.loadImage();
    }
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="input-section">
          <div class="main-input-wrapper">
            <div>
              <cog-url-input></cog-url-input>
            </div>
            <div>
              <projection-input></projection-input>
              <load-btn @load-COG="${this.handleTriggerFunction}"></load-btn>
            </div>

            <csv-upload></csv-upload>
          </div>
          <csv-preview></csv-preview>
        </div>
        <div class="map-section">
          <gcp-marker></gcp-marker>
        </div>
      </div>
    `;
  }
}
