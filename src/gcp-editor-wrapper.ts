import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from './store';
import '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@hotosm/ui/dist/hotosm-ui';
import './components/GcpDataInput/index';
import './components/GcpMarking/index';
import './components/GcpResult/index';
import { get } from 'ol/proj';

@customElement('gcp-editor')
export class GcpEditor extends LitElement {
  @property({ type: Number }) activeStep = 1;
  @property() gcpData = null;
  @property() setGcpDataWithXY = {};

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    // Listen for updates to CSV data
    document.addEventListener(Store.GCP_DATA_UPDATE, this.handleGcpDataUpdate.bind(this));
    document.addEventListener(Store.GCP_DATA_WITH_IMAGE_XY_UPDATE, this.handleGcpDataWithXYUpdate.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener(Store.GCP_DATA_UPDATE, this.handleGcpDataUpdate.bind(this));
    document.removeEventListener(Store.GCP_DATA_WITH_IMAGE_XY_UPDATE, this.handleGcpDataWithXYUpdate.bind(this));
    super.disconnectedCallback();
  }

  handleGcpDataUpdate(event: Event) {
    const CustomEvent = event as CustomEvent<any>;
    this.gcpData = CustomEvent?.detail;
  }

  handleGcpDataWithXYUpdate(event: Event) {
    const CustomEvent = event as CustomEvent<any>;
    this.setGcpDataWithXY = CustomEvent?.detail;
  }

  private handleClickBack() {
    this.activeStep = this.activeStep - 1;
  }

  private handleClickNext() {
    const projection = Store.getProjection();
    if (this.activeStep === 1 && (!this.gcpData || !get(projection))) return;
    if (this.activeStep === 2 && !Object.keys(this.setGcpDataWithXY || {}).length) return;
    this.activeStep = this.activeStep + 1;
  }

  render() {
    return html`
      <div class="tw-h-full tw-w-full tw-pb-28">
        <div class="tw-px-20 tw-py-10 tw-h-full tw-w-full tw-border-b">
          ${this.activeStep === 1
            ? html`
                <gcp-data-input></gcp-data-input>
              `
            : this.activeStep === 2
            ? html`
                <gcp-marking></gcp-marking>
              `
            : html`
                <gcp-result></gcp-result>
              `}
        </div>

        <div class="tw-flex tw-justify-between tw-w-full tw-fixed tw-bottom-10 tw-px-20">
          ${this.activeStep > 1
            ? html`
                <hot-button @click=${this.handleClickBack}>Back</hot-button>
              `
            : html`
                <div></div>
              `}
          <hot-button @click=${this.handleClickNext}>Next</hot-button>
        </div>
      </div>
    `;
  }
}
