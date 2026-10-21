# ux-Web

一个基于Vue\Vite\ElementPlus的适用于UxWeb项目的组件库

## 集成技术栈
- 默认集成了 [Vite](https://cn.vitejs.dev/)、[Vue3](https://cn.vuejs.org/)、[Pinia](https://pinia.vuejs.org/zh)、[pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate)
- 默认集成了 [ElementPlus](https://element-plus.org/)组件库、[VueUse/core](https://vueuse.nodejs.cn/guide/)、[Sass](https://www.sass.hk/)、[qs](https://github.com/ljharb/qs)

## 安装

```bash
npm install ux-web
# 或
pnpm add ux-web
# 或
yarn add ux-web
```

## 快速开始

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import UxWeb from 'ux-web'
import 'ux-web/index.css'

const app = createApp(App)
app.use(UxWeb)
app.mount('#app')
```

## 全局配置
```typescript
const config:UxWebConfig = {
    // 应用配置
    app: {
        logo: string, // logo
        name: string, // 应用名称
        version: string // 应用版本
    },
    // iconfont 组件配置
    IconFont: {
        size: '1em' as string, // iconfont 图标大小
        color: 'currentColor' as string, // iconfont 图标颜色
        jsURL: 'https://at.alicdn.com/t/font_xxxxxx.js' as string // iconfont js 地址
    },
    // 使用路由模式时,可通过meta.uxLayout管理layout布局
    // 使用模板模式时,可通过uxLayout组件管理layout布局
    Layout: {
      routes: RouteRecordRaw[],// 路由配置
      router?: (app: vue.App, router: Router) => void // 路由操作
    } | false | 'template',
    // 上传组件配置
    Upload: {
        baseURL: '' as string, // 上传接口地址
        urls: {
            file: `/upload/file` as string, // 文件上传接口
            image: `/upload/image` as string, // 图片上传接口
            video: `/upload/video` as string, // 视频上传接口
            audio: `/upload/audio` as string, // 音频上传接口
        } | string,
        maxSize: {
            file: (1024 * 1024 * 20) as number, // 文件最大大小
            image: (1024 * 1024 * 2) as number, // 图片最大大小
            audio: (1024 * 1024 * 10) as number, // 音频最大大小
            video: (1024 * 1024 * 500) as number // 视频最大大小
        } | number,
    },
    // 请求工具类配置
    uxRequest: {
        baseURL: '/' as string, // 接口地址
        intercept: {
          async beforeFetch({ options }) {
            return { options }
          },
          async afterFetch(response) {
            return response
          },
        } as UseFetchOptions
    },
    // 加密工具类配置
    uxCrypto: {
        key: '9627F8751BAC3190' as string,
        iv: 'AE14D873A093C352' as string
    }
}

app.use(UxWeb, config)
```

### 全局配置管理
```typescript
import {configManager} from 'ux-web'
// 更新全局配置
configManager.update(config:UxWebConfig)
// 获取全局配置
configManager.getConfig()
// 获取配置项
configManager.get(key:keyof UxWebConfig)
```

## Layout 集成

### 配置(Layout模式)
```typescript
// 关闭Layout模式
let config = {
  Layout: false
}
app.use(UxWeb, config)
```

### 配置(Layout模式)
```typescript
// main.ts
import { routes } from 'vue-router/auto-routes'

// 路由(Layout)模式
let config = {
  // ...其他配置,
  Layout:{
    routes,
    router(app:vue.App,router:Router){
      // 路由拦截
      router.beforeEach((to, from, next) => { 

      })
    }
  }
}
app.use(UxWeb, config)
```

### 使用方式(Layout模式)
```html
<template>
</template>

<script setup>

  definePage({
      meta: {
          uxLayout: 'ux-layout-side'// ux-layout-side | ux-layout-aside | ux-layout-mix
      }
  })
</script>

```

### 配置(组件模式)
```javascript
let config = {
  // ...其他配置,
  Layout:'template'
}
app.use(UxWeb, config)
```

### 使用(组件模式)

```html
<template>
    <ux-layout></ux-layout>
</template>
```

- 参数

| 名称 | 说明| 类型|
| :-: | - | - |
| layout | 布局方式 | Object<'mix'|'aside'|'side'> |
| appName | 应用名称 | Object<string> |
| appLogo | 应用Logo | Object<string | false> |
| appVersion | 应用版本信息 | Object<string> |
| userInfo | 用户信息 | Object<{avatar: string,nickname: string}> |
| styles | 样式控制 | Object<LayoutProps['styles']> |

- 插槽

| 名称 | 说明| 默认 |
| :-: | - | - |
| top | 顶部导航栏 | |
| top-center | 顶部导航栏中部 | |
| top-tail | 顶部导航栏右侧 | |
| default | 中部右侧 | router-view |
| main-extend | 中部右侧 |  |
| bottom-left | 底部左侧 |  |
| bottom-tail | 底部右侧 |  |


- 事件

| 事件名 | 说明 | 类型 |
| :-: | - | - |
| update_pwd | 点击顶部下拉菜单‘修改密码’并完成表单后确认触发 | (val: updatePwdOKVal) => void | 
| click | 点击顶部下拉菜单‘修改密码’项以外点击触发 | (type: EventType) => void | 

```typescript
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

```

### Layout 菜单统一管理
```typescript
import { menuManager, type MenuItemInstance } from 'ux-web/layout'
// 更新菜单项
menuManager.update([] as MenuItemInstance[]);
// 获取菜单项
let menus:MenuItemInstance[] = menuManager.getRouters();
```

## 组件

- UxPages：页面级组件，基于 ElementPlus 的 Table、Pagination 组件，封装了常用功能。从上至下依次分为提示区、查询区、操作区、表格区、分页区域。

> 属性

| 名称 | 说明| 类型|备注|
| :-: | - | - | - |
| url | 数据查询接口 | string | - |
| data | 数据列表 | any[] | 同ElTable 的 data 属性 |
| queryParams | 数据查询参数 | Record<string,any> | - |
| showQuery | 显示查询区 | Boolean | 默认：True |
| showAction | 显示操作区 | Boolean | 默认：True |
| pagination | 显示分页区 | Boolean | 默认：True |
| beforeRender | 渲染前置操作 | (list:any[]) => any[] | - |
| loadtime | 数据查询时机 | onready、manual | 默认为 onready |
| $attrs | 同 ElTable 属性 | any |  |


> 插槽

| 名称 | 说明|
| :-: | - |
| tips | 操作提示区 |
| search | 查询区 |
| action | 操作区 |
| default | 表格区，仅支持 ElementPlus 的 TableColumn 组件 |

- UxIconFont：基于IconFont封装的图标组件。需配置iconfont.js参数

> 参数

| 名称 | 说明| 类型|备注|
| :-: | - | - | - |
| name | 图标名称 | string | - |
| size | 图标大小 | string | 默认1em |
| color | 图标颜色 | string | 默认currentColor |

- UxRequest：基于useRequest封装的数据请求组件。需配置uxRequest.baseURL参数

> 属性

| 名称 | 说明| 类型|备注|
| :-: | - | - | - |
| url | 数据请求接口 | string | - |
| method | 图标大小 | GET,POST | 默认GET |
| queryParams | 数据查询参数 | Record<string,any> | - |
| cache | 数据缓存 | Boolean, Number | 默认-1 |
| load | 渲染前置操作 | (data:any) => any | - |


> 插槽

| 名称 | 参数 |
| :-: | - |
| default | (loading:boolean,response:any,error:string) |

> 事件

| 名称 | 参数 | 说明 |
| :-: | - | - |
| success | (response:any)=>void | 请求成功触发 |



## 工具类

- uxRequest：一个基于 createFetch(@vueuse/core) 的数据请求工具。

```typescript
/**
*
* @param url 访问地址
* @param params 访问参数
* @returns {Promise<T>}
*/
uxRequest.get<T>(url: string, params?:Record<string,any>, options?: RequestInit): Promise<FetchReturn<ApiRespReturn<T>>>
uxRequest.post<T>(url: string, data?:Record<string,any>, options?: RequestInit): Promise<FetchReturn<ApiRespReturn<T>>>
uxRequest.put<T>(url: string, data?:Record<string,any>, options?: RequestInit): Promise<FetchReturn<ApiRespReturn<T>>>
uxRequest.delete<T>(url: string, params?:Record<string,any>, options?: RequestInit): Promise<FetchReturn<ApiRespReturn<T>>>
```

- uxUtils：常用工具类。
```typescript
/**
 * 生成随机数
 * @param length 长度
 * @param prefix 前缀
 * @param suffix 后缀
 * @returns 
 */
uxUtils.random(length: number | any = 2, prefix = '', suffix = ''): string
/**
 * 打乱数组顺序
 */
uxUtils.randomArray(array: T[]): T[]
/**
 * 转为千分位
 * @param value 值
 * @param len 长度
 * @returns 
 */
uxUtils.fmtMicrometer(value: number | string, len?: number): string 

// 其他更多
...

```

- uxMaths：数学计算（基于 [decimal.js](http://github.com/MikeMcl/decimal.js) 高精度数值计算库）
```typescript

/**
 * 加法
 */
uxMaths(val:number).plus(...values: (number | string)[]): Decimal
/**
* 减法
*/
uxMaths(val:number).minus(...values: (number | string)[]): Decimal
/**
* 乘法
*/
uxMaths(val:number).multiply(...values: (number | string)[]): Decimal
/**
* 除法
*/
uxMaths(val:number).divide(...values: (number | string)[]): Decimal
/**
* 平方根
*/
uxMaths(val:number).sqrt(...values: (number | string)[]): Decimal
/**
* 转为数字
*/
uxMaths(val:number).toDecimal(precision: number = 2): number
/**
* 转为固定小数位
*/
uxMaths(val:number).toFixed(precision: number = 2): number

// 支持链式调用

uxMaths(1).plus(1,2).minus(3).multiply(4).divide(5).toDecimal(2)

```