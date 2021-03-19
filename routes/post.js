const express = require('express');
const { Post } = require('../database/models');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const data = await Post.findByPk(req.params.id);
  res.status(200).json(data)
});

router.get('/', async (req, res) => {
  const data = await Post.findAll({
    attributes: {
      exclude: ["deletedAt"],
    },
    order: [['createdAt', 'DESC']],
    offset: 0,
    limit: 24
  });
  res.status(200).json(data)
});


module.exports = router;
