<template>
  <div class="content">
    <slot name="top" />
    <div class="md-header">
      <div class="md-title">{{ pageData.title }}</div>
      <span id="jinrishici-sentence">正在加载今日诗词....</span>
      <div class="md-date">{{ pageData.frontmatter.date }}</div>
    </div>
    <ul class="catalog">
      <li class="catalog-item" v-for="item in pageData.headers" :key="item">
        <a
          class="level level-2"
          v-if="item.level == 2"
          :href="'#' + item.slug"
          >{{ item.title }}</a
        >
        <a
          class="level level-3"
          v-if="item.level == 3"
          :href="'#' + item.slug"
          >{{ item.title }}</a
        >
      </li>
    </ul>
    <Content />
    <NextAndPrevLinks />
    <PageEdit />
    <slot name="bottom" />
  </div>
  <!-- 只想点击背景才关闭 请使用 .self 修饰符 -->
  <div @click="clickShowImg = false" v-show="clickShowImg" class="imgBox">
    <img :src="ImgUrl" />
  </div>
</template>

<script>
import NextAndPrevLinks from "./NextAndPrevLinks.vue";
import PageEdit from "./PageEdit.vue";
import { usePageData } from "vitepress";
import { onMounted, reactive } from "vue";
export default {
  components: { NextAndPrevLinks, PageEdit },
  setup() {
    const pageData = usePageData();
    return {
      pageData,
    };
  },
  data() {
    return {
      clickShowImg: false,
      ImgUrl: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        var imgElementArray = document.getElementsByTagName("img");
        for (let i = 0; i < imgElementArray.length; i++) {
          imgElementArray[i].addEventListener(
            "click",
            (event) => {
              this.ImgUrl = event.target.src;
              this.clickShowImg = true;
            },
            false
          );
        }
      }, 500);
    });
    !(function (e) {
      var n,
        t = {},
        o = "jinrishici-token";
      function i() {
        return (
          document.getElementById("jinrishici-sentence") ||
          0 != document.getElementsByClassName("jinrishici-sentence").length
        );
      }
      function c() {
        t.load(function (e) {
          var n = document.getElementById("jinrishici-sentence"),
            t = document.getElementsByClassName("jinrishici-sentence");
          if ((n && (n.innerText = e.data.content), 0 !== t.length))
            for (var o = 0; o < t.length; o++) t[o].innerText = e.data.content;
        });
      }
      function r(e, n) {
        var t = new XMLHttpRequest();
        t.open("get", n),
          (t.withCredentials = !0),
          t.send(),
          (t.onreadystatechange = function (n) {
            if (4 === t.readyState) {
              var o = JSON.parse(t.responseText);
              "success" === o.status
                ? e(o)
                : console.error(
                    "今日诗词API加载失败，错误原因：" + o.errMessage
                  );
            }
          });
      }
      (t.load = function (n) {
        return e.localStorage && e.localStorage.getItem(o)
          ? (function (e, n) {
              return r(
                e,
                "https://v2.jinrishici.com/one.json?client=browser-sdk/1.2&X-User-Token=" +
                  encodeURIComponent(n)
              );
            })(n, e.localStorage.getItem(o))
          : (function (n) {
              return r(function (t) {
                e.localStorage.setItem(o, t.token), n(t);
              }, "https://v2.jinrishici.com/one.json?client=browser-sdk/1.2");
            })(n);
      }),
        (e.jinrishici = t),
        i()
          ? c()
          : ((n = function () {
              i() && c();
            }),
            "loading" != document.readyState
              ? n()
              : document.addEventListener
              ? document.addEventListener("DOMContentLoaded", n)
              : document.attachEvent("onreadystatechange", function () {
                  "complete" == document.readyState && n();
                }));
    })(window);
  },
};
</script>

<style>
 img{
    cursor: zoom-in;
}
.imgBox {
  width: 100%;
  height: 100vh;
  background: rgba(49, 49, 49, 0.4);
  z-index: 99999;
  position: fixed;
  display: flex;
  left: 0px;
  top: 0px;
  align-items: center;
  justify-content: center;
}
.imgBox > img {
  max-height: 80%;
  max-width: 96%;
  min-width: 60%;
  cursor: zoom-out;
}
.content {
  margin: 0 auto;
  padding: 0.025rem 2.5rem 2rem;
  /* if this is moved to a variable, add it to BuySellAds.vue */
  max-width: 50rem;
  overflow-x: hidden;
}

.content a {
  color: var(--accent-color);
}

.content a:hover {
  text-decoration: underline;
}

.content img {
  max-width: 100%;
}
.content>div> p> img {
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  max-width: 100%;
      display: block;
    margin: 0 auto;
    border-radius: 4px;
}
/*
  .content div > h1:first-child, .content div > h2:first-child {
    margin-top: 0;
  } */
.md-header {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.md-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--title-color);
}
#jinrishici-sentence {
  margin: 0.5rem 0 0.4rem;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--title-color);
}
.md-date {
  font-size: 1rem;
  font-style: italic;
  color: #aaa;
}
.catalog {
  border-left: 1px solid #ccc;
  position: fixed;
  top: 100px;
  right: 6vw;
  overflow: auto;
  max-height: 80vh;
  padding-left: 12px;
}
.catalog-item {
  display: block;
}

.level-2 {
  font-size: 12px;
}
.level-3 {
  margin: 10px 0;
  display: list-item;
  list-style-position: inside;
  color: #717171 !important;
  padding-left: 1rem;
  font-size: 12px;
  list-style-type: circle;
}
.level-3::marker {
  font-size: 2px;
  padding-right: 10px;
  width: 100px;
}
@media screen and (max-width: 1200px) {
  .catalog {
    display: none;
  }
}
</style>