<template>
  <div id="containerColor" :class="[pageClasses, themeMode]">
    <header class="navbar" v-if="showNavbar">
      <!-- <div class="body-bg" style="background: url(&quot;https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175828.jpeg&quot;) center center / cover no-repeat;opacity: 0.5;position: fixed;left: 0;top: 0;z-index: -999999;height: 100vh;width: 100vw;transition: background .5s;"></div> -->
      <NavBar>
        <template #search>
          <slot name="navbar-search" />
        </template>
      </NavBar>
      <ToggleSideBarButton @toggle="toggleSidebar" />
    </header>
    <aside :class="{ open: openSideBar }">
      <SideBar>
        <template #top>
          <slot name="sidebar-top" />
        </template>
        <template #bottom>
          <slot name="sidebar-bottom" />
        </template>
      </SideBar>
    </aside>
    <div class="home-bg" v-if="enableHome">
      <div class="content-bg">
        <h1>
          CrazyYan
          <p>一个有温度的野生前端猿人</p>
        </h1>
      </div>
    </div>
    <!-- TODO: make this button accessible -->
    <div class="sidebar-mask" @click="toggleSidebar(false)" />
    <main class="home" aria-labelledby="main-title" v-if="enableHome">
      <Home style="flex: 1">
        <template #hero>
          <slot name="home-hero" />
        </template>
        <template #features>
          <slot name="home-features" />
        </template>
        <template #footer>
          <slot name="home-footer" />
        </template>
      </Home>
      <Card :config="cardConfig" class="Card" />
    </main>
    <main v-else>
      <Page>
        <template #top>
          <slot name="page-top" />
        </template>
        <template #bottom>
          <slot name="page-bottom" />
        </template>
      </Page>
    </main>
    <div class="theme-select">
      <ul>
        <li
          @click="modeSelect('theme')"
          :class="themeMode == 'theme' ? 'active' : ''"
        >
          ☀️
        </li>
        <li
          @click="modeSelect('theme themeDark')"
          :class="themeMode !== 'theme' ? 'active' : ''"
        >
          🌑
        </li>
      </ul>
    </div>
  </div>
  <Debug />
</template>

<script>
import { ref, computed, watch } from "vue";
import NavBar from "./components/NavBar.vue";
import Home from "./components/Home.vue";
import ToggleSideBarButton from "./components/ToggleSideBarButton.vue";
import SideBar from "./components/SideBar.vue";
import Page from "./components/Page.vue";
import Card from "../theme/components/Card.vue";
import headImg from "../images/t.jpg";
import codeImg from "../images/mycode.jpg";
import codeqqImg from "../images/qq.jpg";

import {
  useRoute,
  usePageData,
  useSiteData,
  useSiteDataByRoute,
} from "vitepress";

export default {
  updated() {
    this.modeSelect(localStorage.getItem("mode"));
  },
  mounted() {
    this.modeSelect(localStorage.getItem("mode"));
  },
  components: {
    Home,
    NavBar,
    ToggleSideBarButton,
    SideBar,
    Page,
    Card,
  },
  data() {
    return {
      themeMode: "theme",
      cardConfig: {
        showCard: true,
        headImg,
        iconArray: [
          {
            icon: "icon-QQ",
            link: false,
            event: {
              type: "click",
              imgUrl: codeqqImg,
            },
          },
          {
            icon: "icon-weixin",
            link: false,
            event: {
              type: "click",
              imgUrl: codeImg,
            },
          },
          {
            icon: "icon-github",
            link: "https://github.com/CrazyMrYan",
            event: false,
          },
          {
            icon: "icon-youjian",
            link: "https://github.com/CrazyMrYan",
            event: false,
          },
        ],
        nickName: "CrazyYan",
        skill:
          "精通 Ai、Fw、Fl、Br、Ae、Pr、Id、Ps 等软件的安装与卸载，精通 CSS、JavaScript、PHP、ASP、C、C++、C#、Java、Ruby、Perl、Lisp、Python、Objective-C、ActionScript、Pascal 等单词的拼写，熟悉 Windows、Linux、OS X、Android、iOS、WP8 等系统的开关机。",
        synopsis:
          "老严 专注于潜水、摸鱼、搬砖。兴趣使然的一个野生(FE)程序猿",
      },
    };
  },
  methods: {
    modeSelect(mode) {
      if (!!mode) {
        this.themeMode = mode;
        localStorage.setItem("mode", mode);
        document
          .querySelector("html")
          .style.setProperty(
            "background-color",
            this.themeMode === "theme" ? "#fff" : "#0d1117"
          );
      }
    },
  },
  setup() {
    const route = useRoute();
    const pageData = usePageData();
    const siteData = useSiteData();
    const siteRouteData = useSiteDataByRoute();

    const openSideBar = ref(false);
    const enableHome = computed(() => !!pageData.value.frontmatter.home);

    const showNavbar = computed(() => {
      const { themeConfig } = siteRouteData.value;
      const { frontmatter } = pageData.value;
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false;
      }
      return (
        siteData.value.title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav
      );
    });

    const showSidebar = computed(() => {
      const { frontmatter } = pageData.value;
      const { themeConfig } = siteRouteData.value;
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        ((typeof themeConfig.sidebar === "object" &&
          Object.keys(themeConfig.sidebar).length != 0) ||
          (Array.isArray(themeConfig.sidebar) &&
            themeConfig.sidebar.length != 0))
      );
    });

    const pageClasses = computed(() => {
      return [
        {
          "no-navbar": !showNavbar.value,
          "sidebar-open": openSideBar.value,
          "no-sidebar": !showSidebar.value,
        },
      ];
    });

    const toggleSidebar = (to) => {
      openSideBar.value = typeof to === "boolean" ? to : !openSideBar.value;
    };

    const hideSidebar = toggleSidebar.bind(null, false);
    // close the sidebar when navigating to a different location
    watch(route, hideSidebar);
    // TODO: route only changes when the pathname changes
    // listening to hashchange does nothing because it's prevented in router

    return {
      showNavbar,
      showSidebar,
      openSideBar,
      pageClasses,
      enableHome,
      toggleSidebar,
    };
  },
};
</script>
<style scoped>
@media screen and (max-width: 1200px) {
  .content-bg,
  .home-bg {
    height: 15rem !important;
  }
}
@keyframes typing {
  from {
    width: 0;
  }
}
@keyframes blink-caret {
  50% {
    border-color: transparent;
  }
}

.content-bg h1 p {
  font: bold 200% Consolas, Monaco, monospace;
  border-right: 0.1em solid;
  width: 12em; /* fallback */
  /* width: 30ch; # of chars */
  margin: 2em 1em;
  white-space: nowrap;
  overflow: hidden;
  animation: typing 5s steps(12, end),
  /*英文速度*/ blink-caret 0.5s step-end infinite alternate;
}
.content-bg {
  width: 100%;
  height: 450px;
  background-color: var(--content-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-bg h1 {
  color: var(--content-bg-color);
}
.content-bg h1 p {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
}
.home-bg {
  width: 100%;
  margin-top: 3rem;
  background: url("../images/2038260.jpg") center center / cover no-repeat;
  height: 450px;
  position: relative;
  overflow: hidden;
}
.home {
  display: flex !important;
}

.theme-select {
  width: 5rem;
  height: 2rem;
  display: inline-block;
  position: fixed;
  top: 0.7rem;
  right: 0.5rem;
  z-index: 10;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.theme-select li {
  flex: 1;
  text-align: center;
  line-height: 2rem;
  cursor: pointer;
  border-radius: 0.5rem 0 0 0.5rem;
}
.theme-select li:nth-child(2n) {
  border-left: 1px solid var(--border-color);
  border-radius: 0 0.5rem 0.5rem 0;
}
.theme-select ul {
  overflow: hidden;
  width: 100%;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  border: 1px solid var(--border-color);
}
.active {
  background-color: antiquewhite;
}
</style>