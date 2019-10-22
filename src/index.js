import Vue from 'vue'
import App from './App.vue'
import sdk from 'glut-app-sdk'

Vue.prototype.$roodId = sdk.getRootElementId();
new Vue({
  el: `#${sdk.getRootElementId()}`,
  render: h => h(App),
});
