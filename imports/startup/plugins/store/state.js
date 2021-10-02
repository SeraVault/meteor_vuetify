/**
 *
 * Vuex Initial States
 *
 */


var state = {
  loading : false,
  snack : {
    active:false,
    text:"Hello!!",
    color: "success"
  },
  confirm: {
    dialog: false,
    title:"",
    text:"",
  },
  crumbs : [],
  authenticated:false,
  auth0:undefined,
  language: Meteor.settings.public.defaultLocale,
  authentication: {
    provider: Meteor.settings.public.authentication.defaultProvider,
    meteor: {
      showAuthDialog: false,
      showResetDialog: false,
    }
  }
}

/*SERAVAULT BEGIN*/
state['privateKey'] = null
/*SERAVAULT END*/

export default state