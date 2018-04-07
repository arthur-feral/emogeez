import 'whatwg-fetch';

/**
 *
 * @param config
 * @return {{get: function(*)}}
 */
export default (config) => {


  /**
   *
   * @param themeName
   */
  const get = (themeName) => {
    const url = `${config.themesUrl}/${themeName}/${themeName}.json`;

    return fetch(url)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      })
      .then((response) => response.json());
  };

  return {
    get,
  };
};
