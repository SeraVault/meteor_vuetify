import { Meteor } from 'meteor/meteor';
import {Items} from './index.js'
import assert from 'assert'
if(Meteor.isClient){
  describe('  - Items Client API', function () {
    it("Correct exported Name", function(){
      assert(!!Items, `Incorrect exported name. Expected Items, received undefined`)
    })
  });
}



