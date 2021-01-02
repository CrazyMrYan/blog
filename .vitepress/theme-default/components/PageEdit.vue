<template>
  <div>
     <footer class="page-edit">
      <a v-for="(item,index) in data.platform" :key="index" :href="item.href"><img class="imgIcon" :src="item.icon" ></a>
      </footer>
     <p class="platform">以上皆为 <a href="javascript:;">悲伤日记</a> 文章发布平台</p>
     <p class="platform"> Copyright &copy; 2020-2021 <a href="https://github.com/CrazyMrYan">@CrazyMrYan</a> </p>
  </div>
</template>

<script>
import cnblogs from "../../images/cnblogs.png"
import jianshu from "../../images/jianshu.png"
import touch from "../../images/touch-icon.png"
import juejin from "../../images/juejin.png"
import csdn from "../../images/csdn.ico"
import wechat from "../../images/NTI4MWU5.ico"
import zhihu from "../../images/zhihu.png"
export default {
  setup(){
    const data = {
      platform:[
        {href:"https://www.zhihu.com/people/feng-kuang-de-yan-xian-sen",icon:zhihu},
        {href:"https://segmentfault.com/u/beishangriji",icon:touch},
        {href:"https://juejin.cn/user/3034307824991006/posts",icon:juejin},
        {href:"https://www.cnblogs.com/10ve/",icon:cnblogs},
        {href:"https://www.jianshu.com/u/cdd6feed8104",icon:jianshu},
        {href:"https://blog.csdn.net/Crazymryan",icon:csdn},
        {href:"https://mp.weixin.qq.com/mp/homepage?__biz=MzI5NzM2MDQyMg==&hid=4&sn=7c9602a6eea3234125715516fc6ea67a",icon:wechat},
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
  margin: 0 .2rem;
}
.imgIcon{
  width: 1.5rem;
  border-radius: 50%;
}
</style>
