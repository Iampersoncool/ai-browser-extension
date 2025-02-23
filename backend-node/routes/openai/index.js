import e from 'express';
import RevisionsService from '../../services/db/RevisionsService.js';
import MockAiService from '../../services/ai/MockAiService.js';

const openAiRouter = e.Router();

openAiRouter.get('/revisions', async (req, res) => {
  const revisions = await RevisionsService.getAllRevisions();
  res.json(revisions);
});

openAiRouter.post('/revisions/revise', async (req, res) => {
  try {
    const { originalText, promptText, parentId } = req.body;

    const newRevision = await RevisionsService.createRevision({
      originalText,
      responseText: await MockAiService.revise(originalText, promptText),
      parentId,
    });

    res.status(201).json(newRevision[0]);
  } catch (e) {
    console.error('error creating revision', e);
    res.status(500).json({ error: 'error creating revision' });
  }
});

openAiRouter.post('/revisions/delete', async (req, res) => {
  try {
    const { id } = req.body;

    const deletedRevision = await RevisionsService.deleteRevision(id);
    res.json(deletedRevision);
  } catch (e) {
    console.error('error deleting revision', e);
    res.status(500).json({ error: 'error deleting revision' });
  }
});

export default openAiRouter;
