import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './csv-upload';
import { Store } from '../../store';

@customElement('gcp-data-input')
export class GcpDataInput extends LitElement {
  @property({ type: String }) projection: string = Store.getProjection();
  @state() errorMessage: string = '';

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  handleNextClick() {
    if (!Store.getGcpData()?.length) {
      this.errorMessage = 'Please upload csv file';
      return;
    }
    this.errorMessage = '';
    Store.setActiveStep(2);
  }

  render() {
    return html`
      <div class="tw-grid tw-grid-cols-3 tw-gap-10 tw-h-full tw-w-full">
        <div class="tw-bg-[#fff] tw-w-full tw-h-full tw-p-5 tw-min-h-80 tw-col-span-1 tw-rounded-xl">
          Information about csv format
        </div>

        <div class="tw-flex tw-flex-col tw-gap-5 tw-col-span-2 tw-bg-[#fff] tw-p-5 tw-rounded-xl tw-relative">
          <csv-upload errorMessage=${this.errorMessage}></csv-upload>

          <div class="tw-absolute tw-bottom-4 tw-right-10">
            <hot-button size="small" class="primary" @click=${() => this.handleNextClick()}>
              Next
              <span slot="suffix" class="material-symbols-outlined !tw-text-lg">chevron_right</span>
            </hot-button>
          </div>
        </div>
      </div>
    `;
  }
}
