// import router from "../../../router";
import router from "@/router";


import index from "../pages/index";

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
        name:'home',
        component: ()=> import('../pages/home/index.vue'),
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
