import assert from 'assert';
import {Items} from './index.js';
if(Meteor.isServer){
  describe('  - Items Server Methods API', function () {

    afterEach(function () {
      Items.remove({test:true})
    });

   
    it('upsert success', async function () {
  
      const name = "templateMock"
      /*--------  Insert  --------*/
      let templateId = Meteor.call(
        "items.upsert", 
        {
          name,
          active:false,
          test:true
        }
      )
  
      assert(templateId, `Error inserting document, no document inserted`)
      assert(templateId.insertedId, `Error inserting document, insertedId obtained ${templateId.insertedId}`)
      let added = Items.find({ _id: templateId.insertedId });
      const collectionName = added._getCollectionName();
  
      assert(collectionName=='items', `Wrong collection, expected items, ${collectionName} instead`);
      const count = added.count()
      added = added.fetch()
      assert(count==1, `Inserting template Error, expecting 1 inserted Doc, received ${count}`);
      assert(added[0].name==name, `Inserted document must have name ${name}. Received ${added[0].name} instead`);
  
      
      /*--------  Update  --------*/
  
      Meteor.call(
        "items.upsert",
        {
          _id: templateId.insertedId,
          name: `updated-${name}`,
          test:true
        }
      )
  
      let updated = Items.find({ _id: templateId.insertedId });
      const updatedCount = updated.count()
      assert(updatedCount==1, `Updating items Error, inserted ${updatedCount} docs instead of 1`);
      updated = updated.fetch()
      assert(updated[0].name==`updated-${name}`, `Updated document must have name updated-${name}. Received ${updated[0].name} instead`);
    });

    it('upsert Error, No object received', async function () {
  
  
      /*--------  Insert  --------*/

      try {
        Meteor.call(
          "items.upsert", 
          undefined
        )
      } catch (error) {
        assert(error.error=="400", `Error expected: 400, obtained ${error.code}`) 
        assert(error.message=="AssertionError [ERR_ASSERTION]: No Object received for upsert. [400]") 
      }
    });

    it('update success', async function () {
  
      const name = "templateMock"
      const templateDoc = {
        name,
        test:true
      };
  
      /*--------  Update  --------*/
  
      const insertedId = Items.insert(templateDoc)
  
      Meteor.call(
        "items.update",
        {
          _id: insertedId,
          name: `updated-${name}`,
          test:true
        }
      )
  
      let updated = Items.find({ _id: insertedId });
      const updatedCount = updated.count()
      assert(updatedCount==1, `Updating items Error, inserted ${updatedCount} docs instead of 1`);
      updated = updated.fetch()
      assert(updated[0].name==`updated-${name}`, `Updated document must have name updated-${name}. Received ${updated[0].name} instead`);
      assert(updated[0].test==true, `Updated document must have prop test true . Received ${updated[0].test} instead`);
  
    });

    it('update Error. No object received', async function () {
  
      /*--------  Update  --------*/
      try {
        Meteor.call(
          "items.update",
          undefined
        )
      } catch (error) {
        assert(error.error=="400", `Error expected: 400, obtained ${error.code}`) 
        assert(error.message=="AssertionError [ERR_ASSERTION]: No Object received for update. [400]") 
      }
  
      
    });
    it('update Error. No object_id received', async function () {
  
      /*--------  Update  --------*/
      try {
        Meteor.call(
          "items.update",
          {
            name:"mocked"
          }
        )
      } catch (error) {
        assert(error.error=="400", `Error expected: 400, obtained ${error.code}`) 
        assert(error.message=="AssertionError [ERR_ASSERTION]: No Object._id received for update. [400]") 
      }
    });
  
    it('delete success', async function () {
  
      const name = "templateMock"
      const templateDoc = {
        name,
        test:true
      };
  
      /*--------  Insert  --------*/
  
      const insertedId = Items.insert(templateDoc)
      let removed = await Meteor.call(
        "items.delete",
        insertedId
      )
      assert(removed==1, `Doc not removed, expecting 1 doc removed, obtained ${removed}`)
  
    });
  
    it('delete Error. No id provided', async function () {
  
      /*--------  Delete  --------*/

      try {
        Meteor.call(
          "items.delete", 
          undefined
        )
      } catch (error) {
        assert(error.error=="400", `Error expected: 400, obtained ${error.code}`) 
        assert(error.message=="AssertionError [ERR_ASSERTION]: No _id received for delete. [400]") 
      }
    });
  });
}