const activitiesModel = require('../models/activitiesModel');
const usersModel = require('../models/usersModel');

async function listMyActivities(req, res) {
  const activities = await activitiesModel.listActivitiesForUser(req.user.id);
  return res.json({ activities });
}

async function createActivity(req, res) {
  const { exerciseTypeId, reps, minutes, distanceKm, photoUrl, performedAt } = req.body;
  if (!exerciseTypeId || !performedAt) {
    return res.status(400).json({ error: 'exerciseTypeId and performedAt are required' });
  }

  const activity = await activitiesModel.createActivity({
    userId: req.user.id,
    exerciseTypeId,
    reps,
    minutes,
    distanceKm,
    photoUrl,
    performedAt
  });

  return res.status(201).json({ activity });
}

async function updateActivity(req, res) {
  const id = Number(req.params.id);
  const owner = await activitiesModel.getActivityOwnership(id);
  if (!owner) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  if (owner.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: cannot edit another user activity' });
  }

  const updated = await activitiesModel.updateActivity(id, {
    exerciseTypeId: req.body.exerciseTypeId,
    reps: req.body.reps,
    minutes: req.body.minutes,
    distanceKm: req.body.distanceKm,
    photoUrl: req.body.photoUrl,
    performedAt: req.body.performedAt
  });

  return res.json({ activity: updated });
}

async function deleteActivity(req, res) {
  const id = Number(req.params.id);
  const owner = await activitiesModel.getActivityOwnership(id);
  if (!owner) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  if (owner.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: cannot delete another user activity' });
  }

  await activitiesModel.deleteActivity(id);
  return res.status(204).send();
}

async function getMySummary(req, res) {
  const summary = await activitiesModel.getSummaryForUser(req.user.id);
  return res.json({ summary });
}

async function listMyFriendsFeed(req, res) {
  const activities = await activitiesModel.listFriendsFeed(req.user.id);
  return res.json({ activities });
}

async function listFriendActivities(req, res) {
  const friendId = Number(req.params.friendId);
  const allowed = await usersModel.isFriend(req.user.id, friendId);
  if (!allowed && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: only friend activities are visible' });
  }

  const activities = await activitiesModel.listActivitiesForUser(friendId);
  return res.json({ activities });
}

module.exports = {
  listMyActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getMySummary,
  listMyFriendsFeed,
  listFriendActivities
};
