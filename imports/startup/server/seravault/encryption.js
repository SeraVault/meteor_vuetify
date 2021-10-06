Meteor.methods({
  storeKeys: function (privateKeyCipher, publicKey, encMasterKey, sharingCode, plan, displayName) {
    var diskSize = 0;
    switch(plan) {
      case 'free':
      diskSize = 536870912;  // 0.5 gigabyte
      break;
    };
    console.log('privateKeyCipher', privateKeyCipher)
    Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        'profile.privateKeyCipher': privateKeyCipher,        
        'profile.publicKey': publicKey,
        'profile.encMasterKey': encMasterKey,       
        'profile.sharing_code': sharingCode,
        'profile.disk_size': diskSize,
        'profile.displayName': displayName
      }
    });
  },
  updatePrivateKey: function(privateKeyCipher, passwordBytes, nonce) {
    Meteor.users.update({_id: this.userId}, {
      $set: {
        'profile.privateKeyCipher': privateKeyCipher,
        'profile.nonce': nonce,
        'profile.passwordBytes': passwordBytes,
      }
    })
  },
  checkSharingCode: function(code) {
    if (Meteor.users.find({'profile.sharing_code': code}).count() > 0) {
      return false
    }
    return true;
  },
})