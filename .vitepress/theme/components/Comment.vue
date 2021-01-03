// Comment.vue
<template>
  <div id="gitalk-container"></div>
</template>

<script>
  export default {
    name: "blog-comments",
    mounted() {
      const commentConfig = {
        // 是否开启
        enable: true,
        // clientID
        clientID: "a6598e156cf30077f530",
        // clientSecret
        clientSecret: "a5e33f61a5071999b191b5f768f837e9187693fd",
        // 评论项目名
        repo: 'blog-comments',
        owner: 'crazymryan',
        admin: ['crazymryan'],
        githubID:'crazymryan',
        id: decodeURI(window.location.pathname),
        language:'zh-CN',
        distractionFreeMode: true
      };
      const gitalk = new Gitalk(commentConfig);
      gitalk.render("gitalk-container");
    },
  };
</script>