import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { parseCSVFile } from '../utils/csvparser';
import { Store } from '../store';

@customElement('csv-upload')
export class CsvUpload extends LitElement {
  @property({ type: Object }) gcpFile: File | null = null;

  static styles = css`
    :host {
      width:100%
      display: block;
    }
  `;

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
      <div class="max-w-full">
        <label
          class=" border-gray-400 border-dashed border-2 rounded-lg h-20 w-full flex items-center justify-center relative"
        >
          <input
            type="file"
            name="gcp-file"
            class="h-24 opacity-0 absolute"
            @change=${this.handleFileInputChange}
            accept=".csv"
          />
          <div class="flex flex-col items-center justify-center">
            <span class="material-symbols-outlined text-primary">cloud_upload</span>
            <span class="text font-light">
              ${this.gcpFile ? this?.gcpFile?.name : 'The Supported file format is .csv'}
            </span>
          </div>
        </label>
      </div>
      <div>
        <csv-preview></csv-preview>
      </div>
      ${this?.gcpFile?.name &&
      html`
        <div class="py-5 flex justify-end">
          <hot-button>upload</hot-button>
        </div>
      `}
    `;
  }
}
