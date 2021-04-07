<template>
  <div class="Friendship">
      <a :href="item.link" v-for="(item,index) in FriendshipData" :key="index + item.link" target="_blank" rel="noopener noreferrer">
          <!-- <img :src="item.imgUrl" > -->
          <div class="img-div" :style="{background:'url('+ item.imgUrl +') center center / cover no-repeat'}"></div>
          <div class="introduce">
            <p class="nickName">{{item.nickName}}</p>
            <p>{{item.introduce}}</p>
          </div>
      </a>
  </div>
</template>

<script>
import img from '../../images/t.jpg'
export default {
    data(){
        return{
            img,
            FriendshipData:[]
        }
    },
    mounted(){
        axios.post('http://42.193.173.48:3000/api/friendship/list',{
                "type":'pass'
        })
        .then( (response)=> {
           this.FriendshipData = response.data.data;
        })
        .catch( (error) =>{
            console.log(error);
        });
       axios.post('http://42.193.173.48:3000/api/log',{url:document.title})
    }
};
</script>
<style scoped>
.Friendship{
    display: flex;
    flex-wrap:wrap;
    margin-top: 20px;
}
.Friendship a{
    text-decoration:none;
    display: block;
    background: var(--header-color);
    width: 320px;
    margin: 10px;
    padding: 10px 0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    border: 1px solid var(--border-color);
    position: relative;
    top: 0;
    transition: all .2s;
}
.Friendship a:hover{
    top: -5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.Friendship .img-div {
    min-width: 60px;
    height: 60px;
    margin: 0 10px;
    border-radius: 50%;
    cursor: pointer;
}
.introduce{
    flex: 1;
}
.introduce p {
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    flex: 1;
    width: 14em;
    color: var(--text-color);
}
.nickName{
    font-weight: 600;
    font-size: 18px;
    color: var(--title-color);
}
</style>