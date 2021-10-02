import {Items} from './index.js'
import assert from 'assert'
if(Meteor.isServer){
  describe('Items Server API', function () {
    it("Correct exported Name", function(){
      assert(!!Items, `Incorrect exported name. Expected Items, received undefined`)
    })
  });
}



