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
  var Contact = req.models.Users

  var mongooseQuery = {}

  Contact.find(mongooseQuery, function (err, contacts) {
    if (err) console.error(err)
    contacts.forEach(function (contact) {
      var contactInfo = req.body[contact.username]
      if(!contactInfo.showcontact){
        contact.profile.showcontact = false
      }
      else{
        contact.profile.showcontact = true
      }
      contact.profile.contactpagerank = contactInfo.contactrank
      contact.save(function (err) {
        if (err) throw err
      })
    })
  })
  req.flash('success', {msg: 'Success! You updated contacts.'})
  return res.redirect('contact/edit')
}
