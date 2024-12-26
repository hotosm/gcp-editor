import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import gcpMarkerIcon from '../../assets/gcpMarker.png'
import panzoom from '@panzoom/panzoom';

@customElement('raw-image-marker')
export class RawImageMarker extends LitElement {
  @property() imageName: any = null;
  @property() imageUrl = '';
  @property() index: any = null;
  @property() gcpMarkerHandler: any;
  @property() selectedGcpDetails: any;
  @property() mark: any;
  private _hasRenderedMark = false;

  createRenderRoot() {
    // Return `this` instead of a shadow root, meaning no Shadow DOM is used
    return this;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.initializePanzoom(this.index, this.imageName, this.mark);
    this._hasRenderedMark = true;
  }

  requestUpdate(name?: PropertyKey, oldValue?: unknown): void {
    if (this._hasRenderedMark) {
      // After the first render, we avoid any updates, suppressing re-renders
      return; // Don't call super.requestUpdate to suppress further updates
    }
    // Call the super method to trigger the update the first time
    super.requestUpdate(name, oldValue);
  }

  private async initializePanzoom(imageIndex: number, imageName: string, mark: any) {
    const container = this.querySelector(`#panzoom-container-${imageIndex}`) as HTMLElement;
    const marker = this.querySelector(`#marker-${imageIndex}`) as HTMLElement;
    const imageLabel = this.querySelector(`#label-${imageIndex}`) as HTMLElement;

    const img = new Image();
    img.src = this.imageUrl;
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const imageAspectRation = width / height;
      const imageContainerHeight = height / imageAspectRation;
      const imageContainerWidth = width / imageAspectRation;

      setTimeout(() => {
        container.style.height = imageContainerHeight / 3 + 'px';
        container.style.width = imageContainerWidth / 3 + 'px';

        const panzoomInstance = panzoom(container as HTMLElement, {
          maxScale: 5,
          minScale: 1,
          startScale: 1,
          contain: 'outside',
        });

        // Mouse wheel zoom functionality
        // container.addEventListener('wheel', function (event: any) {
        //   event.preventDefault(); // Prevent page scrolling
        //   if (event.deltaY < 0) {
        //     panzoomInstance.zoomIn(); // Zoom in on scroll up
        //   } else {
        //     panzoomInstance.zoomOut(); // Zoom out on scroll down
        //   }
        // });

        const addMarker = (topPosition: number, leftPosition: number) => {
          imageLabel.style.background = '#D73F3F';
          marker.style.height = '30px';
          marker.style.width = '30px';
          marker.style.display = 'block';
          marker.style.position = 'absolute';
          // Set the marker's new position in percentage relative to the container
          // Adjust the marker's position by half of its width/height to center it on the click position
          const markerWidth = marker.offsetWidth;
          const markerHeight = marker.offsetHeight;

          marker.style.top = `calc(${topPosition}% - ${markerHeight / 2}px)`;
          marker.style.left = `calc(${leftPosition}% - ${markerWidth / 2}px)`;
        };

        if (mark && panzoomInstance) {
          const rect = container.getBoundingClientRect(); // Get container's position
          const containerWidth = rect.width;
          const containerHeight = rect.height;

          const x = mark.imageX / imageAspectRation / 3;
          const y = mark.imageY / imageAspectRation / 3;

          const topPosition = (y / containerHeight) * 100; // Percentage from the top
          const leftPosition = (x / containerWidth) * 100; // Percentage from the left
          addMarker(topPosition, leftPosition);
        }

        // Attach click event to place the marker
        container?.addEventListener('dblclick', (event: any) => {
          const rect = container.getBoundingClientRect(); // Get container's position
          const containerWidth = rect.width;
          const containerHeight = rect.height;

          // Get the click position relative to the container
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          const topPosition = (y / containerHeight) * 100; // Percentage from the top
          const leftPosition = (x / containerWidth) * 100; // Percentage from the left

          const imageX = x * imageAspectRation * 3;
          const imageY = y * imageAspectRation * 3;

          const finalGcpData = {
            gcpLabel: this.selectedGcpDetails?.[0],
            X: this.selectedGcpDetails?.[1],
            Y: this.selectedGcpDetails?.[2],
            Z: this.selectedGcpDetails?.[3],
            fileName: imageName,
            imageX,
            imageY,
          };
          this.gcpMarkerHandler({ [imageName]: finalGcpData });
          addMarker(topPosition, leftPosition);
        });
      }, 1000);
    };
  }

  render() {
    return html`
      <div>Double Click To Mark The Actual GCP Location</div>
      <div class="image-with-outer-wrapper">
        <div
          id="label-${this.index}"
          class="tw-h-[30px] tw-w-full ${this.mark
            ? 'tw-bg-primary'
            : 'tw-bg-gray-400'} tw-flex tw-items-center tw-px-1 tw-line-clamp-1 tw-text-[#fff]"
        >
          ${this.imageName}
        </div>
        <div class="outer">
          <div
            class="image-container"
            id="panzoom-container-${this.index}"
            style="background-image: url(${this.imageUrl})"
          >
            <!-- Marker inside the image -->
            <img id="marker-${this.index}" src=${gcpMarkerIcon} style="display: none" />
          </div>
        </div>
      </div>
    `;
  }
}
