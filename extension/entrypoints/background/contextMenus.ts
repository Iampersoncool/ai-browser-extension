import MessagingService from '@/services/MessagingService';
import PromptStorageService from '@/services/storage/PromptStorageService';

export const DEFAULT_PARENT_ID = 'parent';

export function createDefaultContextMenus() {
  chrome.contextMenus.create({
    id: DEFAULT_PARENT_ID,
    title: 'AI',
    contexts: ['selection'],
  });
}

export function handleContextMenuEvents() {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.windowId) return;
    if (!info.selectionText) return;

    await chrome.sidePanel.open({ windowId: tab.windowId });

    const prompt = await PromptStorageService.get(Number(info.menuItemId));
    if (!prompt) return;

    const aiService = await getCurrentAiService();
    if (!aiService) return;

    // parentId should be null because we want to add a new prompt
    // in the root which we can then revise later in the ui.
    const newRevision = await aiService.revise(
      prompt.text,
      info.selectionText,
      null
    );

    MessagingService.getMessenger().sendMessage('revisionAdded', newRevision);
  });
}
