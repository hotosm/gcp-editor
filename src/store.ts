export class Store {
  private static _gcpData: string[][] = [];
  private static _cogUrl: string = '';
  private static _projection: string = '';

  //   event for data update
  static readonly GCP_DATA_UPDATE = 'gcp-data-update';
  static readonly COG_URL_UPDATE = 'cog-url-update';
  static readonly PROJECTION_UPDATE = 'cog-url-update';

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
}
