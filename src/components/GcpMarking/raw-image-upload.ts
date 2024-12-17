import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from '../../store';
import './raw-image-marker';

@customElement('raw-image-upload')
export class RawImageUpload extends LitElement {
  @property() rawImages: any = [];
  @property() gcpMarks: any = {};
  @property() imageList: any = {};
  @property() gcpList: any = {};
  @property() selectedGcpDetails: any = [];
  @property() handleSaveChanges: any;

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.rawImages = this.imageList?.[this.selectedGcpDetails?.[0]] || [];
    this.gcpMarks = this.gcpList?.[this.selectedGcpDetails?.[0]] || {};

    // Prevent the dialog from closing when the user clicks on the overlay
    const dialog = document.querySelector('.dialog-deny-close') as HTMLElement;
    dialog.addEventListener('sl-request-close', (event) => {
      if (event.detail.source === 'overlay') {
        event.preventDefault();
      }
      Store.setSelectedGcpDetails(null);
    });
  }

  disconnectedCallback() {
    this.rawImages = this.imageList?.[this.selectedGcpDetails?.[0]] || [];
    this.gcpMarks = this.gcpList?.[this.selectedGcpDetails?.[0]] || {};

    // Prevent the dialog from closing when the user clicks on the overlay
    const dialog = document.querySelector('.dialog-deny-close') as HTMLElement;
    dialog?.removeEventListener('sl-request-close', () => {});

    super.disconnectedCallback();
  }

  private handleFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input?.files;
    if (files) {
      this.rawImages = Object.values(files);
    }
  }

  private updateMarkerDetails = (gcpData: any) => {
    this.gcpMarks = { ...this.gcpMarks, ...gcpData };
  };

  private updateGcpData() {
    this.handleSaveChanges({
      images: { ...this.imageList, [this.selectedGcpDetails[0]]: this.rawImages },
      markings: { ...this.gcpList, [this.selectedGcpDetails[0]]: this.gcpMarks },
      gcpLabel: [this.selectedGcpDetails[0]],
    });
    Store.setSelectedGcpDetails(null);
    this.rawImages = [];
    this.gcpMarks = {};
  }

  render() {
    return html`
      <div class="tw-h-[80vh] tw-relative">
        <div class="tw-max-w-full">
          <label
            class=" tw-border-gray-400 tw-border-dashed tw-border-2 tw-rounded-lg tw-h-20 tw-w-full tw-flex tw-items-center tw-justify-center tw-relative"
          >
            <input
              type="file"
              id="raw-image-input-element"
              name="gcp-file"
              class="tw-h-24 tw-opacity-0 tw-absolute"
              multiple
              @change=${this.handleFileInputChange}
              accept="image/*"
            />
            <div class="tw-flex tw-flex-col tw-items-center tw-justify-center">
              <span class="material-symbols-outlined tw-text-primary">cloud_upload</span>
              <span class="tw-text tw-font-light">The Supported file format is .jpg</span>
            </div>
          </label>
        </div>
        <div class="images-list-wrapper tw-relative">
          ${this.rawImages?.map(
            (rawImage: File, index: number) =>
              html`
                <raw-image-marker
                  .image=${rawImage}
                  index=${index}
                  .gcpMarkerHandler=${this.updateMarkerDetails}
                  .mark=${this.gcpMarks?.[rawImage.name]}
                  .selectedGcpDetails=${this.selectedGcpDetails}
                ></raw-image-marker>
              `
          )}
        </div>
        <div class="tw-flex tw-justify-center tw-w-full tw-absolute tw-bottom-4" @click=${() => this.updateGcpData()}>
          <hot-button>save changes</hot-button>
        </div>
      </div>
    `;
  }
}
