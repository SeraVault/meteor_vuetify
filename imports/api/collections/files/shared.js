import { FilesCollection } from 'meteor/ostrio:files';

export const Files = new FilesCollection({
  collectionName: 'Files',
  allowClientCode: true, // Disallow remove files from Client
  storagePath: '/home/dguedry/tmp/files',
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    /*if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';*/
    return true
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.get.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.get.all', function () {
    return Files.find().cursor;
  });
}