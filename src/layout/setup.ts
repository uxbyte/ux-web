
import { Component, DefineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const templates = import.meta.glob('./template/pages/*.vue', { eager: true })

const layouts: Record<string, Component> = {}

Object.entries(templates).forEach(([name, component]) => {
    const comp = (component as DefineComponent).default
    layouts[comp.name || comp.__name || name] = comp
})

export function setupLayouts(routes: RouteRecordRaw[]) {
    function deepSetupLayout(routes: RouteRecordRaw[], top = true) {
        return routes.map(route => {

            if (route.children && route.children?.length > 0) {
                route.children = deepSetupLayout(route.children, false)
            }

            if (route.meta?.uxLayout === false) {
                return route
            }

            let layoutName = 'default'
            if (typeof route.meta?.uxLayout === 'string') {
                layoutName = route.meta.uxLayout
            } else {
                layoutName = route.meta?.uxLayout?.name || 'default'
            }

            if (top) {
                const skipLayout = !route.component && route.children?.find(r => (r.path === '' || r.path === '/') && r.meta?.isLayout)

                if (skipLayout) {
                    return route
                }

                return {
                    path: route.path,
                    component: layouts[layoutName.toLowerCase()],
                    children: route.path === '/' ? [route] : [{ ...route, path: '' }],
                    meta: { isLayout: true }
                }
            }

            return {
                path: route.path,
                component: layouts[layoutName.toLowerCase()],
                children: [{ ...route, path: '' }],
                meta: { isLayout: true }
            }

        })
    }

    return deepSetupLayout(routes)

}
