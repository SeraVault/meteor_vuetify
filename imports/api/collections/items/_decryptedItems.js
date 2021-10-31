import { Tracker } from 'meteor/tracker'
import { Items } from './_client'
import sv from '../../../ui/mixins/seravault/encryption'
import store from '../../../startup/plugins/store'

export var DecryptedItems = new Mongo.Collection(null);

/*Meteor.startup(function() {
  var now = new Date();
  Items.find().observe({
    added: async function(item){
      var privateKey = await sv.getUserPrivateKeyObject(store.state.privateKey)
      DecryptedItems.insert(await sv.decryptItem(item, privateKey))
      console.log('groups observe added value function');
    },
    changed: async function(item){
      var privateKey = await sv.getUserPrivateKeyObject(store.state.privateKey)
      DecryptedItems.update(await sv.decryptItem(item, privateKey))
      console.log('groups observe changed value function');
    },
    removed:function(document){
      console.log('groups observe removed value function');
    }
  });
})*/


export var ItemsDecrypted = new Mongo.Collection(null);
Tracker.autorun(async function() {
  var items = Items.find()
  ItemsDecrypted.remove({});
  var privateKey = await sv.getUserPrivateKeyObject(store.state.privateKey)
  items.forEach(async function(data) {
    try {        
      var item = await sv.decryptItem(item, privateKey);
      ItemsDecrypted.insert(item);
    } catch(err) {
      console.log(err)
      console.log(data)
    }
  })
});
