/**
 *
 * Private Routes exporter
 * meta: {public:false}
 *
 */


/*=============================================>>>>>
=  Imports  =
===============================================>>>>>*/

// Important
// Dynamic async imports are great for production env as they are
// loaded as they are required.
// But in dev, the will not load minimongo, so you may
// want to use the classic import style:
// import SomePage from 'PagePath'

const Profile= () => import('../../../../ui/pages/profile/Profile.vue') // Dynamic async import
// import Profile from '../../../../ui/pages/profile/Profile.vue' // Use this in order to enable mongol

/*SERAVAULT BEGIN*/
const ItemList=() => import('../../../../ui/pages/items/List.vue')
const ItemEdit=() => import('../../../../ui/pages/items/Edit.vue')

const Testing=() =>  import('../../../../ui/pages/items/Test.vue')
/*SERAVAULT END*/

/*= End of Imports =*/
/*=============================================<<<<<*/


const routes = [
  {
    path:"/profile",
    name:"profile",
    meta: {
      layout:"SideBarLayout"
    },
    component:Profile
  },
  /*SERAVAULT BEGIN*/
  {
    path:"/items",
    name:"itemList",
    meta: {
      layout:"SideBarLayout"
    },
    component: ItemList
  },
  {
    path:"/items/edit/:_id?",
    name:"itemEdit",
    meta: {
      layout:"SideBarLayout"
    },
    component: ItemEdit
  },
  {
    path:"/testing",
    name:"testing",
    meta: {
      layout:"SideBarLayout"
    },
    component: Testing
  }

  /*SERAVAULT END*/
]

export default routes.map(
  route => {
    // Set meta Public property to false
    route.meta = route.meta || {}
    route.meta.public=false
    return route
  }
)