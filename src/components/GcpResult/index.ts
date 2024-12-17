import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from '../../store';

@customElement('gcp-result')
export class GcpResult extends LitElement {
  @property() gcpList = Store.getGcpDataWithXY();
  @property() gcpInCsv: any = [];

  static styles = css`
    :host {
      display: block;
      padding: 10px;
    }
    /* Wrapper for the table */
    .table-wrapper {
      overflow-x: auto; /* Enable horizontal scrolling when the table overflows */
      -webkit-overflow-scrolling: touch; /* Smooth scrolling for mobile devices */
      margin-top: 20px; /* Optional: to maintain top margin */
    }

    table {
      width: 100%; /* Ensure the table takes up 100% of its container's width */
      border-collapse: collapse;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  `;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.gcpInCsv = this.convertToArray(this.gcpList);
  }

  private convertToArray(data: any) {
    const result = [];
    const headers = ['File Name', 'GCP Label', 'X', 'Y', 'Z', 'Image X', 'Image Y'];
    // Add headers to the result array
    result.push(headers);
    // Loop through each "group" (e.g., '1', '2') in the data
    for (const group in data) {
      // Loop through each file in the group (e.g., 'DJI_20240503142205_0095_D.JPG')
      for (const fileName in data[group]) {
        const entry = data[group][fileName];
        // Prepare a row with the necessary data
        result.push([entry.fileName, entry.gcpLabel, entry.X, entry.Y, entry.Z, entry.imageX, entry.imageY]);
      }
    }
    return result;
  }

  render() {
    return html`
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              ${this.gcpInCsv?.[0]?.map(
                (header: String) =>
                  html`
                    <th>${header}</th>
                  `
              )}
            </tr>
          </thead>
          <tbody>
            ${this.gcpInCsv?.slice(1).map(
              (row: Array<String>) => html`
                <tr>
                  ${row.map(
                    (cell: String) =>
                      html`
                        <td>${cell}</td>
                      `
                  )}
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}
