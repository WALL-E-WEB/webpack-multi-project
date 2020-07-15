<template>
  <div class="home">

    HOME2HOME2
  </div>
</template>

<script>
export default {
  methods: {
    fn() {
      fn2(() => {
        console.log("walle2", this);
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