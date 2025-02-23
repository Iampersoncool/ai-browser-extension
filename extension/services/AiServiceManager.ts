import { AiService } from '@/utils/types';
import BaseAiService from './ai/BaseAiService';
import MockAiService from './ai/MockAiService';

type AiServiceManagerServiceMap = Record<string, AiService>;

export default class AiServiceManager {
  private static serviceMap: AiServiceManagerServiceMap = Object.freeze({
    mock: new MockAiService('_placeholder_'),
    openai: new BaseAiService('openai'),
    'deepseek-r1-distill-llama-70b': new BaseAiService('deepseek'),
  });

  public static getServiceMap() {
    return this.serviceMap;
  }

  /**
   * Get a specific ai service based on their name,
   * defined as the key in serviceMap.
   *
   * @param serviceName Ex: 'deepseek' or 'openai'
   * @param baseApiUrl Ex: http://localhost:6969
   */
  public static getAiServiceFromName(
    serviceName: string,
    baseApiUrl: string
  ): AiService {
    const service = this.serviceMap[serviceName];
    if (!service) {
      throw new Error(
        `AiServiceManager getAiServiceFromName: aiService not found for service name ${serviceName} and apiUrl ${baseApiUrl}`
      );
    }

    service.setBaseApiUrl(baseApiUrl);
    return service;
  }
}
