<template lang="html">
  <v-row>

    <v-col cols="12">
      <v-row>
        <v-form ref="changePassphrase">
          <v-card cols="6" sm="12" @keyup.native.enter="updatePassphrase">
            <v-card-title>
              Change passphrase
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="oldPassphrase" :label="$t('seravault.profile.changePassphrase.oldPassphrase')" required :rules="[notEmpty]"
                prepend-icon="mdi-face" />

              <v-text-field v-model="newPassphrase" :label="$t('seravault.profile.changePassphrase.newPassphrase')" required :rules="rules.newPassphrase"
                prepend-icon="mdi-face" />

              <v-text-field v-model="newPassphraseRepeat" :label="$t('seravault.profile.changePassphrase.newPassphraseRepeat')" required :rules="rules.newPassphraseRepeat"
                prepend-icon="mdi-face" />
            </v-card-text>
            <v-card-actions>
              <v-btn @click="updatePassphrase">Update passphrase</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
        <LanguagePicker />
        <v-form ref="updateProfile">
          <v-card cols="6" sm="12" @keyup.native.enter="updateProfile">
            <v-card-title>
              Update Profile
            </v-card-title>
            <v-card-text>
              <v-switch v-model="values.theme" label="Dark Theme" 
                  prepend-icon="mdi-face" />
            </v-card-text>
            <v-card-actions>
              <v-btn @click="updateProfile">Update Profile</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="js">
  /*--------  Collections  --------*/

  import {
    UsersMedia
  } from '../../../api/collections/usersMedia/_client'

  /*--------  Mixins  --------*/
  import RulesMixin from '../../mixins/general/rules'
  import {
    GetAvatarMixin
  } from '../../mixins/users/avatars'

  /*--------  Components  --------*/

  import UploadButton from '../../components/general/UploadButton.vue'
  import PhoneInput from '../../components/general/PhoneInput.vue'
  import DatePicker from '../../components/general/DatePicker.vue'
  import LanguagePicker from '../../components/general/LanguagePicker.vue'

  import sv from '../../mixins/seravault/encryption'

  export default {
    name: "Profile",
    components: {
      UploadButton,
      DatePicker,
      PhoneInput,
      LanguagePicker
    },
    mixins: [
      RulesMixin,
      GetAvatarMixin
    ],
    data: function () {
      return {
        values: {},
        valid: true,
        menu: false,
        loadingImage: false,
        progress: false,
        oldPassphrase: "",
        newPassphrase: "",
        newPassphraseRepeat: "",
        rules: {
          newPassphrase: [v => !!v || this.$t("auth.errors.passwordRequired")],
          newPassphraseRepeat: [v => v == this.newPassphrase || this.$t("auth.errors.passwordsDontMatch")
        ]
        }
      }
    },
    meteor: {
      // Get user logged
      user() {
        return Meteor.user();
      },
    },
    computed: {
      authenticated() {
        return this.$store.state.authenticated
      },
      i18nShow() {
        return Object.keys(Meteor.settings.public.i18n.languages).length > 1
      }
    },
    watch: {
      "user": {
        handler(user) {
          if (user?.profile) {
            this.values = user.profile;
          }
        },
        immediate: true,
        deep: true
      }
    },
    mounted: function () {
      this.$store.commit("updateCrumbs", {
        position: 0,
        name_i18n: "menu.profile",
        icon: "mdi-face",
        link: {
          name: "profile"
        }
      })
    },
    methods: {
      avatarSelected: function (i) {
        if (!!i && i.length) {
          for (const v of i) {
            if (v.size > 3 * 1024 * 1024) {
              this.$store.commit("snack", {
                text: "Image must not exceed 3MB!!",
                color: "error"
              })
              return false;
            }
          }
          this.loadingImage = true;
          // Save images on server
          // First lets save images on server (only new images)
          let file = i[0];
          if (file) {
            const uploadInstance = UsersMedia.insert({
              file: file,
              chunkSize: 'dynamic',
              meta: {
                user: this.user._id,
                type: "avatar",
                created: new Date(),
                updated: new Date(),
                createdBy: this.user._id,
                lastUpdatedBy: this.user._id
              }
            }, false);
            uploadInstance.on('end', (error) => {
              if (error) {
                console.log('Error during upload: ' + error.reason);
              }
              this.loadingImage = false;
              this.progress = false;
            });
            uploadInstance.start();
          }
        }
      },
      updateProfile: function () {
        if (!this.valid) {
          this.$store.commit("snack", {
            text: "confirm"
          });
          return false;
        }
        this.values.name = this.values.given_name + " " + this.values.family_name;
        // Save values to profile
        this.values.updated = new Date()
        Meteor.users.update({
          _id: Meteor.userId()
        }, {
          $set: {
            profile: this.values
          }
        });
        this.$store.commit("snack", {
          text: this.$t('updated_profile'),
          color: "success"
        })
      },
      async updatePassphrase() {
        if (this.$refs.changePassphrase.validate()) {           
            const newKey = await sv.changePassphrase(this.oldPassphrase, this.newPassphrase, this.user.profile.encMasterKey)            
            if (!newKey.error) {
              Meteor.users.update({
                _id: Meteor.userId()
              }, {
                $set: {
                  'profile.encMasterKey': newKey
                }
              })
              Accounts.changePassword(this.oldPassphrase, this.newPassphrase, function(err) {
                if (err) {
                  console.log(err)
                }
              })
            }
            else {
              this.$store.commit("snack", {
                text: this.$t('seravault.profile.changePassphrase.wrongPassphrase'),
                color: "error"
              })
            }          
          }                  
      }
    }
  }
</script>

<style lang="css">
</style>