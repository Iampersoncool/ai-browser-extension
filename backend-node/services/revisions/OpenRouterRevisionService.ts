import { openRouterClient } from '@/utils/aiClients.js';
import RevisionService from './RevisionService.js';

const OpenRouterRevisionService = new RevisionService(
  ['deepseek/deepseek-r1-distill-llama-70b:free'],
  openRouterClient
);
export default OpenRouterRevisionService;
