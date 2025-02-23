import { ProtocolMap } from '@/utils/types';
import {
  defineExtensionMessaging,
  ExtensionMessenger,
} from '@webext-core/messaging';

export default class MessagingService {
  private static messenger: ExtensionMessenger<ProtocolMap> =
    defineExtensionMessaging<ProtocolMap>();

  static getMessenger() {
    return MessagingService.messenger;
  }
}
