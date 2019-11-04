<template>
  <div :id="$roodId" class="root-container">
    <div class="min-phone-action">
      <input class="min-phone-input" autocomplete="on" v-model="murl" placeholder="输入链接 🔗" />
      <div class="min-phone-bt" @click="goUrl">Go</div>
    </div>
    <iframe
      class="min-phone-content"
      :src="frameUrl"
      frameborder="no"
      @click="showPanel=true"
      security="restricted"
      sandbox="allow-scripts allow-same-origin allow-popups"
    ></iframe>
  </div>
</template>

<script>
import sdk from "glut-app-sdk";

export default {
  data() {
    return {
      murl: "",
      url: ""
    };
  },
  computed: {
    frameUrl() {
      const url = this.url.replace(/^https?:/, "");
      return url.startsWith("//") ? url : `//${url}`;
    }
  },
  created() {
    sdk
      .readConfig({ "mini-phone-url": "//www.npmjs.com/package/glut-app-sdk" })
      .then(res => {
        this.url = res["mini-phone-url"];
      });
  },
  methods: {
    goUrl() {
      sdk.saveConfig({
        "mini-phone-url": this.murl
      });
      this.url = this.murl;
    }
  }
};
</script>

<style lang="scss" scoped >
.root-container {
  .min-phone-content {
    height: 520px;
    position: relative;
    bottom: -3px;
  }
  .min-phone-action {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 4px 6px 2px 6px;
    .min-phone-input {
      border-radius: 4px;
      border: 1px solid gray;
      text-align: center;
      display: block;
      color: gray;
      flex: 1;
      font-size: 15px;
      height: 28px;
    }
    .min-phone-bt {
      margin-left: 5px;
      width: 60px;
      height: 28px;
      line-height: 28px;
      font-size: 18px;
      border-radius: 4px;
      text-align: center;
      background: #5b5bc7;
      color: white;
      cursor: pointer;
      &:active {
        transform: scale(0.8);
      }
    }
  }
}
</style>

