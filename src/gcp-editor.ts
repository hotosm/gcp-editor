import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@openlayers-elements/core/ol-map'
import '@openlayers-elements/maps/ol-layer-openstreetmap'

/**
 * A map component built in OpenLayers to edit Ground Control Points.
 *
 */
@customElement('gcp-editor')
export class GcpEditor extends LitElement {
  @property({ type: Number }) lat = 45;
  @property({ type: Number }) lon = 45;
  @property({ type: Number }) zoom = 0;

  static styles = css``;

  render() {
    return html`
      <div style="display: flex; height: 95vh; width: 95vw;">
        <ol-map
          zoom="${this.zoom}"
          lat="${this.lat}"
          lon="${this.lon}"
        >
          <ol-layer-openstreetmap></ol-layer-openstreetmap>
        </ol-map>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gcp-editor': GcpEditor,
  }
}
