const socialModel = require('../models/socialModel');
const activitiesModel = require('../models/activitiesModel');

// ── Helpers ───────────────────────────────────────────────────────────────────

async function resolveActivity(activityId) {
  const id = Number(activityId);
  if (!id) return null;
  return activitiesModel.findActivityById(id);
}

// ── Likes ─────────────────────────────────────────────────────────────────────

async function toggleLike(req, res) {
  const activityId = Number(req.params.activityId);
  if (!activityId) return res.status(400).json({ error: 'Invalid activityId' });

  const activity = await resolveActivity(activityId);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });

  const alreadyLiked = await socialModel.hasUserLiked(activityId, req.user.id);
  if (alreadyLiked) {
    await socialModel.removeLike(activityId, req.user.id);
  } else {
    await socialModel.addLike(activityId, req.user.id);
  }

  const likeCount = await socialModel.getLikeCount(activityId);
  const liked = !alreadyLiked;
  return res.json({ liked, likeCount });
}

// ── Comments ──────────────────────────────────────────────────────────────────

async function listComments(req, res) {
  const activityId = Number(req.params.activityId);
  if (!activityId) return res.status(400).json({ error: 'Invalid activityId' });

  const activity = await resolveActivity(activityId);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });

  const comments = await socialModel.getCommentsForActivity(activityId);
  return res.json({ comments });
}

async function addComment(req, res) {
  const activityId = Number(req.params.activityId);
  if (!activityId) return res.status(400).json({ error: 'Invalid activityId' });

  const { body } = req.body;
  if (!body || !String(body).trim()) {
    return res.status(400).json({ error: 'Comment body is required' });
  }

  const activity = await resolveActivity(activityId);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });

  const comment = await socialModel.addComment(activityId, req.user.id, String(body).trim());
  return res.status(201).json({ comment });
}

async function deleteComment(req, res) {
  const commentId = Number(req.params.commentId);
  if (!commentId) return res.status(400).json({ error: 'Invalid commentId' });

  const comment = await socialModel.findCommentById(commentId);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  if (comment.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await socialModel.deleteComment(commentId);
  return res.status(204).send();
}

module.exports = { toggleLike, listComments, addComment, deleteComment };
