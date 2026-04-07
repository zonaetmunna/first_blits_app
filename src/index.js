import Blits from '@lightningjs/blits'
import App from './App.js'

Blits.Launch(App, 'app', {
  // Base resolution - Lightning scales this to fit 4K or 720p automatically
  w: 1920,
  h: 1080,
  multithreaded: true, // Critical for Android TV performance (runs logic in a Worker)
  debugLevel: 1,

  // Font Configuration
  fonts: [
    {
      family: 'lato',
      type: 'msdf',
      file: 'fonts/Lato-Regular.ttf',
    },
    {
      family: 'raleway',
      type: 'msdf',
      file: 'fonts/Raleway-ExtraBold.ttf',
    },
    {
      family: 'opensans',
      type: 'web',
      file: 'fonts/OpenSans-Medium.ttf',
    },
  ],

  // Android TV Remote Keymapping
  // Maps standard Android KeyCodes to Blits internal events
  keymap: {
    13: 'enter',
    19: 'up',
    20: 'down',
    21: 'left',
    22: 'right',
    27: 'back',
    175: 'volume_up',
    174: 'volume_down',
    179: 'playpause',
    461: 'back', // Specific to some LG/WebOS remotes if porting
  },

  // Performance & Inspector settings
  inspector: true, // Set to false for production
  canvasColor: '#000000', // Background color for the canvas need black for fade in/out effects
})
