/* use Google Cloud Translate service to translate from your defaultLocale defined in your settings.json to all other languages defined in settings (i18n settings) */
var TJO = require('translate-json-object')();
//const { exec }  = require('child_process')
var fs = require('fs')

var settings = require("../../settings.json")
var from = settings.public.i18n.defaultLocale
var to = []
var apiKey = settings.private.i18n.googleTranslateApiKey

settings.public.i18n.languages.forEach(lang => {
  if (lang.value != from) {
    to.push(lang.value)
  }
})

TJO.init({
  googleApiKey: apiKey
});

const rd = process.env.PWD;

const source = JSON.parse(fs.readFileSync(`${rd}/public/locales/${from}.json`))

to.forEach(lang => {
  console.log(lang)
  TJO.translate(source, lang)
    .then(function (data) {
      console.log(data)
      fs.writeFile(`${rd}/public/locales/${lang}.json`, JSON.stringify(data, null, 2), (err) => {
        if (err) throw err;
        console.log(`${lang}.json has been saved`);
      });
    })
    .catch(function (err) {
      console.log('error ', err)
    });
})

/*
var command = `i18n-translate-json ${apiKey} public/locales/ ${from} ${to}`
if (settings.public.authentication.allowMeteor) {
  command += ` ; i18n-translate-json ${apiKey} imports/startup/server/auth/meteor-accounts/locales/ ${from} ${to}`
}
console.log(`Running  ${command}`)

var ex = exec(command, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }  
  console.log("********************");
});

ex.stdout.on('data', function(data) {
  console.log(data); 
});
*/