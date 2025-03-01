import zodValidator from '@/middleware/zodValidator.js';
import RevisionRepository from '@/repositories/RevisionRepository.js';
import OllamaRevisionService from '@/services/revisions/OllamaRevisionService.js';
import { Hono } from 'hono';
import { z } from 'zod';

const ollamaRouter = new Hono()
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

      const responseText = await OllamaRevisionService.revise(
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

export default ollamaRouter;
