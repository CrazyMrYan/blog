<template>
  <button class="goPrint" @click="goPrint()">📄 打印</button>
</template>

<script>
import { defineComponent } from "vue";
import { goPrint } from "../../utils/print";
export default defineComponent({
  setup() {
    return {
      goPrint,
    };
  },
});
</script>

<style  scoped>
.goPrint {
  padding: 10px 5px;
  outline: none;
  border: none;
  color: #2c3e50;
  line-height: 1.499;
  position: relative;
  z-index: 2;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 0 15px;
  font-size: 14px;
  border-radius: 4px;
  background-color: antiquewhite;
  position: fixed;
  left: 20px;
  top: 50%;
}
</style>