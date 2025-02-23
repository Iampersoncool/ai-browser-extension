import { Prompt, Prompts } from '@/utils/types';
import CrudStorageService from './CrudStorageService';

const DEFAULT_PROMPTS: Prompts = [
  {
    id: 0,
    name: 'Revise github pr',
    text: 'TODO',
  },
];

const PromptStorageService = new CrudStorageService<Prompt>(
  'local:prompts',
  DEFAULT_PROMPTS
);

export default PromptStorageService;
