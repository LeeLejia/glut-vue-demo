<template>
  <div :id="$roodId" class="root-container">
    <div class="outer" v-if="data">
      <div class="type-list">
        <div
          class="action"
          :class="{'no-select': !selectWay.json}"
          @click="selectWay = {...selectWay, json: !selectWay.json}"
        >json</div>
        <div
          class="action"
          :class="{'no-select': !selectWay.php}"
          @click="selectWay = {...selectWay, php: !selectWay.php}"
        >php</div>
        <div
          class="action"
          :class="{'no-select': !selectWay.xml}"
          @click="selectWay = {...selectWay, xml: !selectWay.xml}"
        >xml</div>
      </div>
      <div class="code-container">
        <div v-if="selectWay.json">
          <div class="label">double key json:</div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{getJsonText(data.dbkeyJson_col)}}</pre>
            <div class="copy" @click="copyText(getJsonText(data.dbkeyJson_col))">copy</div>
          </div>
          <div style="position: relative;">
            <pre class="js-content code-content">{{getJsonText(data.dbkeyJson_row)}}</pre>
            <div class="copy" @click="copyText(getJsonText(data.dbkeyJson_row))">copy</div>
          </div>
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
        <div v-if="selectWay.xml">
          <div class="label">xml(ctrl + a, ctrl + c 选中整个文档):</div>
          <div style="position: relative;">
            <pre class="xml-content code-content">{{getXmlString(data.xmlObj)}}</pre>
            <div class="copy" @click="download(data.xmlObj)">下载</div>
          </div>
        </div>
      </div>
    </div>
    <div class="desc" v-else-if="valid">
      <div>选择表格区域复制,在此次导出代码。</div>
      <div>在表格中使用 ctrl + a, ctrl + c 选中并复制整个表格</div>
    </div>
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
import sheetToCode from "./sheetToCode";
import JSZip from "jszip";

export default {
  name: "app",
  data() {
    return {
      data: "",
      selectWay: { json: true, php: true, xml: false },
      valid: false,
      downloading: false
    };
  },
  created() {
    sdk
      .readConfig({ config: { json: true, php: true, xml: false } })
      .then(({ config }) => {
        this.selectWay = config;
      });
    this.valid = document.location.href.startsWith("https://docs.google.com");
    console.log(`valid:${this.valid}`);
    if (!this.valid) {
      return;
    }
    document.addEventListener("copy", this.copyEvent);
    sdk.setEventListener("close", () => {
      sdk.saveConfig({
        config: this.selectWay || { json: true, php: true, xml: false }
      });
      document.removeEventListener("copy", this.copyEvent);
    });
    sdk.minWin();
  },
  methods: {
    getXmlString(xmlObj) {
      return Object.keys(xmlObj)
        .map(it => {
          return `file: ${it}.xml\n${xmlObj[it]}`;
        })
        .join("\n-----------------------\n");
    },
    download(xmlObj) {
      if (this.downloading) {
        return;
      }
      this.downloading = true;
      var zip = new JSZip();
      var xml = zip.folder("xml");
      Object.keys(xmlObj).forEach(it => {
        xml.file(`${it}.xml`, xmlObj[it]);
      });
      zip
        .generateAsync({ type: "blob" })
        .then(content => {
          const aLink = document.createElement("a");
          var blob = new Blob([content], {
            type: "text/plain;charset=UTF-8"
          });
          var evt = new Event("click");
          aLink.download = "google-doc-to-xml.zip";
          aLink.href = URL.createObjectURL(blob);
          aLink.click();
          URL.revokeObjectURL(blob);
          this.downloading = false;
        })
        .catch(err => {
          this.downloading = false;
          console.log(err);
          alert("下载失败");
        });
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
      const result = sheetToCode(text);
      this.data = result;
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

