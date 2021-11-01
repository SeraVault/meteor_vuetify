var fs = Npm.require('fs');

Meteor.methods({
  'file-upload': function (fileInfo, fileData) {
    //TODO : VERIFY USER IS LOGGED IN
     console.log("received file " + JSON.stringify(fileInfo, null, 2 ));
     fs.writeFile('/home/dguedry/tmp/files/' + fileInfo, fileData, function(error) { console.log (error)});
  }
});