const browserEnv = require('browser-env')
browserEnv(['window', 'document', 'navigator'])
try {
  require('./webcomponents-lite.js')
} catch (error) {
  console.log(error)
}

// "^.+\\.js$": "babel-jest"
