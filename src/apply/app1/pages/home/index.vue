<template>
  <div class="home">

    <button @click="btn">HOME2HOME2</button>
    <button @click="btn2">post</button>
  </div>
</template>

<script>
import { Stu } from "../../api/module/home";
export default {
  methods: {
    fn() {
      fn2(() => {
        console.log("walle2", this);
      });
    },
    btn() {
      console.log(process.env.BASEURL);

      Stu.get().then(res => {
        console.log(res);
      });
    },
    btn2() {
      console.log(22);
      Stu.post({ data: { id: 22 } }).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style>
.home {
  /* fff */
  background-color: rgb(216, 200, 215);

  height: 100%;
}
</style>