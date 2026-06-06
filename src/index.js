require('./style.css');

function loadGlobalScript(code, globalName) {
  return new Function(
    'window',
    `${code}; return typeof ${globalName} !== 'undefined' ? ${globalName} : window.${globalName};`
  )(window);
}

const jquery = require('../js/jquery-3.7.1.min.js');
window.jQuery = window.$ = jquery;

require('../js/circle-progress.min.js');
require('../js/bootstrap.min.js');
require('../js/validator.min.js');
require('../js/jquery.slicknav.js');

window.Swiper = loadGlobalScript(require('../js/swiper-bundle.min.js?raw'), 'Swiper');

require('../js/jquery.waypoints.min.js');
require('../js/jquery.counterup.min.js');
require('../js/jquery.magnific-popup.min.js');
require('../js/parallaxie.js');

window.gsap = loadGlobalScript(require('../js/gsap.min.js?raw'), 'gsap');

require('../js/magiccursor.js');

window.SplitText = loadGlobalScript(require('../js/SplitText.js?raw'), 'SplitText');

window.ScrollTrigger = loadGlobalScript(require('../js/ScrollTrigger.min.js?raw'), 'ScrollTrigger');

require('../js/jquery.mb.YTPlayer.min.js');

const wowModule = require('../js/wow.min.js');
window.WOW = wowModule.default || wowModule;

require('../js/function.js');
