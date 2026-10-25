import * as vue from 'vue';
import type { Router, RouteRecordRaw, RouteLocationRaw } from 'vue-router';

import type { okVal as updatePwdOKVal } from './components/update_pwd.vue'

export type LayoutConfig = {
    routes: RouteRecordRaw[],
    router?: (app: vue.App, router: Router) => void
} | false | 'template'

export type LayoutTemplate = 'aside' | 'top' | 'nav' | 'classics' | 'mix';
export type LayoutEvent = 'userinfo' | 'update_pwd' | 'logout'

export type LayoutProps = {
    appName?: string
    appLogo?: string | false
    appVersion?: string
    userInfo?: {
        avatar?: string
        nickname?: string
    }
    styles?: {
        header?: {
            height?: number
        },
        navbar?: {
            width?: number
            direction?: 'column' | 'row'
            bgColor?: string
            shadowColor?: string | false
        }
        menu?: {
            width?: number
            bgColor?: string
        }
    }
}

export type LayoutEmits = {
    (e: 'update:layout', val: LayoutTemplate): void
    (e: 'click', val: Omit<LayoutEvent, 'update_pwd'>): void,
    (e: 'update_pwd', val: updatePwdOKVal): void
}

export type MenuType = 'DIR' | 'MENU' | 'BUTTON'

export type MenuMeta = {
    // 是否通过连接符号将`activeName`数组连接起来，默认false
    separator?: false | string,
    // 激活菜单名称
    activeName: RouteName | RouteName[],
    breadcrumb?: false | MenuBreadcrumb[],
}

export type RouteName = string;

export type MenuBreadcrumb = { routePath?: RouteLocationRaw, text: string }

export type MenuItem = {
    uuid: string,
    name: string,
    parentId: string,
    type?: MenuType,
    target?: '_blank' | '_self',
    routeName?: RouteName,
    routePath?: string,
    permission?: string,
    description?: string,
    visible?: 'Y' | 'N',
    usable?: 'Y' | 'N',
    iconfont?: string,
    iconsvg?: string
}

export type MenuTree = MenuItem & {
    children: Array<MenuTree>
}