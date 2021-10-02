/**
 *
 * Main Items Collection exporter
 *
 */

import {Items as Shared} from '../shared'
export const Items = Shared

Meteor.startup(async function () {

  /*--------  Create Items Indexes  --------*/

  // Items.rawCollection().createIndexes([
  //   { bar : 1 }
  // ]);

  /*--------  Load Inital Items  --------*/
  // if(Items.find().count()===0){
  //   const fixtures = await import("./fixtures")
  //   const docs = fixtures.default
  //   docs.forEach(doc => Items.insert(doc));
  // }
  
});

/*--------  publications  --------*/
import './publications'
/*--------  Server Specific Methods--------*/
import './methods'