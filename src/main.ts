import Vue from "vue";
import App from "./App.vue";
import sdk from "glut-app-sdk";

Vue.prototype.$rootId = sdk.getRootElementId();
new Vue({
  render: (h: any) => h(App)
}).$mount(`#${sdk.getRootElementId()}`);
