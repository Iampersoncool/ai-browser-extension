import MessagingService from '@/services/MessagingService';
import { DEFAULT_PARENT_ID } from './contextMenus';
import PromptStorageService from '@/services/storage/PromptStorageService';

export function handlePromptMessages() {
  const messenger = MessagingService.getMessenger();

  messenger.onMessage('getPrompts', () => PromptStorageService.getAll());

  messenger.onMessage('addPrompt', async message => {
    const newPrompt = await PromptStorageService.add({
      name: message.data.name,
      text: message.data.text,
    });

    chrome.contextMenus.create({
      id: newPrompt.id.toString(),
      parentId: DEFAULT_PARENT_ID,
      title: newPrompt.name,
      contexts: ['selection'],
    });

    return newPrompt;
  });

  messenger.onMessage('updatePrompt', async message => {
    const { id, name, text } = message.data;
    const updatedPrompt = await PromptStorageService.edit(id, {
      name,
      text,
    });
    chrome.contextMenus.update(updatedPrompt.id.toString(), {
      title: updatedPrompt.name,
    });
    return updatedPrompt;
  });

  messenger.onMessage('deletePrompt', async message => {
    const removedPrompt = await PromptStorageService.delete(message.data.id);
    chrome.contextMenus.remove(removedPrompt.id.toString());

    return removedPrompt;
  });
}
