const express = require('express');

function createAdminRoutes(supabase) {
  const router = express.Router();

  router.get('/test', async (req, res) => {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .limit(5);

    if (error) return res.status(500).json({ error });
    res.json({ message: 'Admin route works!', data });
  });

  return router;
}

module.exports = createAdminRoutes;