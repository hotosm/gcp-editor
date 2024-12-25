import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Store } from '../../store';
import spinner from '../../assets/spinner.gif';

@customElement('raw-image-fetch')
export class RawImageFetch extends LitElement {
  @property() imageList: any = {}; // the list of images of all gcp
  @property() gcpList: any = {}; // the list of all gcp marks
  @property() selectedGcpDetails: any = [];
  @property() rawImageList: any[] = []; // list of active gcp's image list
  @property() gcpMarkList: any = {}; // list of active gcp's image mark
  @property() imageUrl: string = '';
  @state() isLoadingImages = false;

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.imageUrl = Store.getRawImageUrl();
    this.imageList = Store.getImageList();
    this.gcpList = Store.getGcpDataWithXY();
    this.selectedGcpDetails = Store.getSelectedGcpDetails();
    this.rawImageList = this.imageList?.[this.selectedGcpDetails?.[0]] || [];
    this.gcpMarkList = this.gcpList?.[this.selectedGcpDetails?.[0]] || {};

    if (!this.rawImageList || (!this.rawImageList?.length && this.imageUrl)) {
      this.isLoadingImages = true;
      this.fetchImages(this.imageUrl);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  private async fetchImages(url: string) {
    try {
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longitude: 85.328644727626,
          latitude: 27.7303180403227,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.rawImageList = await response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      this.isLoadingImages = false;
    }
  }

  private updateMarkerDetails = (gcpData: any) => {
    this.gcpMarkList = { ...this.gcpMarkList, ...gcpData };
  };

  private updateGcpData() {
    Store.setImageList({ ...this.imageList, [this.selectedGcpDetails[0]]: this.rawImageList });
    Store.setGcpDataWithXY({ ...this.gcpList, [this.selectedGcpDetails[0]]: this.gcpMarkList });
    Store.setSelectedGcpDetails(null);
    this.rawImageList = [];
    this.gcpMarkList = {};
  }

  getFileName(fileUrl: string): string {
    const parsedUrl = new URL(fileUrl);
    const pathSegments = parsedUrl.pathname.split('/');
    const fileName = pathSegments[pathSegments.length - 1];
    return fileName;
  }

  render() {
    return html`
      <div class="tw-flex tw-max-h-full tw-gap-4 tw-flex-wrap tw-w-full tw-overflow-y-auto tw-h-[70vh] tw-mt-4">
        ${this.isLoadingImages
          ? html`
              <div class="tw-flex tw-justify-center tw-items-center tw-w-full">
                <div class="tw-w-[200px] tw-h-[200px]:">
                  <img src=${spinner} />
                </div>
              </div>
            `
          : html`
              ${this.rawImageList?.map(
                (rawImage: string, index: number) =>
                  html`
                    <raw-image-marker
                      .imageName=${this.getFileName(rawImage)}
                      .imageUrl=${rawImage}
                      index=${index}
                      .gcpMarkerHandler=${this.updateMarkerDetails}
                      .mark=${this.gcpMarkList?.[this.getFileName(rawImage)]}
                      .selectedGcpDetails=${this.selectedGcpDetails}
                    ></raw-image-marker>
                  `
              )}
            `}
      </div>
      <div class="tw-flex tw-justify-center tw-w-full tw-absolute tw-bottom-4" @click=${() => this.updateGcpData()}>
        <hot-button>Save Changes</hot-button>
      </div>
    `;
  }
}
