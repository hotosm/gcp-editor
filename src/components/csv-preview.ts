import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from '../store';

@customElement('csv-preview')
export class CsvPreview extends LitElement {
  @property({ type: Object }) gcpData: String[][] = Store.getGcpData();

  connectedCallback() {
    super.connectedCallback();
    // Listen for updates to CSV data
    document.addEventListener(Store.GCP_DATA_UPDATE, this.handleGcpDataUpdate.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener(Store.GCP_DATA_UPDATE, this.handleGcpDataUpdate.bind(this));
    super.disconnectedCallback();
  }

  handleGcpDataUpdate(event: Event) {
    const CustomEvent = event as CustomEvent<any>;
    this.gcpData = CustomEvent?.detail;
  }

  static styles = css`
    :host {
      display: block;
      padding: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
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

  render() {
    return html`
      <table>
        <thead>
          <tr>
            ${this.gcpData[0]?.map(
              (header: String) =>
                html`
                  <th>${header}</th>
                `
            )}
          </tr>
        </thead>
        <tbody>
          ${this.gcpData.slice(1).map(
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
    `;
  }
}
