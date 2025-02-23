import 'bootstrap/dist/css/bootstrap.css';

import {
  loadRevisionsInto,
  revisionsToTree,
} from '@/entrypoints/sidepanel/revisions';
import EventDelegator from '@/utils/EventDelegator';
import handleCardEvents from './handleCardEvents';
import ApiUrlStorageService from '@/services/storage/ApiUrlStorageService';
import AiServiceManager from '@/services/AiServiceManager';
import AiPrefStorageService from '@/services/storage/AiPrefStorageService';
import { el, mount } from 'redom';
import MessagingService from '@/services/MessagingService';

console.time('BOOTSTRAPPING');

const baseApiUrlInputEl = document.getElementById(
  'base-api-url'
) as HTMLInputElement;

const aiPrefChooserEl = document.getElementById(
  'ai-pref-chooser'
) as HTMLSelectElement;

const revisionsContainer = document.getElementById(
  'revisions'
) as HTMLDivElement;

(async () => {
  const [aiPref, baseApiUrl] = await Promise.all([
    AiPrefStorageService.getValue(),
    ApiUrlStorageService.getValue(),
  ]);

  baseApiUrlInputEl.value = baseApiUrl;
  baseApiUrlInputEl.addEventListener('change', e => {
    const inputEl = e.target as HTMLInputElement;
    if (inputEl.value.trim() === '') return;

    ApiUrlStorageService.setValue(inputEl.value);
  });

  for (const serviceName of Object.keys(AiServiceManager.getServiceMap())) {
    mount(aiPrefChooserEl, el('option', { value: serviceName }, serviceName));
  }
  aiPrefChooserEl.value = aiPref;

  aiPrefChooserEl.addEventListener('change', e => {
    const selectEl = e.target as HTMLSelectElement;
    AiPrefStorageService.setValue(selectEl.value);
  });

  const aiService = AiServiceManager.getAiServiceFromName(aiPref, baseApiUrl);

  const delegator = new EventDelegator(revisionsContainer);
  handleCardEvents(delegator);
  delegator.start();

  MessagingService.getMessenger().onMessage('revisionAdded', message => {
    const newRevision = message.data;
    if (!newRevision.parentId) {
      loadRevisionsInto(revisionsContainer, [
        { ...newRevision, revisions: [] },
      ]);
      return;
    }

    // this code probably is not needed because the parentId will always be null
    // whenever the context menu gets clicked and this event gets fired
    // since it is always a root revision. Just gonna leave it here
    // anyways
    const card = document.querySelector<HTMLDivElement>(
      `[data-id=${newRevision.parentId}]`
    );
    if (!card) return;

    loadRevisionsInto(card, [{ ...newRevision, revisions: [] }]);
  });

  loadRevisionsInto(
    revisionsContainer,
    revisionsToTree(await aiService.getRevisions())
  );
})();

console.timeEnd('BOOTSTRAPPING');
