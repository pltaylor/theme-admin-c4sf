var moment = require('moment')
var uuid = require('node-uuid')
require('moment-timezone')

module.exports = {
  method: 'post',
  endpoint: '/contact',
  authenticated: true,
  roles: ['core', 'superAdmin'],
  scopes: ['user:email', 'repo', 'admin:org', 'admin:repo_hook', 'admin:org_hook'],
  middleware: [],
  controller: postContactsManage
}

function postContactsManage (req, res) {
  var Contact = req.models.Contact
  
  var mongooseQuery = {}
  //  if (!res.locals.user.isAdmin()) {
  //   //  mongooseQuery.author = res.locals.user.username
  //  }
  Contact.find(mongooseQuery, function (err, contacts) {
    if (err) console.error(err)
    contacts.forEach(function (contact) {
      var contactInfo = req.body[contact.id]
      if (contactInfo.delete) {
        contact.remove()
        return
      }
      contact.username = contactInfo.username
      contact.profile.name = contactInfo.profile.name
      contact.profile.showcontact = contactInfo.profile.showcontact
      contact.profile.contactpagerank = contactInfo.profile.contactpagerank
      contact.save(function (err) {
        if (err) throw err
      })
    })
  })
  req.flash('success', {msg: 'Success! You updated contacts.'})
  return res.redirect('/contact/edit')
}
