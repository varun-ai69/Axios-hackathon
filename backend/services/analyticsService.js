const UserAnalytics = require("../models/userAnalytics");

/**
 * Update user query count analytics
 */
async function updateUserQueryCount(userId) {
  try {
    await UserAnalytics.findOneAndUpdate(
      { userId },
      { $inc: { queriesCount: 1 } }
    );
  } catch (error) {
    console.error("Failed to update user query count:", error);
  }
}

/**
 * Get user analytics data
 */
async function getUserAnalytics(userId) {
  try {
    return await UserAnalytics.findOne({ userId });
  } catch (error) {
    console.error("Failed to get user analytics:", error);
    return null;
  }
}

module.exports = {
  updateUserQueryCount,
  getUserAnalytics
};
