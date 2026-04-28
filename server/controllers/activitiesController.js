const activitiesModel = require('../models/activitiesModel');
const exerciseTypesModel = require('../models/exerciseTypesModel');
const usersModel = require('../models/usersModel');
const socialModel = require('../models/socialModel');

const DEFAULT_ACTIVITY_PHOTOS = {
  'Push-ups': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVzaCUyMHVwfGVufDB8fDB8fHww',
  Squats: 'https://plus.unsplash.com/premium_photo-1661906824628-3ac1f6c4ce1c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3F1YXRzfGVufDB8fDB8fHww',
  Plank: 'https://plus.unsplash.com/premium_photo-1672352100050-65cb2ee4d818?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGxhbmt8ZW58MHx8MHx8fDA%3D',
  Running: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJ1bm5pbmd8ZW58MHx8MHx8fDA%3D',
  Cycling: 'https://plus.unsplash.com/premium_photo-1713184149461-69b0abeb3daa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3ljbGluZ3xlbnwwfHwwfHx8MA%3D%3D',
  'Jump Rope': 'https://plus.unsplash.com/premium_photo-1664299555455-3e0a5542d3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8anVtcCUyMHJvcGV8ZW58MHx8MHx8fDA%3D',
  Other: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdvcmtvdXR8ZW58MHx8MHx8fDA%3D'
};

async function listMyActivities(req, res) {
  const activities = await activitiesModel.listActivitiesForUser(req.user.id);
  if (activities.length) {
    const ids = activities.map(a => a.id);
    const [likesMap, commentsMap] = await Promise.all([
      socialModel.getLikesForActivities(ids),
      socialModel.getCommentsForActivities(ids)
    ]);
    for (const activity of activities) {
      const likedUserIds = likesMap[activity.id] || [];
      activity.likeCount = likedUserIds.length;
      activity.likedByMe = likedUserIds.includes(req.user.id);
      activity.comments = commentsMap[activity.id] || [];
    }
  }
  return res.json({ activities });
}

async function resolveExerciseType(exerciseTypeId) {
  const id = Number(exerciseTypeId);
  if (!id) {
    return null;
  }

  return exerciseTypesModel.findExerciseTypeById(id);
}

async function createActivity(req, res) {
  const { exerciseTypeId, reps, minutes, distanceKm, photoUrl, performedAt } = req.body;
  if (!exerciseTypeId || !performedAt) {
    return res.status(400).json({ error: 'exerciseTypeId and performedAt are required' });
  }

  const exerciseType = await resolveExerciseType(exerciseTypeId);
  if (!exerciseType) {
    return res.status(404).json({ error: 'Exercise type not found' });
  }

  const activity = await activitiesModel.createActivity({
    userId: req.user.id,
    exerciseTypeId: exerciseType.id,
    reps,
    minutes,
    distanceKm,
    photoUrl: photoUrl || DEFAULT_ACTIVITY_PHOTOS[exerciseType.name] || null,
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

  let exerciseType = null;
  if (req.body.exerciseTypeId !== undefined) {
    exerciseType = await resolveExerciseType(req.body.exerciseTypeId);
    if (!exerciseType) {
      return res.status(404).json({ error: 'Exercise type not found' });
    }
  }

  const updated = await activitiesModel.updateActivity(id, {
    exerciseTypeId: req.body.exerciseTypeId,
    reps: req.body.reps,
    minutes: req.body.minutes,
    distanceKm: req.body.distanceKm,
    photoUrl:
      req.body.photoUrl !== undefined
        ? req.body.photoUrl
        : exerciseType
          ? DEFAULT_ACTIVITY_PHOTOS[exerciseType.name] || null
          : undefined,
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

async function getMyInsights(req, res) {
  const insights = await activitiesModel.getInsightsForUser(req.user.id);
  return res.json(insights);
}

async function listMyFriendsFeed(req, res) {
  const activities = await activitiesModel.listFriendsFeed(req.user.id);
  if (activities.length) {
    const ids = activities.map(a => a.id);
    const [likesMap, commentsMap] = await Promise.all([
      socialModel.getLikesForActivities(ids),
      socialModel.getCommentsForActivities(ids)
    ]);
    for (const activity of activities) {
      const likedUserIds = likesMap[activity.id] || [];
      activity.likeCount = likedUserIds.length;
      activity.likedByMe = likedUserIds.includes(req.user.id);
      activity.comments = commentsMap[activity.id] || [];
    }
  }
  return res.json({ activities });
}

async function listFriendActivities(req, res) {
  const friendId = Number(req.params.friendId);
  if (!friendId) {
    return res.status(400).json({ error: 'friendId must be a valid user id' });
  }

  if (friendId === req.user.id) {
    const activities = await activitiesModel.listActivitiesForUser(friendId);
    return res.json({ activities });
  }

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
  getMyInsights,
  listMyFriendsFeed,
  listFriendActivities
};
