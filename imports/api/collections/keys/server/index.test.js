import {Keys} from './index.js'
import assert from 'assert'
if(Meteor.isServer){
  describe('Keys Server API', function () {
    it("Correct exported Name", function(){
      assert(!!Keys, `Incorrect exported name. Expected Keys, received undefined`)
    })
  });
}



