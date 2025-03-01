import ModelNotFoundError from '@/errors/ModelNotFoundError.js';
import OpenAI from 'openai';

export type RevisionServiceModel = string;
export type RevisionServiceModels = RevisionServiceModel[];

export default class RevisionService {
  private static responseTag = 'response';

  private static systemPrompt = `
    Modify the given text according to the provided instruction,
    then return the modified text in a pair of ${this.responseTag} tags,
    and do your best to not ask questions.

    Example user input: """
      ### Context ###
      HELLO WORLD

      ### Instruction ###
      rewrite the provided text in lowercase
    """

    Example response: "<${this.responseTag}>hello world</${this.responseTag}>"
  `;

  constructor(
    private models: RevisionServiceModels,
    private openAiClient: OpenAI
  ) {}

  public async revise(modelName: string, text: string, prompt: string) {
    if (!this.models.find(mn => mn === modelName))
      throw new ModelNotFoundError(`${modelName} not found`);

    const response = await this.openAiClient.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'user',
          content: `
            ${RevisionService.systemPrompt}

            ### Context ###
            """${text}"""

            ### Instruction ###
            """${prompt}"""
          `,
        },
      ],
    });

    const responseText = response.choices[0].message.content;
    if (!responseText)
      throw new Error(`${modelName} did not return any content`);

    return responseText;
  }

  public getModels(): RevisionServiceModels {
    console.log('getting models');

    return this.models;
  }
}
