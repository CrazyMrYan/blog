// Comment.vue
<template>
  <div id="gitalk-container"></div>
</template>

<script>
  export default {
    name: "comment",
    mounted() {
      const commentConfig = {
        clientID: "e621b27241a69a7f512b",
        clientSecret: "434a88dbe2ba420fa3022a4287493227a2b31b0d",
        repo: "https://github.com/Moking1997/Moking1997.github.io",
        owner: "Moking1997",
        admin: ["Moking1997"],
      };
      const gitalk = new Gitalk(commentConfig);
      gitalk.render("gitalk-container");
    },
  };
</script>
