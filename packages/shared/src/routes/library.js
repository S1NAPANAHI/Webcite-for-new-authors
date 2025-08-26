const express = require('express');
const EntitlementService = require('../services/entitlementService');
const { getRow, insert, update } = require('../database/connection'); // Assuming getRow is needed for user validation

const router = express.Router();

// Middleware to check if the requesting user is the owner of the library or an admin
const authorizeUserLibraryAccess = async (req, res, next) => {
  const { userId } = req.params;
  // In a real application, you'd get the authenticated user's ID from req.user or similar
  const authenticatedUserId = req.headers['x-user-id']; // Placeholder: Replace with actual auth mechanism

  if (!authenticatedUserId) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required.' });
  }

  if (authenticatedUserId !== userId) {
    // Check if the authenticated user is an admin
    // This assumes you have a way to get user roles, e.g., from a users table or auth service
    const userProfile = await getRow('SELECT role FROM profiles WHERE id = $1', [authenticatedUserId]);
    if (!userProfile || userProfile.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied.' });
    }
  }
  next();
};

// Get user's entitlements (library items)
router.get('/:userId/entitlements', authorizeUserLibraryAccess, async (req, res) => {
  try {
    const { userId } = req.params;
    const entitlements = await EntitlementService.getUserEntitlements(userId);
    res.json({ entitlements });
  } catch (error) {
    console.error('❌ Error fetching user entitlements:', error);
    res.status(500).json({
      error: 'Failed to fetch user entitlements',
      message: error.message
    });
  }
});

// Mark a work as read/finished (or update last_read_chapter)
router.post('/:userId/library/:workId/progress', authorizeUserLibraryAccess, async (req, res) => {
  try {
    const { userId, workId } = req.params;
    const { last_read_chapter, is_finished } = req.body;

    // Check if the user has an entitlement to this work
    const hasEntitlement = await EntitlementService.checkEntitlement(userId, workId);
    if (!hasEntitlement) {
      return res.status(403).json({ error: 'Forbidden', message: 'User is not entitled to this work.' });
    }

    // Update user_library_items table
    // This assumes user_library_items already exists and has user_id, work_id, last_read_chapter, is_finished
    const updatedLibraryItem = await update(`
      UPDATE user_library_items
      SET last_read_chapter = COALESCE($1, last_read_chapter),
          is_finished = COALESCE($2, is_finished),
          updated_at = NOW()
      WHERE user_id = $3 AND work_id = $4
      RETURNING *
    `, [last_read_chapter, is_finished, userId, workId]);

    if (!updatedLibraryItem) {
      // If no existing library item, create one (e.g., if user just got entitlement and is reading for first time)
      // This might be redundant if entitlements are always created with a corresponding library item,
      // but it's good to handle the case where progress is tracked separately.
      const newLibraryItem = await insert(`
        INSERT INTO user_library_items (user_id, work_id, last_read_chapter, is_finished)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [userId, workId, last_read_chapter || 0, is_finished || false]);
      return res.json({ libraryItem: newLibraryItem, message: 'Library item created and progress updated.' });
    }

    res.json({ libraryItem: updatedLibraryItem, message: 'Progress updated successfully.' });

  } catch (error) {
    console.error('❌ Error updating user library progress:', error);
    res.status(500).json({
      error: 'Failed to update user library progress',
      message: error.message
    });
  }
});

module.exports = router;