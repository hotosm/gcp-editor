import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { parseCSVFile } from '../../utils/csvparser';
import { Store } from '../../store';
import './csv-preview';

@customElement('csv-upload')
export class CsvUpload extends LitElement {
  @property({ type: Object }) gcpFile: File | null = null;
  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  private handleFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.gcpFile = file;
      parseCSVFile(file)
        .then((data) => {
          Store.setGcpData(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  render() {
    return html`
      <div class="tw-max-w-full">
        <label
          class=" tw-border-gray-400 tw-border-dashed tw-border-2 tw-rounded-lg tw-h-20 tw-w-full tw-flex tw-items-center tw-justify-center tw-relative"
        >
          <input
            type="file"
            name="gcp-file"
            class="tw-h-24 tw-opacity-0 tw-absolute"
            @change=${this.handleFileInputChange}
            accept=".csv"
          />
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center">
            <span class="material-symbols-outlined tw-text-primary">cloud_upload</span>
            <span class="tw-text tw-font-light">
              ${this.gcpFile ? this?.gcpFile?.name : 'The Supported file format is .csv'}
            </span>
          </div>
        </label>
      </div>
      <div>
        <csv-preview></csv-preview>
      </div>
    `;
  }
}
