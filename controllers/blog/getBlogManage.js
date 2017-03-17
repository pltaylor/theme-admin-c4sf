/**
 *  Exports
 */

module.exports = {
  method: 'get',
  endpoint: '/blog/manage',
  authenticated: true,
  roles: ['core', 'superAdmin', 'coreLead', 'blog', 'lead'],
  middleware: [],
  controller: getBlogManage
}

/**
 *  Controller
 */

function getBlogManage (req, res) {
  var Post = req.models.Posts
  var User = req.models.Users
  var mongooseQuery = {}
  if (!res.locals.user.isAdmin()) {
    mongooseQuery.author = res.locals.user.username
  }
  Post.find(mongooseQuery, function (err, posts) {
    if (err) console.error(err)
    posts.reverse() // so that most recent are first
    User.find({}, function (err, users) {
      if (err) console.log(err)
      var usernames = users.map(function (user) { return user.username })
      res.render(res.theme.admin + '/views/blog/manage', {
        view: 'blog-list-manage',
        title: 'Manage Blog',
        brigade: res.locals.brigade,
        posts: posts,
        usernames: usernames
      })
    })
  })
}
