import type { RouteRecordRaw, Router } from 'vue-router'
import { createRouter as createVueRouter, createWebHistory } from 'vue-router'

import { setupLayouts } from '../layout/setup'

export const createWebRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    const renderRoute = (listRoute: RouteRecordRaw[]) => {
        for (let route of listRoute) {
            if (route.name) {
                const names = (route.name as string).split('/').filter(i => i)
                route.name = names.join('_')
            }
            route.meta ??= {}
            if (route.meta.requiresAuth == undefined) {
                route.meta.requiresAuth = true
            }
            if (route.children) {
                renderRoute(route.children)
            }
        }
    }
    renderRoute(routes)
    return routes;
}

export const createLayoutRouter = (routes: RouteRecordRaw[]): Router => {
    const webRoutes = createWebRoutes(routes);
    const router = createVueRouter({
        routes: setupLayouts(webRoutes),
        history: createWebHistory()
    })
    return router;
}

export const createRouter = (routes: RouteRecordRaw[]): Router => {
    const webRoutes = createWebRoutes(routes);
    const router = createVueRouter({
        routes: webRoutes,
        history: createWebHistory()
    })
    return router;
}