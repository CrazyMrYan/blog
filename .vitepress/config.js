const getPages = require("./utils/pages");
async function getConfig() {
  let config = {
    head: [
      [
        "meta",
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
        },
      ],
      ["meta", { name: "keywords", content: "悲伤日记" }],
      ["link", { rel: "icon", href: "/favicon.ico" }],
      // 引入 Gitalk
      [
        "link",
        { rel: "stylesheet", href: "https://unpkg.com/gitalk/dist/gitalk.css" },
      ],
      ["script", { src: "https://unpkg.com/gitalk/dist/gitalk.min.js" }],
    ],
    title: "悲伤日记",
    themeConfig: {
      pages: await getPages(),
      author: "悲伤日记",
      search: true,
      nav: [
        { text: "首页", link: "/" },
        { text: "归档", link: "/docs" },
        { text: "分类", link: "/tags" },
        { text: "README", link: "/README" },
      ],
    },
    dest: "public",
    // base:'/blog/'
  };
  return config;
}
module.exports = getConfig();
