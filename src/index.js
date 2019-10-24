import Vue from 'vue'
import App from './App.vue'
import sdk from 'glut-app-sdk'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

Vue.prototype.$roodId = sdk.getRootElementId();
new Vue({
  el: `#${sdk.getRootElementId()}`,
  render: h => h(App),
});
