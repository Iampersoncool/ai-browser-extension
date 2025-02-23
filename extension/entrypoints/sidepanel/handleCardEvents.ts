import EventDelegator, { EventDelegatorEventMap } from '@/utils/EventDelegator';
import { loadRevisionsInto } from './revisions';
import { getCurrentAiService } from '@/utils/aiServices';

export default function handleCardEvents<
  K extends EventDelegatorEventMap,
  E extends HTMLElement
>(delegator: EventDelegator<K, E>) {
  delegator.addListener(
    '_revise-btn_',
    'click' as K,
    async (button: HTMLButtonElement) => {
      const card = button.closest<HTMLElement>('.card');
      if (!card) return;

      const responseTextEl =
        card.querySelector<HTMLParagraphElement>('._response-text_');
      if (!responseTextEl || !responseTextEl.textContent) return;

      const textAreaEl = card.querySelector<HTMLTextAreaElement>('textarea');
      if (!textAreaEl) return;

      button.disabled = true;

      const aiService = await getCurrentAiService();

      const newRevision = await aiService.revise(
        textAreaEl.value,
        responseTextEl.textContent,
        Number(card.getAttribute('data-id'))
      );

      loadRevisionsInto(card, [{ ...newRevision, revisions: [] }], 1);
    }
  );

  delegator.addListener(
    '_delete-btn_',
    'click' as K,
    async (button: HTMLButtonElement) => {
      button.disabled = true;

      const card = button.closest('.card');
      if (!card) return;

      const aiService = await getCurrentAiService();

      await aiService.delete(Number(card.getAttribute('data-id')));
      card.remove();
    }
  );
}
