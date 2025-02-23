import { AiService, Revision } from '@/utils/types';
import ky from 'ky';
import urlJoin from 'url-join';

export default class BaseAiService implements AiService {
  /**
   * @param name Ex: 'openai' or 'deepseek'
   * @param baseApiUrl Ex: http://localhost:6969/
   */
  constructor(private name: string, private baseApiUrl?: string) {}

  public getBaseApiUrl() {
    if (!this.baseApiUrl)
      throw new Error('BaseAiService getBaseApiUrl: apiUrl not found');

    return this.baseApiUrl;
  }

  public setBaseApiUrl(url: string) {
    this.baseApiUrl = url;
  }

  public getName() {
    return this.name;
  }

  getRevisions(): Promise<Revision[]> {
    const revisionsApiUrl = urlJoin(
      this.getBaseApiUrl(),
      this.name,
      'revisions'
    );
    return ky.get<Revision[]>(revisionsApiUrl).json();
  }

  revise(
    promptText: string,
    originalText: string,
    parentId: number | null
  ): Promise<Revision> {
    const reviseApiUrl = urlJoin(
      this.getBaseApiUrl(),
      this.name,
      'revisions',
      'revise'
    );
    return ky
      .post<Revision>(reviseApiUrl, {
        json: {
          promptText,
          originalText,
          parentId,
        },
      })
      .json();
  }

  async delete(id: number): Promise<void> {
    const deleteApiUrl = urlJoin(
      this.getBaseApiUrl(),
      this.name,
      'revisions',
      'delete'
    );
    await ky.post<void>(deleteApiUrl, {
      json: {
        id,
      },
    });
  }
}
