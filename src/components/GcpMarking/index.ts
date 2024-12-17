import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './map-section';
import './gcp-marking-table';
import { Store } from '../../store';
import './raw-image-upload';

@customElement('gcp-marking')
export class GcpMarking extends LitElement {
  @property() selectedGcpDetails = null;
  @property() gcpDataWithXY = Store.getGcpDataWithXY();
  @property() imageList: any = Store.getImageList();

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(Store.SELECTED_GCP_DETAILS_UPDATE, this.handleSelectedGcpDetailsUpdate.bind(this));
    document.addEventListener(Store.IMAGE_LIST_UPDATE, this.imageListUpdate.bind(this));
    document.addEventListener(Store.GCP_DATA_WITH_IMAGE_XY_UPDATE, this.gcpXYUpdate.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener(Store.SELECTED_GCP_DETAILS_UPDATE, this.handleSelectedGcpDetailsUpdate.bind(this));
    document.removeEventListener(Store.IMAGE_LIST_UPDATE, this.imageListUpdate.bind(this));
    document.removeEventListener(Store.GCP_DATA_WITH_IMAGE_XY_UPDATE, this.gcpXYUpdate.bind(this));
    super.disconnectedCallback();
  }

  private handleSelectedGcpDetailsUpdate(event: Event) {
    const CustomEvent = event as CustomEvent<any>;
    this.selectedGcpDetails = CustomEvent.detail;
  }
  private imageListUpdate(event: Event) {
    const CustomEvent = event as CustomEvent<any>;
    this.imageList = CustomEvent.detail;
  }
  private gcpXYUpdate(event: Event) {
    const CustomEvent = event as CustomEvent<any>;
    this.gcpDataWithXY = CustomEvent.detail;
  }

  private handleSaveChanges(markerData: { images: File[]; markings: any; gcpLabel: string | number }) {
    // if (markerData?.images?.length) {
    // Store.setImageList({ ...this.imageList, [markerData.gcpLabel]: markerData?.images });
    Store.setImageList(markerData.images);

    // }
    if (Object.keys(markerData.markings || {}).length) {
      Store.setGcpDataWithXY(markerData.markings);
    }
  }

  protected render() {
    return html`
      <div class="tw-grid tw-grid-cols-5 tw-gap-10">
        <div class="tw-col-span-2">
          <gcp-marking-table></gcp-marking-table>
        </div>
        <div class="tw-col-span-3"><map-section></map-section></div>
      </div>
      ${this.selectedGcpDetails
        ? html`
            <hot-dialog
              open
              label="Mark GCP ${this?.selectedGcpDetails?.[0]} on raw images"
              class="dialog-width dialog-deny-close"
              style="--width: 92vw;"
            >
              <div id="image-uploading-content">
                <raw-image-upload
                  .selectedGcpDetails=${this.selectedGcpDetails}
                  .imageList=${this.imageList}
                  .gcpList=${this.gcpDataWithXY}
                  .handleSaveChanges=${this.handleSaveChanges}
                ></raw-image-upload>
              </div>
            </hot-dialog>
          `
        : null}
    `;
  }
}
