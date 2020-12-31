<template>
  <a
    v-show="!article.frontMatter.home"
    :href="base + article.regularPath || ''"
    v-for="(article, index) in siteValue"
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
</template>

<script>
  import { defineComponent, computed } from "vue";
  import NavBarLink from "./NavBarLink.vue";
  import { withBase, parseMarkdownList } from "../utils";
  import { usePageData, useSiteData } from "vitepress";
  import { Build } from '../../build'
  export default defineComponent({
    components: {
      NavBarLink,
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
      const siteValue = computed(() =>
        parseMarkdownList(siteData.value.themeConfig.pages)
      );
      const siteDescription = computed(() => siteData.value.description);
      const base = Build()
      return {
        data,
        actionLink,
        heroImageSrc,
        siteValue,
        base,
        siteTitle,
        siteDescription,
      };
    },
  });
</script>

<style scoped>
  .article {
    display: block;
    border-bottom: 1px solid #e5e5e5;
    color: #555;
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
    color: #353535;
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0.5rem 0;
  }
  .line {
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
    border-top: 0.2rem solid #353535;
    display: block;
    width: 2rem;
  }
  .article:hover .line {
    width: 5rem;
  }
  @media screen and (max-width: 700px) {
    .article{
      padding: 1rem 0;
    }
    .title {
      font-size: 1.1rem;
      overflow: hidden;
      text-overflow:ellipsis;
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
