const express = require('express');
const generateSitemap = require('../utils/sitemap');

const router = express.Router();

router.get('/posts.xml', (req, res) => {
  generateSitemap().then((sitemap) => {
    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
  })
});


module.exports = router;
