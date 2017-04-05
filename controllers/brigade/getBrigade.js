const npmSearch = require('npm-module-search')

/**
 *  Exports
 */

module.exports = {
  method: 'get',
  endpoint: '/brigade',
  authenticated: true,
  roles: ['core', 'superAdmin'],
  scopes: ['user:email', 'repo', 'admin:org', 'admin:repo_hook', 'admin:org_hook'],
  middleware: [],
  controller: getBrigade
}

/**
 *  Controller
 */
function getBrigade (req, res) {
  npmSearch.search('brigadehub-admin', { limit: 100 }, function (err, adminModules) {
    if (err) console.error(err)
    npmSearch.search('brigadehub-public', { limit: 100 }, function (err, publicModules) {
      if (err) console.error(err)
      var brigadeModel = res.locals.brigade
      var containsMain = false
      for (var i = 0, len = brigadeModel.sponsors.length; i < len; i++) {
        if (brigadeModel.sponsors[i].main === true) {
          containsMain = true
        }
      }
      brigadeModel.ContainsMainSponsor = containsMain
      res.render(res.theme.admin + '/views/brigade', {
        view: 'brigade-manage',
        title: 'Brigade',
        brigade: brigadeModel,
        publicModules,
        adminModules
      })
    })
  })
}
