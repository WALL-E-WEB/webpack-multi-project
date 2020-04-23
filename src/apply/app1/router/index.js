// import router from "../../../router";
import Vue from 'vue'
import router from "@/router";

Vue.skdjf2 = 'aaa'
console.log('Vue.skdjf2',Vue.skdjf)
import index from "../pages/index";
// import home from "../pages/home";

const routes = [
    {
        path: "/",
        name:'index',
        component: index,
        meta:{
            title:'app1'
        }
	},
	{
        path: "/home",
        name:'home2',
        // component:home,
        component: ()=> import(/* webpackChunkName: "home" */'../pages/home/index.vue'),
        // component: ()=> import(/* webpackPrefetch: true */'../pages/home/index.vue'),
        // component: ()=> import('../pages/home/index.vue'),
        meta:{
            title:'walle'
        }
	},
];

router.beforeEach((to,from,next)=>{
    //....2
    console.log(to)
    next()
    //3
})



router.addRoutes(routes);

export default router
