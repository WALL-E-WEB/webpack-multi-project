import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: []
});
router.beforeEach((to, from, next) => {
  // 改变页码title
  if (to.meta.title) document.title = to.meta.title;
  //1
  next();
  //4
});
export default router;
