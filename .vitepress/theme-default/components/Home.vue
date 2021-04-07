<template>
  <div>
      <a
    v-show="!article.frontMatter.home"
    :href="base + article.regularPath || ''"
    v-for="(article, index) in dynamicPage.currentData"
    :key="index"
    class="article"
  >
    <div class="article-header">
      <div class="title">
        {{ article.frontMatter.title || "" }}
      </div>
      <time :datetime="article.frontMatter.date" class="time">
        {{ article.frontMatter.date || "" }}
      </time>
    </div>

    <div class="line"></div>
    <p class="describe">
      {{ article.frontMatter.describe || "" }}
    </p>
  </a>
  <div class="paging">
    <div
      class="prev"
      v-if="initPage.page !== 0"
      @click="getChangePage(-1)"
    ></div>
    <span>{{ dynamicPage.totalPages }} - {{ initPage.page + 1 }}</span>
    <div
      class="next"
      v-if="initPage.page + 1 !== dynamicPage.totalPages"
      @click="getChangePage(1)"
    ></div>
  </div>
  <PageEdit />
  </div>
</template>

<script>
import { defineComponent, computed, reactive } from "vue";
import NavBarLink from "./NavBarLink.vue";
import { withBase, parseMarkdownList } from "../utils";
import { usePageData, useSiteData } from "vitepress";
import { Build } from "../../build";
import PageEdit from "./PageEdit.vue";

export default defineComponent({
  components: {
    NavBarLink,
    PageEdit,
  },
  setup() {
    const pageData = usePageData();
    const siteData = useSiteData();
    const data = computed(() => pageData.value.frontmatter);
    const actionLink = computed(() => ({
      link: data.value.actionLink,
      text: data.value.actionText,
    }));

    const heroImageSrc = computed(() => withBase(data.value.heroImage));
    const siteTitle = computed(() => siteData.value.title);
    const siteDescription = computed(() => siteData.value.description);
    const base = Build();

    // 文章总数据
    let totalData = computed(() =>
      parseMarkdownList(siteData.value.themeConfig.pages)
    );

    // 初始化页码信息
    const initPage = reactive({
      page: 0,
      pageSize: 5,
    });

    // 格式化数据
    const formattedData = () => {
      var incisionArray = new Array(
        Math.ceil(totalData.value.length / initPage.pageSize)
      );
      for (let i = 0; i < incisionArray.length; i++) {
        incisionArray[i] = new Array();
      }
      for (let i = 0; i < totalData.value.length; i++) {
        incisionArray[parseInt(i / initPage.pageSize)][i % initPage.pageSize] =
          totalData.value[i];
      }
      // 返回切割后的二维数组
      return incisionArray;
    };
    // 获取到所有数据
    const ALLDATA = formattedData();

    // 动态切换的分页
    const dynamicPage = reactive({
      currentData: ALLDATA[initPage.page],
      totalPages: ALLDATA.length,
    });

    // 执行分页
    const getChangePage = (page) => {
      if (initPage.page + 1 !== dynamicPage.totalPages || initPage.page !== 0) {
        initPage.page += page;
        dynamicPage.currentData = ALLDATA[initPage.page];
      }
    };

    return {
      data,
      actionLink,
      heroImageSrc,
      dynamicPage,
      base,
      getChangePage,
      siteTitle,
      initPage,
      siteDescription,
    };
  },
  mounted(){
    axios.post('http://42.193.173.48:3000/api/log',{url:document.title})
  }
});
</script>

<style scoped>

.prev {
  background-image: url("./icons/prev.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.next {
  background-image: url("./icons/next.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.paging {
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  justify-content: center;
  align-items: center;
}

.paging > span {
  display: block;
  flex: 1;
  font-size: 1.2rem;
  text-align: center;
  color: var(--text-color-light);
}

.paging > div {
  font-weight: 500;
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
}

.paging > div:hover {
  text-decoration: none !important;
}
.article {
  display: block;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color-light);
  padding: 2rem 0;
}
.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.time {
  color: #aaa;
  letter-spacing: 0.5px;
}
.title {
  color: var(--title-color);
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}
.line {
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
  border-top: 0.2rem solid var(--text-color-light);
  display: block;
  width: 2rem;
}
.article:hover .line {
  width: 5rem;
}
@media screen and (max-width: 700px) {
  .article {
    padding: 1rem 0;
  }
  .title {
    font-size: 1.1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 14em;
  }
  .describe {
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    padding: 0 0.5em;
  }
  .time {
    font-size: 14px;
  }
  .line {
    border-top: 0.15rem solid #353535;
  }
}
</style>
