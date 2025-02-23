export default class MockAiService {
  /**
   *
   * @param {string} text
   * @param {string} prompt
   */
  static async revise(text, prompt) {
    return Promise.resolve(`Revision for text ${text} with prompt ${prompt}`);
  }
}
