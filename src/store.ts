export class Store {
  private static _gcpData: string[][] = [];

  //   event for data update
  static readonly GCP_DATA_UPDATE = 'gcp-data-update';

  //   Methods to access and update the data
  static getGcpData(): string[][] {
    return this._gcpData;
  }

  static setGcpData(data: string[][]) {
    this._gcpData = data;
    document.dispatchEvent(new CustomEvent(Store.GCP_DATA_UPDATE, { detail: data }));
  }
}
