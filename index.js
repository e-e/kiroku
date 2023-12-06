class Kiroku {
  #key = null;

  /**
   * @param {string} key - The API key for the Kiroku service
   */
  constructor(key) {
    this.key = key;
  }

  /**
   * @param {string} level
   * @param {string} message
   * @param {Object} context
   * @returns {Promise<void>}
   */
  async #log() {
    await fetch("https://kiroku.app/api/v1/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.key,
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
    this.log("debug", message, context);
  }

  /**
   * @param message
   * @param context
   * @returns {Promise<void>}
   */
  async info(message, context = {}) {
    this.log("info", message, context);
  }

  /**
   * @param message
   * @param context
   * @returns {Promise<void>}
   */
  async warn(message, context = {}) {
    this.log("warning", message, context);
  }

  /**
   * @param message
   * @param context
   * @returns {Promise<void>}
   */
  async error(message, context = {}) {
    this.log("error", message, context);
  }
}

export default Kiroku;