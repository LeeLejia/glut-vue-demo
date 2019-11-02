<template>
  <div :id="$roodId" class="root-container">
    <div class="outer" v-if="data">
      <div class="type-list">
        <div
          class="action"
          :class="{'no-select': !selectWay.onekey}"
          @click="selectWay.onekey=!selectWay.onekey"
        >1-Key</div>
        <div
          class="action"
          :class="{'no-select': !selectWay.twoKey}"
          @click="selectWay.twoKey=!selectWay.twoKey"
        >2-Key</div>
        <div
          class="action"
          :class="{'no-select': !selectWay.php}"
          @click="selectWay.php=!selectWay.php"
        >php</div>
        <div class="select-all" @click="selectAll">全选</div>
      </div>
      <div class="code-container">
        <div v-if="selectWay.twoKey">
          <div class="label">double key json:</div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{getJsonText(data.dbkeyJson_col)}}</pre>
            <div class="copy" @click="copyText(getJsonText(data.dbkeyJson_col))">copy</div>
          </div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{getJsonText(data.dbkeyJson_row)}}</pre>
            <div class="copy" @click="copyText(getJsonText(data.dbkeyJson_row))">copy</div>
          </div>
        </div>
        <div v-if="selectWay.onekey">
          <div class="label">one key json:</div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{getJsonText(data.json_col)}}</pre>
            <div class="copy" @click="copyText(getJsonText(data.json_col))">copy</div>
          </div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{getJsonText(data.json_row)}}</pre>
            <div class="copy" @click="copyText(getJsonText(data.json_row))">copy</div>
          </div>
        </div>
        <div v-if="selectWay.php">
          <div class="label">double key php:</div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{data.dbkeyPhpCol}}</pre>
            <div class="copy" @click="copyText(data.dbkeyPhpCol)">copy</div>
          </div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{data.dbkeyPhpRow}}</pre>
            <div class="copy" @click="copyText(data.dbkeyPhpRow)">copy</div>
          </div>
          <div class="label">one key php:</div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{data.jsonPhpCol}}</pre>
            <div class="copy" @click="copyText(data.jsonPhpCol)">copy</div>
          </div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{data.jsonPhpRow}}</pre>
            <div class="copy" @click="copyText(data.jsonPhpRow)">copy</div>
          </div>
        </div>
      </div>
    </div>
    <div class="desc" v-else>选择表格区域复制,在此次导出代码。</div>
    <div class="desc" v-if="!valid">
      <div>该程序用于将表格复制文本转换为json/php代码。</div>
      <div>
        打开
        <a
          class="blue"
          href="https://docs.google.com/spreadsheets/d/1kacbzrtFiYOKQKe8QPwm6pjXTFuLdmOQ0mgbgdue59U/edit#gid=0"
        >示例</a>并重新打开小程序尝试。
      </div>
    </div>
  </div>
</template>

<script>
import sdk from "glut-app-sdk";
import sheetToJson from "./sheetToJson";

export default {
  name: "app",
  data() {
    return {
      data: "",
      selectWay: { onekey: true, twoKey: true, php: true },
      valid: false
    };
  },
  created() {
    this.selectWay = JSON.parse(
      localStorage.getItem("@@copy-select-way") || "null"
    ) || { onekey: true, twoKey: true, php: true };
    this.valid = document.location.href.startsWith("https://docs.google.com");
    console.log(`valid:${this.valid}`);
    if (!this.valid) {
      return;
    }
    document.addEventListener("copy", this.copyEvent);
    sdk.setEventListener("close", () => {
      localStorage.setItem(
        "@@copy-select-way",
        this.selectWay || { onekey: true, twoKey: true, php: true }
      );
      document.removeEventListener("copy", this.copyEvent);
    });
    sdk.minWin();
    document.selectAll = function() {
      function getEvt(keyCode, ctrl = true) {
        let evtObj = document.createEvent("UIEvents");
        evtObj.initUIEvent("keydown", true, true, window, 1);
        delete evtObj.keyCode;
        // 为了模拟keycode
        if (typeof evtObj.keyCode === "undefined") {
          Object.defineProperty(evtObj, "keyCode", { value: keyCode });
        } else {
          evtObj.key = String.fromCharCode(keyCode);
        }
        // 为了模拟ctrl键
        if (typeof evtObj.ctrlKey === "undefined") {
          Object.defineProperty(evtObj, "ctrlKey", { value: ctrl });
        } else {
          evtObj.ctrlKey = ctrl;
        }
        return evtObj;
      }
      const edtObj = document.querySelector("#docs-editor");
      console.log("edtObj:", edtObj);
      if (edtObj) {
        const esc = getEvt(27, false);
        edtObj.dispatchEvent(esc);
      }
      document.body.blur();
      const ctrlA = getEvt(65);
      document.body.dispatchEvent(ctrlA);
      document.execCommand("Copy", "false", null);
    };
  },
  methods: {
    // 全选复制文档 todo
    selectAll() {
      document.selectAll && document.selectAll();
    },
    getJsonText(json) {
      return JSON.stringify(json || {}, null, 2);
    },
    copyText(text) {
      console.log(text);
      const inputEle = document.createElement("textarea");
      inputEle.value = text;
      inputEle.setAttribute("readonly", "readonly");
      document.body.appendChild(inputEle);
      inputEle.select();
      document.execCommand("copy");
      document.body.removeChild(inputEle);
      alert("表格文本已复制到剪贴板");
    },
    copyEvent(event) {
      var clipboardData = event.clipboardData || window.clipboardData;
      if (!clipboardData) {
        return;
      }
      var text = clipboardData.getData("text/html");
      if (!text) {
        return;
      }
      const result = sheetToJson(text);
      this.data = result;
      console.log(result);
      sdk.maxWin();
    }
  }
};
</script>

<style lang="scss" scoped >
.root-container {
  width: 300px;
  padding: 10px 10px 20px 10px;
  .code-container {
    max-height: 600px;
    overflow: scroll;
  }
  .type-list {
    display: flex;
    justify-content: flex-start;
    padding: 5px;
    margin-bottom: 16px;
    .action {
      width: 40px;
      height: 15px;
      background: #3781ce;
      color: #fff;
      line-height: 15px;
      padding: 8px 10px;
      border-radius: 6px;
      text-align: center;
      margin-right: 20px;
    }

    .no-select {
      background: #fff;
      color: #797474;
      border: 1px dashed #808080;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .blue {
    color: blue;
  }
  .desc,
  .empty {
    width: 100%;
  }
  .code-label {
    font-size: 16px;
    font-weight: bold;
    color: #463e3e;
  }
  .code-content {
    width: 95%;
    max-height: 180px;
    overflow-y: scroll;
    color: #5a3d3d;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid gray;
    background: #efeeee;
    padding: 5px;
    margin: 10px auto;
    position: relative;
  }
  .copy {
    position: absolute;
    bottom: 0px;
    right: 1px;
    padding: 2px 8px;
    color: #808080;
    background: #eae4e4;
    border-radius: 5px;
    cursor: pointer;
    border: 1px dashed #808080;
  }
}
</style>

