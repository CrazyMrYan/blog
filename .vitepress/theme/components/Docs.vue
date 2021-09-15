<template>
  <div class="">
    <div class="years" v-for="(year, index) in data" :key="index + year">
      <div class="year">
        {{ year[0].frontMatter.date.split("-")[0] }}
      </div>
      <a
        v-show="!article.frontMatter.home"
        :href=" base + article.regularPath || ''"
        v-for="(article, el) in year"
        :key="el"
        class="article"
      >
        <div class="title">
          {{ article.frontMatter.title || "" }}
        </div>
        <div class="date">{{ article.frontMatter.date.slice(5) || "" }}</div>
      </a>
    </div>
  </div>
</template>

<script>
  import { defineComponent, computed } from "vue";
  import { withBase, useYearSort } from "../../theme-default/utils";
  import { usePageData, useSiteData } from "vitepress";
  import { Build } from '../../build'

  export default defineComponent({
    setup() {
      const siteData = useSiteData();

      const data = computed(() =>
        useYearSort(siteData.value.themeConfig.pages)
      );

      const base = Build()
      return {
        data,
        base
      };
    },
     mounted(){
       axios.post('http://42.193.173.48:3000/api/log',{url:document.title})
    }
  });
</script>

<style scoped>
  .header {
    color: #353535;
    font-size: 2rem;
    font-weight: 600;
    margin: 1rem 0;
    text-align: center;
  }
  .year {
    padding: 15px 0;
    font-size: 1.3rem;
    border-bottom: 1px solid #ccc;
    font-weight: 600;
    color: var(--text-color);
  }
  .article {
    padding: 2px;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
      color: var(--accent-color);
    font-size: 1.1rem;
  }
  .date {
    color: #ccc;
    font-size: 1rem;
  }
  
    @media screen and (max-width: 700px) {
    .header {
      font-size: 1.5rem;
    }
    .article {
      padding: 2px;
    }
    .date,
    .title {
      font-size: 0.9rem;
    }
    .title{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>