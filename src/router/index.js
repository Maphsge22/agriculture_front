import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [{
    path: '/',
    redirect: '/welcome'
}, {
    path: "/",
    name: "Home",
    component: Home,
    children: [{
        path: "/welcome",
        name: "welcome",
        meta: {
            title: '欢迎页'
        },
        component: () =>
            import(
                "../views/Welcome.vue")
    }, {
        path: "/account",
        name: "account",
        meta: {
            title: '用户管理',
            permission: true
        },
        component: () =>
            import(
                "../views/Account.vue")
    }, {
        path: "/system",
        name: "system",
        meta: {
            title: '系统管理',
            permission: true
        },
        component: () => {
            window.open("http://localhost:8848/nacos");
        }
    }, {
        path: "/analyze",
        name: "analyze",
        meta: {
            title: '数据分析'
        },
        component: () =>
            import(
                "../views/Analyze.vue")
    }, {
        path: "/bar",
        name: "bar",
        meta: {
            title: 'bar'
        },
        component: () =>
            import(
                "../views/TbCell.vue")
    }, {
        path: '/404',
        name: '404',
        meta: {
            title: '找不到页面'
        },
        component: () =>
            import( /* webpackChunkName: "404" */
                '../views/404.vue')
    }, {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限'
        },
        component: () =>
            import( /* webpackChunkName: "403" */
                '../views/403.vue')
    }]
}, {
    path: "/login",
    name: "Login",
    meta: {
        title: '登录'
    },
    component: () =>
        import(
            /* webpackChunkName: "login" */
            "../views/Login.vue")
}];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('usertype');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'Admin' ?
            next() :
            next('/403');
    } else {
        next();
    }
});

export default router;
