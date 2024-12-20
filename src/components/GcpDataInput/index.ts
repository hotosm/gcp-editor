import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './csv-upload';
import { Store } from '../../store';

@customElement('gcp-data-input')
export class GcpDataInput extends LitElement {
  @property({ type: String }) projection: string = Store.getProjection();

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  handleInputChange = (event: any) => {
    Store.setCogUrl(event.target.value || '');
  };

  handleProjectionInputChange = (event: any) => {
    this.projection = event.target.value || 'EPSG:4326';
    Store.setProjection(this.projection);
  };

  render() {
    return html`
      <div class="tw-grid tw-grid-cols-2 tw-gap-10">
        <div class="tw-flex tw-flex-col tw-gap-5">
          <hot-input
            placeholder="ESPG:4326"
            @input=${(e: Event) => this.handleProjectionInputChange(e)}
            value=${this.projection}
          ></hot-input>
          <hot-input placeholder="Input a COG URL" @input=${(e: Event) => this.handleInputChange(e)}></hot-input>
          <csv-upload></csv-upload>
        </div>
        <div class="tw-bg-gray-300 tw-w-full tw-h-full tw-p-5 tw-min-h-80">Information about csv format</div>
      </div>
    `;
  }
}
