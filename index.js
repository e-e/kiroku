const https = require("https");

class Kiroku {
  _key = null;
  _silentErrors = true;

  /**
   * @param {string} key - The API key for the Kiroku service
   * @param {boolean} silentErrors - Whether to log errors
   */
  constructor(key, silentErrors = true) {
    this._key = key;
    this._silentErrors = silentErrors;
  }

  /**
   * @param {string} level
   * @param {string} message
   * @param {object} context
   * @param {object | null} request
   * @param {object | null} response
   * @returns {Promise<void>}
   */
  async _log(level, message, context, request = null, response = null) {
    return new Promise((resolve, reject) => {
      const request = https.request( {
        hostname: "kiroku.eric.wtf",
        path: "/api/v1/log",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this._key,
          "Accept": "application/json",
        },
      }, (response) => {
        if (!(response.statusCode >= 200 && response.statusCode < 300)) {
          if (!this._silentErrors) {
            console.error(`Kiroku responded with ${response.statusCode} ${response.statusMessage}`);
            reject(response);
          }
        }

        let responseData = "";
        response.on("data", (data) => {
          responseData += data;
        });
        response.on("end", () => {
          resolve(responseData);
        })
      });
      request.on("error", (error) => {
        if (!this._silentErrors) {
          console.error(error);
          reject(error);
        }
      })
      request.write(JSON.stringify({
        level,
        message,
        context,
        request,
        response,
      }));
      request.end();
    });
  }

  /**
   * @param {string} message
   * @param {object} context
   * @param {object | null} request
   * @param {object | null} response
   * @returns {Promise<void>}
   */
  async debug(message, context = {}, request = null, response = null) {
    await this._log("debug", message, context, request, response);
  }

  /**
   * @param message
   * @param context
   * @param {object | null} request
   * @param {object | null} response
   * @returns {Promise<void>}
   */
  async info(message, context = {}, request = null, response = null) {
    await this._log("info", message, context, request, response);
  }

  /**
   * @param message
   * @param context
   * @param {object | null} request
   * @param {object | null} response
   * @returns {Promise<void>}
   */
  async warn(message, context = {}, request = null, response = null) {
    await this._log("warning", message, context, request, response);
  }

  /**
   * @param message
   * @param context
   * @param {object | null} request
   * @param {object | null} response
   * @returns {Promise<void>}
   */
  async error(message, context = {}, request = null, response = null) {
    await this._log("error", message, context, request, response);
  }
}

module.exports = Kiroku;