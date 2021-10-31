/**
 *
 * Shared Methods for Optimistic UI.
 * Usually Basic CRUD Actios
 *
 */

export const Keys = new Mongo.Collection("keys");
import assert from 'assert'
import SimpleSchema from 'simpl-schema';
import {
  upsertSchema,
  updateSchema
} from './schemas'
Meteor.methods({
  "keys.upsert"(item){
    try {      
      assert(!!item, "No Object received for upsert.")
      item.created = item.created || new Date()
      item.updated = new Date()
      item.lastUpdatedBy = Meteor.userId()
      item.createdBy =  Meteor.userId()
      item.active = item.active !== false ? true : false
      console.log(item)
      /*--------  Schema Validation  --------*/
      new SimpleSchema(upsertSchema).validate(item);

      
      /*--------  Query  --------*/
      
      const ups = Keys.upsert(
        {
          _id: item._id
        },
        item,
        {
          upsert:true
        }
      )
      return ups
    } catch (error) {
      throw new Meteor.Error('400', error);
    }
    
  },
  "keys.delete"(_id){
    try {
      assert(!!_id, "No _id received for delete.")
      const del = Keys.remove({_id})
      return del
    } catch (error) {
      throw new Meteor.Error('400', error);
    }
    
  },
  "keys.update"(item){
    try {
      assert(!!item, "No Object received for update.")
      assert(!!item._id, "No Object._id received for update.")
      const _id = item._id
      item.updated = new Date()
      item.lastUpdatedBy = Meteor.userId()
      
      /*--------  Schema Validation  --------*/
      
      new SimpleSchema(updateSchema).validate(item);

      delete(item._id)
      const upd = Keys.update(
        {
          _id
        },
        {
          $set: item
        }
      )
      return upd
    } catch (error) {
      throw new Meteor.Error('400', error);
    }
    
  }
})