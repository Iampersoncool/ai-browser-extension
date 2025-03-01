import { ollamaClient } from '@/utils/aiClients.js';
import RevisionService from './RevisionService.js';

const OllamaRevisionService = new RevisionService(
  ['deepseek-r1:1.5b'],
  ollamaClient
);

export default OllamaRevisionService;
