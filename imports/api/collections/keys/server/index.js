/**
 *
 * Main Keys Collection exporter
 *
 */

import {Keys as Shared} from '../shared'
export const Keys = Shared

Meteor.startup(async function () {

  /*--------  Create Keys Indexes  --------*/

  // Keys.rawCollection().createIndexes([
  //   { bar : 1 }
  // ]);

  /*--------  Load Inital Keys  --------*/
  // if(Keys.find().count()===0){
  //   const fixtures = await import("./fixtures")
  //   const docs = fixtures.default
  //   docs.forEach(doc => Keys.insert(doc));
  // }
  
});

/*--------  publications  --------*/
import './publications'
/*--------  Server Specific Methods--------*/
import './methods'