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
      padding: 28px 12px;
    }
    #input-wrapper {
      display: flex;
      gap: 10px;
    }
    #gcp-file-input {
      opacity: 0;
      height: 38px;
    }
    #gcp-file-input-label {
      border: solid 1px black;
      border-radius: 8px;
      display: block;
      position: relative;

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
      <div id="file-input-wrapper">
        <label for="gcp-file-input" id="gcp-file-input-label">
          <span style="padding:10px 4px; position: absolute;">
            ${this.gcpFile ? this?.gcpFile?.name : 'Choose .csv file with geo coordinates'}
          </span>
          <input type="file" name="gcp-file" id="gcp-file-input" @change=${this.handleFileInputChange} accept=".csv" />
        </label>
      </div>
    `;
  }
}
