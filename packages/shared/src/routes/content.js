const express = require('express');
const EntitlementService = require('../services/entitlementService');
const { getRow, getRows } = require('../database/connection'); // Added getRows

const router = express.Router();

// Middleware to authenticate user (placeholder)
const authenticateUser = (req, res, next) => {
  // In a real application, this would involve checking JWT, session, etc.
  // For now, we'll assume user ID is passed in a header for testing.
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required.' });
  }
  req.userId = userId; // Attach user ID to request object
  next();
};

// Get all works (for product linking in admin panel)
router.get('/works', async (req, res) => {
  try {
    const works = await getRows(`
      SELECT id, title, type
      FROM works
      ORDER BY title ASC
    `);
    res.json({ works });
  } catch (error) {
    console.error('❌ Error fetching works:', error);
    res.status(500).json({
      error: 'Failed to fetch works',
      message: error.message
    });
  }
});

// Get content for a specific work (e.g., chapter, issue)
router.get('/:workId', authenticateUser, async (req, res) => {
  try {
    const { workId } = req.params;
    const { userId } = req; // From authenticateUser middleware

    // 1. Check if user is entitled to this work
    const isEntitled = await EntitlementService.checkEntitlement(userId, workId);
    if (!isEntitled) {
      return res.status(403).json({ error: 'Forbidden', message: 'You are not entitled to view this content.' });
    }

    // 2. Retrieve work details and content URLs
    const work = await getRow(`
      SELECT title, description, epub_url, pdf_url, mobi_url, sample_url
      FROM works
      WHERE id = $1
    `, [workId]);

    if (!work) {
      return res.status(404).json({ error: 'Not Found', message: 'Work not found.' });
    }

    // 3. Return content URLs (or actual content if serving directly)
    // For now, we'll return the URLs. Frontend can then decide how to display/download.
    res.json({
      title: work.title,
      description: work.description,
      content_urls: {
        epub: work.epub_url,
        pdf: work.pdf_url,
        mobi: work.mobi_url,
        sample: work.sample_url // Sample might be accessible without entitlement
      }
    });

  } catch (error) {
    console.error('❌ Error serving content:', error);
    res.status(500).json({
      error: 'Failed to retrieve content',
      message: error.message
    });
  }
});

module.exports = router;