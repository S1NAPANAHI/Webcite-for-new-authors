const { supabase } = require('../supabaseClient');

const EntitlementService = {
  /**
   * Grants an entitlement to a user for a specific work.
   * @param {string} userId - The ID of the user.
   * @param {string} workId - The ID of the work (chapter/issue/arc).
   * @param {string} sourceType - 'subscription' or 'one_time_purchase'.
   * @param {string} sourceId - The ID of the subscription or product that granted the entitlement.
   * @param {Date} [expiresAt] - Optional expiration date for the entitlement.
   * @returns {Promise<object>} The created entitlement object.
   */
  grantEntitlement: async (userId, workId, sourceType, sourceId, expiresAt = null) => {
    try {
      // Check if entitlement already exists to prevent duplicates
      const existingEntitlement = await getRow(
        'SELECT id FROM entitlements WHERE user_id = $1 AND work_id = $2',
        [userId, workId]
      );

      if (existingEntitlement) {
        console.log(`Entitlement already exists for user ${userId} and work ${workId}. Skipping.`);
        return existingEntitlement; // Or update if there's a reason to refresh it
      }

      const entitlement = await insert(
        `
        INSERT INTO entitlements (user_id, work_id, source_type, source_id, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [userId, workId, sourceType, sourceId, expiresAt]
      );
      return entitlement;
    } catch (error) {
      console.error('❌ Error granting entitlement:', error);
      throw new Error('Failed to grant entitlement');
    }
  },

  /**
   * Revokes an entitlement from a user for a specific work.
   * @param {string} userId - The ID of the user.
   * @param {string} workId - The ID of the work.
   * @returns {Promise<void>}
   */
  revokeEntitlement: async (userId, workId) => {
    try {
      await remove(
        'DELETE FROM entitlements WHERE user_id = $1 AND work_id = $2',
        [userId, workId]
      );
    } catch (error) {
      console.error('❌ Error revoking entitlement:', error);
      throw new Error('Failed to revoke entitlement');
    }
  },

  /**
   * Checks if a user has an active entitlement for a specific work.
   * @param {string} userId - The ID of the user.
   * @param {string} workId - The ID of the work.
   * @returns {Promise<boolean>} True if the user has an active entitlement, false otherwise.
   */
  checkEntitlement: async (userId, workId) => {
    try {
      const entitlement = await getRow(
        `
        SELECT id FROM entitlements
        WHERE user_id = $1 AND work_id = $2
        AND (expires_at IS NULL OR expires_at > NOW())
        `,
        [userId, workId]
      );
      return !!entitlement; // Returns true if entitlement exists and is not expired
    } catch (error) {
      console.error('❌ Error checking entitlement:', error);
      throw new Error('Failed to check entitlement');
    }
  },

  /**
   * Gets all entitlements for a given user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array<object>>} List of entitlement objects.
   */
  getUserEntitlements: async (userId) => {
    try {
      const entitlements = await getRows(
        `
        SELECT e.*, w.title as work_title, w.type as work_type, w.slug as work_slug, w.cover_image_url as work_cover_image_url
        FROM entitlements e
        JOIN works w ON e.work_id = w.id
        WHERE e.user_id = $1
        AND (e.expires_at IS NULL OR e.expires_at > NOW())
        ORDER BY w.created_at DESC
        `,
        [userId]
      );
      return entitlements;
    } catch (error) {
      console.error('❌ Error getting user entitlements:', error);
      throw new Error('Failed to get user entitlements');
    }
  },

  /**
   * Gets all works associated with a specific product (e.g., all chapters in an Arc Pass).
   * This function assumes a mapping or logic to determine which works a product grants access to.
   * For a Chapter Pass, this might mean all 'published' works of a certain type.
   * For an Arc Pass, this might mean all works belonging to a specific 'arc' parent_id.
   * @param {string} productId - The ID of the product.
   * @param {string} productType - The type of the product ('chapter_pass', 'arc_pass', etc.).
   * @returns {Promise<Array<object>>} List of work objects.
   */
  getWorksForProduct: async (productId, productType) => {
    try {
      // This is a placeholder. Actual logic will depend on how products map to works.
      // For example, if a 'chapter_pass' grants access to all 'published' works of type 'chapter':
      if (productType === 'chapter_pass') {
        return await getRows(
          `SELECT * FROM works WHERE type = 'chapter' AND status = 'published'`
        );
      }
      // If an 'arc_pass' grants access to all works under a specific 'arc' parent_id:
      // This would require the product to have a reference to the arc's work_id.
      // For now, we'll return an empty array or throw an error if the logic isn't defined.
      console.warn(`Logic for getWorksForProduct for productType: ${productType} not implemented.`);
      return [];
    } catch (error) {
      console.error('❌ Error getting works for product:', error);
      throw new Error('Failed to get works for product');
    }
  }
};

module.exports = EntitlementService;