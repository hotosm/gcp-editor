import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from '../../store';

// Define the type for a row in the gcp.txt file
// [X Y Z ImageX ImageY FileName.jpg]
// e.g. 544256.7 5320919.9 5 3044 2622 IMG_0525.jpg
// https://docs.opendronemap.org/gcp/
type GcpRow = [number, number, number, number, number, string, string];
// Plus we define the headers row separately
type GcpHeaders = [string, string, string, string, string, string, string];
// Then combined GcpFile
type GcpFile = Array<GcpHeaders | GcpRow>;

/**
 * GcpResult Component
 *
 * This component renders a list of Ground Control Points (GCP) as a table
 * and provides functionality to download the data in a custom text format.
 */
@customElement('gcp-result')
export class GcpResult extends LitElement {
  /**
   * Property: gcpList
   * Holds the raw GCP data fetched from the store.
   */
  @property() gcpList = Store.getGcpDataWithXY();
  @property() buttonText = '';
  @property({ type: Function }) finalButtonClickFunction = null;

  /**
   * Property: gcpInCsv
   * A processed version of `gcpList` that represents GCP data as an array of rows.
   */
  @property() gcpInCsv: GcpFile = [];

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: white;
      height: 100%;
      width: 100%;
      border-radius: 12px;
    }
    /* Wrapper for the table */
    .table-wrapper {
      width: 100%;
      overflow-x: auto; /* Enable horizontal scrolling when the table overflows */
      -webkit-overflow-scrolling: touch; /* Smooth scrolling for mobile devices */
      margin-top: 20px; /* Optional: to maintain top margin */
      overflow: auto;
      max-height: 60vh;
    }

    table {
      width: 100%; /* Ensure the table takes up 100% of its container's width */
      border-collapse: collapse;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    table th:first-child {
      border-radius: 10px 0 0 0;
    }

    table th:last-child {
      border-radius: 0 10px 0 0;
    }

    th,
    td {
      padding: 12px 15px;
      text-align: left;
      font-size: 14px;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f73f3f;
      color: white;
      font-weight: bold;
    }

    tr:hover {
      background-color: #ffeded;
      cursor: pointer;
    }

    td {
      color: #555;
    }

    td,
    th {
      border-left: 1px solid #ddd;
    }

    td:first-child,
    th:first-child {
      border-left: none;
    }
    .button-wrapper {
      width: 100%;
      padding: 20px 20px;
      display: flex;
      justify-content: center;
      justify-items: center;
      gap: 10px;
    }
  `;

  /**
   * Lifecycle method: firstUpdated
   * Called when the component is first rendered. Processes the GCP list into a usable format.
   * @param _changedProperties Properties that changed when the component updated.
   */
  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.gcpInCsv = this.convertToArray(this.gcpList);
    this.buttonText = Store.getFinalButtonText();
    this.finalButtonClickFunction = Store.getCallbackFunc();
  }

  /**
   * Converts raw GCP data into an array of rows.
   * Each row represents a single GCP entry.
   * @param data The raw GCP data to process.
   * @returns An array of rows with headers included.
   */
  private convertToArray(data: any): GcpFile {
    const result: GcpFile = [];
    const headers: GcpHeaders = ['X', 'Y', 'Z', 'Image X', 'Image Y', 'File Name', 'Gcp Label'];

    // Add headers (these are removed on download, but there for information only)
    result.push(headers);

    for (const group in data) {
      for (const fileName in data[group]) {
        const entry = data[group][fileName];
        result.push([
          entry.X, // X
          entry.Y, // Y
          entry.Z, // Z
          entry.imageX, // Image X
          entry.imageY, // Image Y
          entry.fileName, // File Name
          entry.gcpLabel, // Gap Label
        ]);
      }
    }

    return result;
  }

  /**
   * Handles the GCP file download functionality.
   * Generates a space-separated text file in a custom format and triggers its download.
   */
  private handleGcpFileDownload() {
    if (!this.gcpInCsv || this.gcpInCsv.length <= 1) return;

    // Header for the projection (hardcoded for now)
    // TODO support other coord systems / not hardcoded to EPSG:4326
    const header = '+proj=utm +zone=10 +ellps=WGS84 +datum=WGS84 +units=m +no_defs\n';

    // Convert GCP data to space-separated rows
    const rows = this.gcpInCsv
      .slice(1) // Skip headers
      .map((row) => `${row[0]} ${row[1]} ${row[2]} ${row[3]} ${row[4]} ${row[5]}`) // Format: X Y Z ImageX ImageY FileName
      .join('\n');

    const finalContent = header + rows;
    // Create a Blob for the file and trigger download
    const blob = new Blob([finalContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'gcp.txt';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  handlePreviousClick() {
    Store.setActiveStep(2);
  }

  handleFinalButtonClick() {
    if (this.finalButtonClickFunction) {
      if (!this.gcpInCsv || this.gcpInCsv.length <= 1) return;
      // Header for the projection (hardcoded for now)
      // TODO support other coord systems / not hardcoded to EPSG:4326
      const header = '+proj=utm +zone=10 +ellps=WGS84 +datum=WGS84 +units=m +no_defs\n';

      // Convert GCP data to space-separated rows
      const rows = this.gcpInCsv
        .slice(1) // Skip headers
        .map((row) => `${row[0]} ${row[1]} ${row[2]} ${row[3]} ${row[4]} ${row[5]}`) // Format: X Y Z ImageX ImageY FileName
        .join('\n');

      const finalContent = header + rows;

      // Create a Blob for the file and trigger download
      const blob = new Blob([finalContent], { type: 'text/plain;charset=utf-8;' });
      // @ts-ignore
      this.finalButtonClickFunction(blob);
    } else {
      this.handleGcpFileDownload();
    }
  }

  render() {
    return html`
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              ${(this.gcpInCsv?.[0] as GcpHeaders)?.map((header: string) =>
                typeof header === 'string'
                  ? html`
                      <th>${header}</th>
                    `
                  : null
              )}
            </tr>
          </thead>
          <tbody>
            ${this.gcpInCsv.slice(1).map((row: GcpRow | GcpHeaders) =>
              Array.isArray(row) && !Number.isNaN(row[0])
                ? html`
                    <tr>
                      ${row.map(
                        (cell: string | number) =>
                          html`
                            <td>${cell}</td>
                          `
                      )}
                    </tr>
                  `
                : null
            )}
          </tbody>
        </table>
      </div>
      <div class="button-wrapper">
        <hot-button @click=${this.handlePreviousClick}>Previous</hot-button>
        <hot-button @click=${this.handleFinalButtonClick}>${this.buttonText}</hot-button>
      </div>
    `;
  }
}
