/**
 *
 * Client Specific methods for Items Collection
 *
 */

// Meteor.methods({
//   "items.someMethod"(){
//     /* Do anything here*/
//     return
//   }
// })

/*SERAVAULT BEGIN*/
import sv from '../../../../ui/mixins/seravault/encryption'
import { Items } from '../shared'
Meteor.methods({
  "client.item.upsert"(item) {
    if (!item._id) {
     //encryption.encryptItemAES(item)
    }
    const ups = Items.upsert(
      {
        _id: item._id
      },
      item,
      {
        upsert:true
      }
    )
    return ups
  }
})

clientItemUpsert = function (item) {
  item.created = item.created || new Date()
  item.updated = new Date()
  item.lastUpdatedBy = Meteor.userId()
  item.createdBy =  Meteor.userId()
  
  sv.encryptItem(item, this.$store.state.privateKey)
  
  Items.upsert(item)
}

export default clientItemUpsert

/*SERAVAULT END*/
