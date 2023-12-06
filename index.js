const https = require("https");

class Kiroku {
  _key = null;

  /**
   * @param {string} key - The API key for the Kiroku service
   * @param {boolean} silentErrors - Whether to log errors
   */
  constructor(key, silentErrors = true) {
    this._key = key;
  }

  /**
   * @param {string} level
   * @param {string} message
   * @param {Object} context
   * @returns {Promise<void>}
   */
  async _log(level, message, context) {
    const request = await https.request("https://kiroku.app/api/v1/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this._key,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        level,
        message,
        context,
      }),
    });
  }

  /**
   * @param {string} message
   * @param {object} context
   * @returns {Promise<void>}
   */
  async debug(message, context = {}) {
    await this._log("debug", message, context);
  }

  /**
   * @param message
   * @param context
   * @returns {Promise<void>}
   */
  async info(message, context = {}) {
    await this._log("info", message, context);
  }

  /**
   * @param message
   * @param context
   * @returns {Promise<void>}
   */
  async warn(message, context = {}) {
    await this._log("warning", message, context);
  }

  /**
   * @param message
   * @param context
   * @returns {Promise<void>}
   */
  async error(message, context = {}) {
    await this._log("error", message, context);
  }
}

module.exports = Kiroku;