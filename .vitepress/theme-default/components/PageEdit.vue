<template>
  <div>
     <footer class="page-edit">
      <a v-for="(item,index) in data.platform" :key="index" :href="item.href"><img class="imgIcon" :src="item.icon" ></a>
      </footer>
     <p class="platform">以上皆为 <a href="javascript:;">悲伤日记</a> 文章发布平台</p>
     <p class="platform"> Copyright &copy; 2021-01-01 <a href="https://github.com/CrazyMrYan">@CrazyMrYan</a> </p>
  </div>
</template>

<script>
import cnblogs from "../../images/cnblogs.png"
export default {
  setup(){
    const data = {
      platform:[
        {href:"https://github.com/CrazyMrYan",icon:"https://github.githubassets.com/pinned-octocat.svg"},
        {href:"https://segmentfault.com/u/beishangriji",icon:"https://cdn.segmentfault.com/v-5feb05cf/global/img/touch-icon.png"},
        {href:"https://juejin.cn/user/3034307824991006/posts",icon:"https://b-gold-cdn.xitu.io/favicons/v2/favicon-32x32.png"},
        {href:"https://www.cnblogs.com/10ve/",icon:cnblogs},
        {href:"https://www.jianshu.com/u/cdd6feed8104",icon:"https://cdn2.jianshu.io/assets/favicons/favicon-e743bfb1821442341c3ab15bdbe804f7ad97676bd07a770ccc9483473aa76f06.ico"},
        {href:"https://blog.csdn.net/Crazymryan",icon:"https://g.csdnimg.cn/static/logo/favicon32.ico"},
      ]
    }
    return{
      data
    }
  }
}
</script>

<style>
.platform{
  text-align: center;
}
.page-edit {
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-edit a {
  color: var(--text-color);
  margin-right: 0.25rem;
  display: inline-block;
  margin: 0 10px;
}
.imgIcon{
  width: 32px;
  border-radius: 50%;
}
</style>
