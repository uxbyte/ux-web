
import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import type { Router, RouteRecordNameGeneric, RouteLocationNormalizedLoadedGeneric } from 'vue-router';
import { ElMessage } from 'element-plus'

import { useRoute } from 'vue-router'

import { useEventBus } from '@vueuse/core'

import { configManager, configDefault } from '../../config'

import type { RouteName, MenuMeta, MenuBreadcrumb, MenuItem, MenuTree } from '../types'
import type { LayoutConfig } from '../../layout/types'
import { uxCrypto, uxUtils } from '../../utils'

type EventName = 'change'

const busEvent = useEventBus<EventName, MenuItem[]>('layout-menu')


// 根据用户权限过滤菜单
const useRouterStore = defineStore('useRouter', () => {

    const listRouter = ref<MenuItem[]>([])
    const userRouter = ref<MenuItem[]>([])
    const update = (menus: MenuItem[]) => {
        listRouter.value = menus.map(menu => {
            let mType = menu.type;
            if (mType == void 0) {
                const hasChildren = menus.filter(m => m.parentId == menu.uuid && m.type != 'BUTTON').length > 0;
                mType = hasChildren ? 'DIR' : 'MENU';
            }
            return {
                type: mType,
                visible: 'Y',
                usable: 'Y',
                ...menu,
            } as MenuItem;
        });
        userRouter.value = listRouter.value.filter(m =>
            m.type !== 'BUTTON' && m.usable === 'Y'
        ).map(menu => {
            if (menu.routePath && !menu.routeName) {
                menu.routeName = menu.routePath.split('/').filter(Boolean)
                    .filter((part, i, arr) => {
                        if (i === arr.length - 1 && /^index\.\w+$/.test(part)) {
                            return false;
                        }
                        return true;
                    })
                    .map((part, i, arr) => {
                        if (i === arr.length - 1 && part.includes('.')) {
                            return part.replace(/\.\w+$/, '');
                        }
                        return part;
                    })
                    .join('_');
            }
            return menu;
        });
    }

    const clearfix = () => listRouter.value = []

    watch(() => userRouter.value, (values) => {
        busEvent.emit('change', values)
    })

    return { userRouter, listRouter, update, clearfix }

}, {
    persist: {
        key: 'userRouter',
        pick: ['userRouter'],
        storage: sessionStorage,
        serializer: {
            serialize: (data) => {
                return uxCrypto.encrypt(JSON.stringify(data))
            },
            deserialize: (raw) => {
                return JSON.parse(uxCrypto.decrypt(raw))
            }
        }
    },
})


class MenuManager {

    private config: LayoutConfig = configDefault.Layout;

    private store() {
        this.config = configManager.get('Layout') || configDefault.Layout;
        if (this.config === false || (typeof this.config === 'string' && this.config !== 'template')) {
            throw new Error('Layout 配置错误');
        }
        return useRouterStore();
    }

    /**
     * 更新菜单
     * @param menus 
     */
    update(menus: MenuItem[]): void {
        this.clearfix();
        this.store().update(menus);
    }

    /**
     * 清空菜单
     */
    clearfix(): void {
        this.store().clearfix();
    }

    /**
     * 获取所有菜单(可用的)
     */
    getRouters(): MenuItem[] {
        return this.store().listRouter;
    }

    /**
     * 获取所有菜单(启用且不是按钮的)
     */
    getMenus(): MenuItem[] {
        return this.store().userRouter.filter(e => e.visible === 'Y');
    }

    /**
     * 获取所有按钮(启用的)
     */
    getButtons(): MenuItem[] {
        return this.getRouters().filter(e => e.visible === 'Y' && e.type == 'BUTTON');
    }

    /**
     * 获取菜单
     * @param routeName 菜单名称
     * @returns 
     */
    get(routeName: RouteName): { index: number, menu?: MenuItem } {
        if (!this.config || typeof this.config === 'string') {
            return { index: -1 };
        }
        const listRouters = this.getRouters();
        const index = listRouters.findIndex(e => e.routeName == routeName)
        return { index, menu: listRouters[index] }
    }

    /**
     * 激活菜单
     * @param menu 菜单名称
     */
    activate(menu: RouteName | MenuMeta) {
        const route = uRoute.value || useRoute()
        if (route.name != void 0) {
            layoutMenuMeta.value.set(route.name, menu);
        }
    }

    /**
     * 监听菜单变化
     * @param eventName 事件名称：change
     * @param listener 监听器
     */
    on(eventName: EventName, listener: (menus?: MenuItem[]) => void) {
        busEvent.on((e, payload) => {
            if (e === eventName) {
                listener(payload)
            }
        })
    }

    /**
     * 监听菜单变化
     * @param eventName 事件名称：change
     * @param listener 监听器
     */
    once(eventName: EventName, listener: (menus?: MenuItem[]) => void) {
        busEvent.once((e, payload) => {
            if (e === eventName) {
                listener(payload)
            }
        })
    }

}

export const menuManager = new MenuManager();

const uRoute = ref<RouteLocationNormalizedLoadedGeneric>();
const uRouter = ref<Router>();

const listMenu = computed(() => menuManager.getMenus())
export const listMenuTree = computed(() => {
    return uxUtils.listToTree<MenuItem, MenuTree>(
        listMenu.value, "uuid", "parentId", "children", "0"
    );
})

const layoutMenuMeta = ref<Map<RouteRecordNameGeneric, RouteName | MenuMeta>>(new Map())

const layoutMenu = computed(() => {
    if (!uRoute.value) { return false }
    const layout = uRoute.value?.meta.uxLayout;
    if (layout != undefined && layout != false && typeof layout != 'string') {
        if (layout.menu?.activeName) {
            return layout?.menu;
        }
    }
    const menuMeta = layoutMenuMeta.value.get(uRoute.value.name)
    if (menuMeta) {
        return typeof menuMeta === 'string' ? {
            activeName: menuMeta
        } : menuMeta;
    }
    return false;
})

export const navbar = computed(() => {
    let active = 0;
    const list = listMenu.value.filter(e => e.parentId === '0');
    if (uRoute.value) {
        const menu = listMenu.value.find(e => e.routeName === menuActive.value);
        if (menu) {
            const listBreadCrumbs = transBreadCrumbs(menu.uuid, 'uuid');
            if (listBreadCrumbs.length > 0) {
                const index = list.findIndex(e => e.uuid === listBreadCrumbs[0]?.uuid)
                active = index || 0;
            }
        } else if(uRoute.value.name){
            active = uRoute.value.name == 'home' ? 0 : -1;
        }
    }
    return { active, list }
})

export const listNavbarMenu = computed(() => {
    return listMenuTree.value[navbar.value.active]?.children || [];
})

export const getListMenu = (route: RouteLocationNormalizedLoadedGeneric, router: Router) => {
    uRoute.value = route
    uRouter.value = router
    return Promise.resolve({
        list: listMenu.value,
        listTree: listMenuTree.value
    })
}


export const handleClickNavbar = async (navMenu: MenuItem, index: number) => {
    let toRoute: MenuItem | MenuTree | null = navMenu
    const menuTree = listMenuTree.value[index]
    if ((menuTree?.children && menuTree?.children.length > 0)) {
        function findFirstLeafNode(item: MenuTree): MenuTree | null {
            if (!item.children || item.children.length === 0) {
                return item;
            }
            const children = item.children.filter(element => element.target !== '_blank');
            for (const element of children) {
                const childNode = findFirstLeafNode(element);
                if (childNode) {
                    return childNode;
                }
            }
            return null;
        }
        toRoute = findFirstLeafNode(menuTree);
        if (toRoute) {
            await handleClickMenuItem(toRoute);
            return;
        }
    }
    const toRoutePath = toRoute?.routePath || '/';
    await uRouter.value?.push({ path: toRoutePath })
}

export const menuActive = computed(() => {
    if (!uRoute.value) { return '' }
    if (layoutMenu.value === false || !layoutMenu?.value?.activeName) {
        return uRoute.value.name?.toString() || 'home';
    }
    const { activeName, separator } = layoutMenu.value;
    if (typeof activeName === 'string') {
        return activeName;
    }
    if (separator != undefined && separator !== false && typeof separator === 'string') {
        return activeName.join(separator);
    }
    return activeName[activeName.length - 1]
})


//展开的菜单
export const listMenuOpens = ref<string[]>([])
//快捷菜单
export const listMenuQuick = ref<MenuItem[]>([])

export const handleClickMenuItem = async (menu: MenuItem) => {
    if (!menu.routePath) {
        ElMessage.warning("菜单项未配置组件路径");
        return false;
    }
    if (menu.target === '_blank') {
        const href = uRouter.value?.resolve({
            path: menu.routePath
        }).href
        uRouter.value?.replace
        window.open(href)
        return;
    }
    await uRouter.value?.push({ path: menu.routePath })
    if (listMenuQuick.value.length > 10) {
        listMenuQuick.value.splice(0, 1)
    }
    listMenuQuick.value.push(menu)
}

const transBreadCrumbs = (parent: string, key: keyof MenuTree) => {
    return uxUtils.findTreeParents<MenuTree, MenuItem>(
        listMenuTree.value, parent, key
    ).reverse()
}

// 菜单面包屑
export const breadCrumbs = computed<MenuBreadcrumb[]>(() => {
    if (layoutMenu.value !== false) {
        const breadcrumb = layoutMenu.value?.breadcrumb
        if (breadcrumb) {
            return breadcrumb
        }
    }
    const menu = listMenu.value.find(m => m.routeName == menuActive.value);
    if (!menu) return [];
    const values = transBreadCrumbs(menu.uuid, 'uuid');
    const openName = values.map(e => e.routeName || '').filter(Boolean).slice(1, -1);
    listMenuOpens.value = openName
    return values.map(val => {
        return {
            text: val.name,
            routePath: val.routePath,
        } as MenuBreadcrumb
    });
})