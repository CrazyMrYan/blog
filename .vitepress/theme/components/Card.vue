<template>
  <transition name="bounce">
    <div v-show="config.showCard" class="card">
      <div class="console">
        <div @click="config.showCard = false" class="circle-red"></div>
        <div class="circle-yellow"></div>
        <div @click="getMagnify" class="circle-green"></div>
      </div>
      <div class="content">
        <div class="card-title">
          <img :src="config.headImg" />
          <div class="social">
            <a
              class="iconfont"
              :class="item.icon"
              :href="!!item.link ? item.link : 'javascript:;'"
              v-for="(item, index) in config.iconArray"
              v-on:[item.event.type]="showModalClick(item.event.imgUrl)"
              :key="item"
            >
            </a>
          </div>
        </div>
        <h4 class="nickName">{{ config.nickName }}</h4>
        <p class="introduce">{{ config.synopsis }}</p>
        <p class="introduce">{{ config.skill }}</p>
        <div v-if="showModal" class="modal" @click.self="showModal = false">
          <div>
            <img :src="modalUrl" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import logo from "../../images/t.jpg";
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
    style: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      src: logo,
      showModal: false,
      modalUrl: "",
    };
  },
  computed: {},
  methods: {
    showModalClick(url) {
      console.log(url);
      this.modalUrl = url;
      this.showModal = true;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style  scoped>
.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.console {
  height: 20px;
  padding: 8px 12px;
  background-color: #e3e3e3;
  border-radius: 12px 12px 0 0;
}
.user-bio-body {
  background-color: #eeeeee;
  width: 100%;
  font-size: 13px;
  color: #666666;
  overflow: auto;
  padding: 20px;
  font-family: "Source Code Pro", Consolas, Menlo, Monaco, "Courier New",
    monospace;
}
.console div {
  float: left;
  margin-right: 10px;
  width: 13px;
  height: 13px;
  background-color: #ff5f57;
  border-radius: 50px;
}
.console .circle-yellow {
  float: left;
  margin-right: 10px;
  width: 13px;
  height: 13px;
  background-color: #ffbd2e;
  border-radius: 50px;
}
.console .circle-green {
  float: left;
  margin-right: 10px;
  width: 13px;
  height: 13px;
  background-color: #28ca42;
  border-radius: 50px;
}
.console {
  width: 100%;
  /* background: red; */
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.iconfont{
  text-decoration:none;
  border: none !important;
}
.console > div:hover {
  color: #fff;
  cursor: pointer;
}
.modal {
  position: fixed;
  min-width: 100%;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  z-index: 11;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal > div {
  width: 400px;
  height: 400px;
  border-radius: 12px;
}
.modal > div > img {
  width: 100%;
  cursor: auto;
}
.content {
  padding: 15px;
  box-sizing: border-box;
}
.card {
  max-width: 260px;
  border-radius: 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
}
.card:hover {
}
.card-title {
  border-bottom: 1px solid var(--border-color);
  min-height: 40px;
  color: var(--text-color);
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}
.card-title > img {
  max-width: 100%;
  border-radius: 12px 12px 0 0;
  cursor: auto;
}
.social {
  display: flex;
  height: 60px;
  justify-content: center;
  align-items: center;
}
.social > a {
  flex: 1;
  font-size: 24px;
  color: var(--text-color);
}
.nickName {
  color: var(--text-color-light);
  margin: 0;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  padding-left: 5px;
}
p {
  margin: 0;
  padding-left: 5px;
}
.introduce {
  text-indent: 2em;
}
.card {
  margin-left: 40px;
  width: 260px;
  height: 740px;
  margin-top: 10px;
}
@media screen and (max-width: 1200px) {
  .card {
    display: none;
  }
}
</style>