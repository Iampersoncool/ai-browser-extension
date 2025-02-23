export interface Revision {
  id: number;
  originalText: string;
  responseText: string;

  parentId: number | null;
}

export interface RevisionNode extends Revision {
  revisions: RevisionNode[];
}

export interface Prompt {
  id: number;
  text: string;
  name: string;
}

export type Prompts = Prompt[];

export interface ProtocolMap {
  addPrompt(prompt: Omit<Prompt, 'id'>): Prompt;
  getPrompts(): Prompts;
  updatePrompt(prompt: Prompt): Prompt;
  deletePrompt({ id }: { id: number }): Prompt;

  revisionAdded(revision: Revision): void;
}

export interface AiService {
  getRevisions(): Promise<Revision[]>;
  revise(
    promptText: string,
    originalText: string,
    parentId: number | null
  ): Promise<Revision>;
  delete(id: number): Promise<void>;

  getBaseApiUrl(): string;
  setBaseApiUrl(url: string): void;
}
