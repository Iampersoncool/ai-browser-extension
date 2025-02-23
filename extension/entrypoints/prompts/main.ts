import 'bootstrap/dist/css/bootstrap.css';

import autosize from 'autosize';

import MessagingService from '@/services/MessagingService';
import { mountPromptIn } from './prompts';

const messenger = MessagingService.getMessenger();

const newPromptBtn = document.getElementById(
  'new-prompt-btn'
) as HTMLButtonElement;

const promptsContainer = document.getElementById('prompts') as HTMLDivElement;

const delegator = new EventDelegator(promptsContainer);

delegator.addListener(
  '_delete-prompt-btn_',
  'click',
  async (e: HTMLButtonElement) => {
    const parent = e.closest<HTMLDivElement>('._parent_');
    if (!parent) return;

    await messenger.sendMessage('deletePrompt', {
      id: Number(parent.getAttribute('data-id')),
    });
    parent.remove();
  }
);

delegator.addListener(
  '_save-prompt-btn_',
  'click',
  async (e: HTMLButtonElement) => {
    const parent = e.closest<HTMLDivElement>('._parent_');
    if (!parent) return;

    const promptNameEl =
      parent.querySelector<HTMLInputElement>('._prompt-name_');
    const promptTextEl =
      parent.querySelector<HTMLTextAreaElement>('._prompt-text_');

    if (!promptNameEl || !promptTextEl) return;
    if (promptNameEl.value.trim() === '' || promptTextEl.value.trim() === '')
      return;

    await messenger.sendMessage('updatePrompt', {
      id: Number(parent.getAttribute('data-id')),
      name: promptNameEl.value,
      text: promptTextEl.value,
    });
  }
);

newPromptBtn.addEventListener('click', async e => {
  const form = newPromptBtn.closest('form');
  if (!form) return;

  const promptNameEl = form.querySelector('input');
  const promptTextEl = form.querySelector('textarea');

  if (!promptNameEl || !promptTextEl) return;
  if (promptNameEl.value.trim() === '' || promptTextEl.value.trim() === '')
    return;

  const newPrompt = await messenger.sendMessage('addPrompt', {
    name: promptNameEl.value,
    text: promptTextEl.value,
  });

  const container = mountPromptIn(promptsContainer, newPrompt);
  const textAreas = container.querySelectorAll('textarea');
  autosize(textAreas);
});

delegator.start();

(async () => {
  const prompts = await messenger.sendMessage('getPrompts', undefined);
  prompts.forEach(prompt => {
    const container = mountPromptIn(promptsContainer, prompt);

    const textAreas = container.querySelectorAll('textarea');
    autosize(textAreas);
  });
})();
