import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/store/user";
import { closeAllSSE } from "@/js/utils/actions/sse/seeMain";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/campaign' },

        {
            path: '/elasticStat',
            name: 'elasticStat',
            component: () => import('../pages/ElasticStat/index.vue'),
        },
        {
            path: '/',
            component: () => import('../layouts/default.vue'),
            children: [
                // {
                //     path: 'dashboard',
                //     name: 'dashboard',
                //     component: () => import('../pages/dashboard.vue'),
                // },
                {
                    path: '/adminPanel',
                    name: 'adminPanel',
                    meta: {
                        requiresAdmin: true,
                    },
                    component: () => import('../pages/adminPanel/index.vue'),
                },
                {
                    path: '/i18',
                    name: 'i18_app',
                    meta: {
                        requiresAdmin: true,
                    },
                    component: () => import('@/plugins/i18_ui/i18_app.vue'),
                },
                {
                    path: 'campaign',
                    children: [
                        {
                            path: '',
                            name: 'campaign',
                            component: () => import('../pages/Campaigns/CampaignsList.vue'),
                        },
                        {
                            path: 'new',
                            name: 'campaign-new',
                            component: () => import('../pages/Campaigns/CampaignsNew.vue'),
                        },
                        {
                            path: 'edit/:id',
                            name: 'campaign-edit',
                            component: () => import('../pages/Campaigns/CampaignsNew.vue'),
                        },
                        {
                            path: 'view/:id',
                            name: 'campaign-view',
                            component: () => import('../pages/Campaigns/CampaignView.vue'),
                        },
                    ]
                },
                {
                    path: 'prices',
                    children: [
                        {
                            path: '',
                            name: 'prices',
                            component: () => import('../pages/Prices/PricesList.vue'),
                        },
                        {
                            path: 'change',
                            name: 'prices-change',
                            meta: {
                                requiresAdmin: true, // Этот маршрут требует роль администратора
                            },
                            component: () => import('../pages/Prices/PricesChange.vue'),
                        },
                    ]
                },

                {
                    path: 'audioclips',
                    children: [
                        {
                            path: '',
                            name: 'audioclips',
                            component: () => import('../pages/AudioClips/AudioClipsList.vue'),
                        },
                        {
                            path: 'view/:id',
                            name: 'audioclips-change',
                            component: () => import('../pages/AudioClips/AudioClipsChange.vue'),
                        },
                    ]
                },
                {
                    path: 'scenarios',
                    children: [
                        {
                            path: '',
                            name: 'scenarios',
                            component: () => import('../pages/Scenarios/ScenariosList.vue'),
                        },
                        {
                            path: 'new',
                            name: 'scenarios-new',
                            component: () => import('../pages/Scenarios/ScenariosNew.vue'),
                        },
                        {
                            path: 'view/:id',
                            name: 'scenarios-view',
                            component: () => import('../pages/Scenarios/ScenariosView.vue'),
                        },
                    ]
                },
                {
                    path: 'contacts',
                    children: [
                        {
                            path: '',
                            name: 'contacts',
                            component: () => import('../pages/Contacts/ContactsList.vue'),
                        },
                        {
                            path: 'view/:id',
                            name: 'contacts-view',
                            component: () => import('../pages/Contacts/ContactsView.vue'),
                        },
                    ]
                },
                {
                    path: 'statistics',
                    children: [
                        {
                            path: '',
                            name: 'statisticsList',
                            component: () => import('../pages/Statistics/StatisticsList.vue'),
                        },
                    ]
                },
                {
                    path: 'account-settings',
                    name: 'account-settings',
                    component: () => import('../pages/account-settings.vue'),
                },
                {
                    path: 'typography',
                    name: 'typography',
                    component: () => import('../pages/typography.vue'),
                },
                {
                    path: 'icons',
                    name: 'icons',
                    component: () => import('../pages/icons.vue'),
                },
                {
                    path: 'cards',
                    name: 'cards',
                    component: () => import('../pages/cards.vue'),
                },
                {
                    path: 'tables',
                    name: 'tables',
                    component: () => import('../pages/tables.vue'),
                },
                {
                    path: 'form-layouts',
                    name: 'form-layouts',
                    component: () => import('../pages/form-layouts.vue'),
                },
            ],
        },
        {
            path: '/',
            component: () => import('../layouts/blank.vue'),
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('../pages/login.vue'),
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () => import('../pages/register.vue'),
                },
                {
                    path: '/:pathMatch(.*)*',
                    component: () => import('../pages/[...all].vue'),
                },
                {
                    path: '/notfound',
                    name: 'notfound',
                    component: () => import('../pages/[...all].vue'),
                },
            ],
        },
    ],
})
const notAuth = ['login', 'register']
const notRequireAuth = [...notAuth, 'notfound']
router.beforeResolve((to, from) => {
    if (to.name === 'elasticStat') {
        return true
    }
    if (import.meta.env.VITE_NODE_ENV === 'development') {
        return true
    }
    if (document.cookie.match(/token=(.+?)(;|$)/)) {
        // есть токен
        if (!notAuth.includes(to.name)) {
            return true;
        } else {
            // пытаемся зайти на страницу логина или регистрации будучи авторизованными
            return { path: '/' };
        }
    } else {
        // нет токена
        if (notRequireAuth.includes(to.name)) {
            return true;
        } else {
            // пытаемся зайти на страницу, которая запрещена для неавторизованного

            // удаляем notification уведомления
            closeAllSSE()

            return { name: 'login' };
        }
    }
})

router.beforeEach((to, from, next) => {
    if (import.meta.env.VITE_NODE_ENV === 'development') {
        next();
    } else {
        if (to.meta.requiresAdmin) {
            const userStore = useUserStore();
            if (userStore.isAdmin) {
                next();
            } else {
                console.warn('You dont have permision')
                next('/');
            }
        } else {
            next();
        }
    }
});

export default router
