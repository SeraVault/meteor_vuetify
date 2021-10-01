import { Meteor } from 'meteor/meteor';
import {Keys} from './index.js'
import assert from 'assert'
if(Meteor.isClient){
  describe('  - Keys Client API', function () {
    it("Correct exported Name", function(){
      assert(!!Keys, `Incorrect exported name. Expected Keys, received undefined`)
    })
  });
}



