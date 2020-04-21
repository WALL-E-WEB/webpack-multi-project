<template>
  <div class="app">2222
      <div><img src="./static/Snipaste_2020-03-31_19-08-04.png" width="100px" alt=""></div>
      <div>dddd</div>
      <div>dddd</div>
      <div>dddd</div>
      <div>dddd</div>
      <div>dddd</div>
      <div>dddd</div>
      <div class="box" @click="btn">bbb</div>
  </div>
</template>

<script>
import fn2 from "../../libs/index.js"
export default {
    created(){
        console.log(process.env.FILE_NAME)
        console.log(process.env.NODE_ENV)
        console.log(process.env.FILE)
    },
    methods:{
        btn(){
            console.log('btnbtn')
            fn2()
        }
    }
}
</script>

<style>
@import url('./static/css/base.css');
.app{
    width: 100%;
    height: 400px;
    background-color: rgb(17, 56, 185);
    transform: translate(20%,0);
}
</style>