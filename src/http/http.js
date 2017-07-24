const xhrHeaders = {
  method: 'GET',
  data: {},
  queryParams: {},
  alwaysTriggerCallback: false,
  callback: undefined,
  extraCallbackParams: {},
  headers: {
    'Authorization': `Token token="${window.api.token}"`
  }
};


export class Http {
  static request(url, options) {
    Object.assign(xhrHeaders, options);
    if (!url) {
      throw new Error('please give a valid URL');
    }
    return fetch(url, xhrHeaders)
      .then(response => response.json());
  }
}
