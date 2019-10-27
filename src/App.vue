<template>
  <div :id="$rootId" class="root-container">{{text}}</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import sdk from "glut-app-sdk";

@Component({
  components: {}
})
export default class App extends Vue {
  text: string = "请选择菜单";
  created() {
    sdk.setMenuList([
      {
        title: "菜单1",
        callback: () => {
          this.text = "点击菜单1";
        }
      },
      {
        title: "菜单2",
        callback: () => {
          this.text = "点击菜单2";
        }
      },
      {
        title: "菜单3",
        callback: () => {
          this.text = "点击菜单3";
        }
      }
    ]);
  }
}
</script>

<style lang="scss">
.root-container {
  color: #2c3e50;
}
</style>