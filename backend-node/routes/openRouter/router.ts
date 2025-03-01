import zodValidator from '@/middleware/zodValidator.js';
import RevisionRepository from '@/repositories/RevisionRepository.js';
import OpenRouterRevisionService from '@/services/revisions/OpenRouterRevisionService.js';
import { Hono } from 'hono';
import { z } from 'zod';

const openRouterRouter = new Hono()
  .get('/revisions', async c => {
    const revisions = await RevisionRepository.findMany();
    return c.json(revisions);
  })
  .post(
    '/revisions/revise',
    zodValidator(
      'json',
      z.object({
        model: z.string(),
        promptText: z.string(),
        originalText: z.string(),
        parentId: z.number().nullable(),
      })
    ),
    async c => {
      const { model, originalText, promptText, parentId } = c.req.valid('json');

      const responseText = await OpenRouterRevisionService.revise(
        model,
        originalText,
        promptText
      );

      const newRevision = await RevisionRepository.add({
        model,
        originalText,
        responseText,
        parentId,
      });

      return c.json(newRevision);
    }
  )
  .post(
    '/revisions/delete',
    zodValidator('json', z.object({ id: z.number() })),
    async c => {
      const { id } = c.req.valid('json');
      const deletedRevision = await RevisionRepository.deleteById(id);

      return c.json(deletedRevision);
    }
  );

export default openRouterRouter;
