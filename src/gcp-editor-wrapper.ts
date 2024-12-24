import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from './store';
import '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@hotosm/ui/dist/hotosm-ui';
import './components/GcpDataInput/index';
import './components/GcpMarking/index';
import './components/GcpResult/index';

@customElement('gcp-editor')
export class GcpEditor extends LitElement {
  @property({ type: String }) rawImageUrl = '';
  @property({ type: Number }) activeStep = 1;
  @property() gcpData = null;
  @property() setGcpDataWithXY = {};

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    Store.setRawImageUrl(this.rawImageUrl);
    // Listen for updates to CSV data
    document.addEventListener(Store.GCP_DATA_UPDATE, this.handleGcpDataUpdate.bind(this));
    document.addEventListener(Store.GCP_DATA_WITH_IMAGE_XY_UPDATE, this.handleGcpDataWithXYUpdate.bind(this));
    document.addEventListener(Store.ACTIVE_STEP_UPDATE, this.handleActiveStepUpdate.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener(Store.GCP_DATA_UPDATE, this.handleGcpDataUpdate.bind(this));
    document.removeEventListener(Store.GCP_DATA_WITH_IMAGE_XY_UPDATE, this.handleGcpDataWithXYUpdate.bind(this));
    document.removeEventListener(Store.ACTIVE_STEP_UPDATE, this.handleActiveStepUpdate.bind(this));
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

  handleActiveStepUpdate(event: Event) {
    const CustomEvent = event as CustomEvent<any>;
    this.activeStep = CustomEvent.detail;
  }

  render() {
    return html`
      <div class="tw-h-full tw-w-full tw-bg-gray-100">
        <div class="tw-px-20 tw-py-10 tw-h-full tw-w-full">
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
      </div>
    `;
  }
}
