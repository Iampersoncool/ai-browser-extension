import { parse } from 'node-html-parser';
import { openAiClient } from '../../utils/ai.js';

export default class DeepseekAiService {
  static #tagName = 'response';

  static #modelName = 'deepseek/deepseek-r1-distill-llama-70b:free';
  // static #modelName = 'deepseek-r1:1.5b';

  //prettier-ignore
  static #systemPrompt = `
    Modify the given text according to the provided instruction. 
    Strict Rule: Your final response MUST be within a ${this.#tagName} tag.

    Example user input:
      ### Context ###
      """HELLO WORLD"""

      ### Instruction ###
      """rewrite the provided text in lowercase"""

    Example response: <${this.#tagName}>hello world</${this.#tagName}>
  `;

  /**
   *
   * @param {string} text
   * @param {string} prompt
   * @returns {Promise<string>}
   */
  static async revise(text, prompt) {
    const response = await openAiClient.chat.completions.create({
      model: this.#modelName,
      messages: [
        {
          role: 'system',
          content: this.#systemPrompt,
        },
        {
          role: 'user',
          content: `
            ### Context ###
            """${text}"""

            ### Instruction ###
            """${prompt}"""
          `,
        },
      ],
    });

    const rawTextResponse = response.choices[0].message.content;

    const dom = parse(rawTextResponse);

    const responseEls = dom.querySelectorAll(this.#tagName);
    const lastResponseEl = responseEls[responseEls.length - 1];

    return lastResponseEl.textContent;
  }

  static getSystemPrompt() {
    return this.#systemPrompt;
  }

  static getModelName() {
    return this.#modelName;
  }
}
