import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { parseCSVFile } from '../../utils/csvparser';
import { Store } from '../../store';
import './csv-preview';

@customElement('csv-upload')
export class CsvUpload extends LitElement {
  @property({ type: Object }) gcpFile: File | null = null;
  @state() errorMessage: string = '';
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
          console.log(data, 'data');
          if (data.length < 2) {
            this.errorMessage = 'Csv has no data row';
            return;
          }
          if (data[0].length > 4) {
            this.errorMessage = `Csv ${data[0]?.length} columns expected 4 columns`;
            return;
          }
          Store.setGcpData(data);
          this.errorMessage = '';
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
              ${this.gcpFile ? this?.gcpFile?.name : 'Please upload a .csv file'}
            </span>
          </div>
        </label>
      </div>
      <div>
        ${this.errorMessage
          ? html`
              <div class="tw-py-3 tw-text-primary">${this.errorMessage}</div>
            `
          : html`
              <csv-preview></csv-preview>
            `}
      </div>
    `;
  }
}
