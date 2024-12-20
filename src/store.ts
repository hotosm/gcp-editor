export class Store {
  private static _gcpData: string[][] = [];
  private static _cogUrl: string = '';
  private static _projection: string = '';
  private static _activeStep: number = 1;
  private static _gcpPointsGeoJson: Object | null = null;
  private static _selectedGcpDetails: any = null;
  private static _gcpDataWithImageXY: any = {};
  private static _imageList = {};

  //   event for data update
  static readonly GCP_DATA_UPDATE = 'gcp-data-update';
  static readonly COG_URL_UPDATE = 'cog-url-update';
  static readonly PROJECTION_UPDATE = 'cog-url-update';
  static readonly ACTIVE_STEP_UPDATE = 'active-step-update';
  static readonly GCP_POINTS_GEOJSON = 'gcp-points-geojson';
  static readonly SELECTED_GCP_DETAILS_UPDATE = 'selected-gcp-details-update';
  static readonly GCP_DATA_WITH_IMAGE_XY_UPDATE = 'final-gcp-data-with-xy-update';

  // ***
  static readonly IMAGE_LIST_UPDATE = 'image-list-update';

  //   Methods to access and update the data
  static getGcpData(): string[][] {
    return this._gcpData;
  }

  static setGcpData(data: string[][]) {
    this._gcpData = data;
    document.dispatchEvent(new CustomEvent(Store.GCP_DATA_UPDATE, { detail: data }));
  }

  static getCogUrl(): string {
    return this._cogUrl;
  }

  static setCogUrl(data: string) {
    this._cogUrl = data;
    document.dispatchEvent(new CustomEvent(Store.COG_URL_UPDATE, { detail: data }));
  }

  static getProjection(): string {
    return this._projection;
  }

  static setProjection(data: string) {
    this._projection = data;
    document.dispatchEvent(new CustomEvent(Store.PROJECTION_UPDATE, { detail: data }));
  }

  static getActiveStep(): number {
    return this._activeStep;
  }

  static setActiveStep(data: number) {
    this._activeStep = data;
    document.dispatchEvent(new CustomEvent(Store.ACTIVE_STEP_UPDATE, { detail: data }));
  }

  static getGcpGeojson(): any {
    return this._gcpPointsGeoJson;
  }

  static setGcpGeojson(data: Object) {
    this._gcpPointsGeoJson = data;
    document.dispatchEvent(new CustomEvent(Store.GCP_POINTS_GEOJSON, { detail: data }));
  }

  static getSelectedGcpDetails(): any {
    return this._selectedGcpDetails;
  }

  static setSelectedGcpDetails(data: any) {
    this._selectedGcpDetails = data;
    document.dispatchEvent(new CustomEvent(Store.SELECTED_GCP_DETAILS_UPDATE, { detail: data }));
  }

  static getGcpDataWithXY(): any {
    return this._gcpDataWithImageXY;
  }

  static setGcpDataWithXY(data: any) {
    this._gcpDataWithImageXY = data;
    document.dispatchEvent(new CustomEvent(Store.GCP_DATA_WITH_IMAGE_XY_UPDATE, { detail: data }));
  }

  static getImageList(): any {
    return this._imageList;
  }

  static setImageList(data: any) {
    this._imageList = data;
    document.dispatchEvent(new CustomEvent(Store.IMAGE_LIST_UPDATE, { detail: data }));
  }
}
