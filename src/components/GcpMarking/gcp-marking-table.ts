import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from '../../store';
import uploadImage from '../../assets/uploadIcon.png';

@customElement('gcp-marking-table')
export class GcpMarkingTable extends LitElement {
  @property({ type: Object }) gcpData: String[][] = Store.getGcpData();
  @property() gcpDataWithImageXY: any = Store.getGcpDataWithXY() || {};

  connectedCallback() {
    super.connectedCallback();
    // Listen for updates to CSV data
    document.addEventListener(Store.GCP_DATA_WITH_IMAGE_XY_UPDATE, this.privateHandleGcpUpdate.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener(Store.GCP_DATA_WITH_IMAGE_XY_UPDATE, this.privateHandleGcpUpdate.bind(this));
    super.disconnectedCallback();
  }

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
    .upload-wrapper {
      display: flex;
      gap: 10px;
      cursor: pointer;
    }

    .upload-wrapper:hover {
      text-decoration: underline;
      text-decoration-color: red;
    }

    .upload-wrapper > span {
      color: red;
      font-weight: 600;
    }
  `;

  private handleGcpDataSelection(rowdata: any) {
    Store.setSelectedGcpDetails(rowdata);
  }

  private privateHandleGcpUpdate = (event: Event) => {
    const CustomEvent = event as CustomEvent<any>;
    this.gcpDataWithImageXY = CustomEvent.detail;
  };

  getMarkedImageCount = (gcpLabel: any) => {
    if (!gcpLabel || !this.gcpDataWithImageXY || !Object.keys(this.gcpDataWithImageXY || {}).length) return 0;
    const count = Object.keys(this.gcpDataWithImageXY?.[gcpLabel] || {}).length;
    return count || 0;
  };

  protected render() {
    return html`
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Marked image count</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${this.gcpData.slice(1).map(
            (row: Array<String>) => html`
              <tr>
                <td>
                  <span>${row[0]}</span>
                </td>
                <td>${this.getMarkedImageCount(row[0])}</td>
                <td>
                  <div class="upload-wrapper" @click=${() => this.handleGcpDataSelection(row)}>
                    <img src=${uploadImage} />
                    <span>Image</span>
                  </div>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}
