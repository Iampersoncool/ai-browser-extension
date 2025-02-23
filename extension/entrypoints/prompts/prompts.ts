import { Prompt } from '@/utils/types';
import { el, mount } from 'redom';

export function mountPromptIn(container: HTMLElement, prompt: Prompt) {
  return mount(
    container,
    el(
      'div.col._parent_',
      { 'data-id': prompt.id },
      el(
        'div.card',
        el('div.card-body', [
          el('input.form-control.card-title._prompt-name_', {
            value: prompt.name,
            placeholder: 'prompt name',
          }),
          el('textarea.form-control._prompt-text_', {
            value: prompt.text,
            placeholder: 'prompt text',
          }),
          el('div.d-flex.gap-2.mt-2', [
            el('button.btn.btn-success._save-prompt-btn_', 'Save'),
            el('button.btn.btn-danger._delete-prompt-btn_', 'Delete'),
          ]),
        ])
      )
    )
  );
}
