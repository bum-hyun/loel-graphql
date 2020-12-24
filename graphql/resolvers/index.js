const userResolvers = require('./user');
const postResolvers = require('./post');
const commentResolvers = require('./comment');
const categoryResolvers = require('./category');

module.exports = [userResolvers, postResolvers, commentResolvers, categoryResolvers];
