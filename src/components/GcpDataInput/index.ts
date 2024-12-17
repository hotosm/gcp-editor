import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import './csv-upload';
import { Store } from '../../store';

@customElement('gcp-data-input')
export class GcpDataInput extends LitElement {
  // 'https://dev-dronetm.s3.ap-south-1.amazonaws.com/dtm-data/projects/1a7b9417-aa42-43d0-b3a8-8d7a971ddc8e/cde82416-46e3-4fbb-b92d-e4c56430f499/orthophoto/odm_orthophoto.tif';

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  handleInputChange = (event: any) => {
    Store.setCogUrl(event.target.value || '');
  };

  render() {
    return html`
      <div class="tw-grid tw-grid-cols-2 tw-gap-10">
        <div class="tw-flex tw-flex-col tw-gap-5">
          <hot-input placeholder="Input a COG URL" @input=${(e: Event) => this.handleInputChange(e)}></hot-input>
          <csv-upload></csv-upload>
        </div>
        <div class="tw-bg-gray-300 tw-w-full tw-h-full tw-p-5 tw-min-h-80">Information about csv format</div>
      </div>
    `;
  }
}
