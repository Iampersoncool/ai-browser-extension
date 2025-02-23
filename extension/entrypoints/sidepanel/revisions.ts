import { Revision, RevisionNode } from '@/utils/types';
import { el, mount } from 'redom';

const INDENT_SCALE_FACTOR = 2;

export function revisionsToTree(revisions: Revision[]): RevisionNode[] {
  const tree: RevisionNode[] = [];
  const map = new Map<number, RevisionNode>();

  revisions.forEach(revision => {
    const node: RevisionNode = { ...revision, revisions: [] };
    map.set(revision.id, node);
  });

  map.forEach(revision => {
    if (!revision.parentId) {
      tree.push(revision);
    } else {
      if (!map.get(revision.parentId))
        console.warn(
          `revision with parent id of ${revision.parentId} not found.`
        );
      map.get(revision.parentId)?.revisions.push(revision);
    }
  });

  return tree;
}

export function loadRevisionsInto<C extends HTMLElement>(
  container: C,
  revisions: RevisionNode[],
  indentLevel = 0
): C {
  console.log('Loading revisions, indentLevel =', indentLevel);

  for (const revision of revisions) {
    const marginStyle = `margin-left: ${
      indentLevel > 0 ? INDENT_SCALE_FACTOR : 0
    }rem;`;

    const card = el(
      'div.card.d-flex.flex-column.gap-3',
      { style: marginStyle, 'data-id': revision.id },
      el('div.card-body', [
        el('p.card-title.fw-bold.h4', 'Original Text'),
        el('p.card-text', revision.originalText),
        el('p.card-title.fw-bold.h4', 'AI Response'),
        el('p.card-text._response-text_', revision.responseText),
        el('button.btn.btn-danger._delete-btn_', 'Delete'),
      ])
    );

    const nextRevisions = revision.revisions;
    if (nextRevisions.length > 0) {
      loadRevisionsInto(card, nextRevisions, indentLevel + 1);
    } else {
      mount(
        card,
        el('details', [
          el('summary.p-2', 'Extras'),
          el('div.d-flex.flex-column.p-2.gap-3', [
            el('textarea.form-control'),
            el('button.btn.btn-primary._revise-btn_', 'Revise'),
          ]),
        ])
      );
    }

    mount(container, card);
  }

  return container;
}
