import { AiService, Revision } from '@/utils/types';

export default class MockAiService implements AiService {
  constructor(private apiUrl: string) {}

  public getBaseApiUrl() {
    return this.apiUrl;
  }

  public setBaseApiUrl(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  getRevisions(): Promise<Revision[]> {
    return Promise.resolve([
      {
        id: 1,
        originalText: 'nested test 2',
        responseText: 'placeholder response text',
        parentId: null,
      },
      {
        id: 2,
        originalText: 'nested test 2',
        responseText: 'placeholder response text',
        parentId: 1,
      },
      {
        id: 3,
        originalText: 'nested test 3',
        responseText: 'placeholder response text',
        parentId: 2,
      },
      {
        id: 4,
        originalText: 'nested test 4',
        responseText: 'placeholder response text',
        parentId: 3,
      },
      {
        id: 5,
        originalText: 'nested test 5',
        responseText: 'placeholder response text',
        parentId: 3,
      },
      {
        id: 6,
        originalText: 'nested test 6',
        responseText: 'placeholder response text',
        parentId: 3,
      },
      {
        id: 7,
        originalText: 'not ntested',
        responseText: 'placeholder response text',
        parentId: null,
      },
    ]);
  }

  revise(
    prompt: string,
    originalText: string,
    parentId: number | null
  ): Promise<Revision> {
    return Promise.resolve({
      id: 6,
      originalText: originalText,
      responseText: `Response text to ${originalText}, prompt: ${prompt}`,
      parentId,
    });
  }

  delete(id: number): Promise<void> {
    console.log('deleting revision with id', id);
    return Promise.resolve();
  }
}
