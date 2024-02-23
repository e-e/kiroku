const https = require("https");
const http = require("http");

class Kiroku {
  _key = null;
  _silentErrors = true;

  /**
   * @param {string} key - The API key for the Kiroku service
   * @param {boolean} silentErrors - Whether to log errors
   * @param {string} host - The host to send logs to
   */
  constructor(key, silentErrors = true, host = "https://kiroku.eric.wtf") {
    this._key = key;
    this._silentErrors = silentErrors;
    this._host = host;
  }

  /**
   * @param {string} level
   * @param {string} message
   * @param {object} context
   * @param {object | null} requestData
   * @param {object | null} responseData
   * @returns {Promise<void>}
   */
  async _log(level, message, context, requestData = null, responseData = null) {
    const url = new URL(this._host);
    const client = url.protocol === "https:" ? https : http;

    return new Promise((resolve, reject) => {
      const request = client.request( {
        hostname: url.host,
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
        request: requestData,
        response: responseData,
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