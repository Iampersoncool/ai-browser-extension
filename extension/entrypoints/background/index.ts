import PromptStorageService from '@/services/storage/PromptStorageService';
import {
  createDefaultContextMenus,
  DEFAULT_PARENT_ID,
  handleContextMenuEvents,
} from './contextMenus';
import { handlePromptMessages } from './promptMessageHandler';
import MessagingService from '@/services/MessagingService';

export default defineBackground({
  type: 'module',
  main() {
    chrome.runtime.onInstalled.addListener(async () => {
      createDefaultContextMenus();

      // CREATE context menus for default prompts(or prompts that the user previously had)
      // idk if storage is saved when you uninstall
      const prompts = await PromptStorageService.getAll();
      prompts.forEach(prompt => {
        chrome.contextMenus.create({
          id: prompt.id.toString(),
          title: prompt.name,
          parentId: DEFAULT_PARENT_ID,
          contexts: ['selection'],
        });
      });
    });

    chrome.storage.onChanged.addListener(changes => {
      console.log('storage changed', changes);
    });

    handlePromptMessages();
    handleContextMenuEvents();
  },
});
