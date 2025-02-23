import AiServiceManager from '@/services/AiServiceManager';
import AiPrefStorageService from '@/services/storage/AiPrefStorageService';
import ApiUrlStorageService from '@/services/storage/ApiUrlStorageService';
import { AiService } from './types';

/**
 * Makes calls to the chrome.storage api.
 * @returns the current ai service selected by the user.
 */
export async function getCurrentAiService(): Promise<AiService> {
  console.time('getCurrentAiService');

  const [aiPref, baseApiUrl] = await Promise.all([
    AiPrefStorageService.getValue(),
    ApiUrlStorageService.getValue(),
  ]);

  const service = AiServiceManager.getAiServiceFromName(aiPref, baseApiUrl);

  console.timeEnd('getCurrentAiService');
  return service;
}
