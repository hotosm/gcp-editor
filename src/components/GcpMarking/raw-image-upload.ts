import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Store } from '../../store';
import './raw-image-marker';

@customElement('raw-image-upload')
export class RawImageUpload extends LitElement {
  @property() imageList: any = {}; // the list of images of all gcp
  @property() gcpList: any = {}; // the list of all gcp marks
  @property() selectedGcpDetails: any = [];
  @property() rawImageList: any[] = []; // list of active gcp's image list
  @property() gcpMarkList: any = {}; // list of active gcp's image mark

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.imageList = Store.getImageList();
    this.gcpList = Store.getGcpDataWithXY();
    this.selectedGcpDetails = Store.getSelectedGcpDetails();
    this.rawImageList = this.imageList?.[this.selectedGcpDetails?.[0]] || [];
    this.gcpMarkList = this.gcpList?.[this.selectedGcpDetails?.[0]] || {};
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  private handleFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input?.files;
    if (files) {
      this.rawImageList = Object.values(files);
    }
  }

  private updateMarkerDetails = (gcpData: any) => {
    this.gcpMarkList = { ...this.gcpList, ...gcpData };
  };

  private updateGcpData() {
    Store.setImageList({ ...this.imageList, [this.selectedGcpDetails[0]]: this.rawImageList });
    Store.setGcpDataWithXY({ ...this.gcpList, [this.selectedGcpDetails[0]]: this.gcpMarkList });
    Store.setSelectedGcpDetails(null);
    this.rawImageList = [];
    this.gcpMarkList = {};
  }

  render() {
    return html`
      <div class="tw-w-full tw-h-full tw-flex tw-flex-col">
        <div class="tw-w-full tw-h-fit">
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
              <span class="tw-text tw-font-light">Please upload an image file (.jpg, .tiff, .png)</span>
            </div>
          </label>
        </div>
        <div class="tw-flex tw-max-h-full tw-gap-4 tw-flex-wrap tw-w-full tw-overflow-y-auto tw-h-[60vh] tw-mt-4">
          ${this.rawImageList?.map(
            (rawImage: File, index: number) =>
              html`
                <raw-image-marker
                  .imageName=${rawImage.name}
                  .imageUrl=${URL.createObjectURL(rawImage)}
                  index=${index}
                  .gcpMarkerHandler=${this.updateMarkerDetails}
                  .mark=${this.gcpMarkList?.[rawImage.name]}
                  .selectedGcpDetails=${this.selectedGcpDetails}
                ></raw-image-marker>
              `
          )}
        </div>
      </div>
      <div class="tw-flex tw-justify-center tw-w-full tw-absolute tw-bottom-4" @click=${() => this.updateGcpData()}>
        <hot-button>Save Changes</hot-button>
      </div>
    `;
  }
}
