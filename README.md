# ux-web

一套基于Vue3.5 、Vite8 、ElementPlus2.3的适用于Web项目的轻量后台组件库

## 集成技术栈

- 默认集成了 [Vite](https://cn.vitejs.dev/)、[Vue3](https://cn.vuejs.org/)、[Pinia](https://pinia.vuejs.org/zh)、[pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate)
- 默认集成了 [ElementPlus](https://element-plus.org/)组件库、[VueUse/core](https://vueuse.nodejs.cn/guide/)、[Sass](https://www.sass.hk/)、[qs](https://github.com/ljharb/qs)

## Why

> 为什么不使用目前市面上的解决方案，比如vue-element-plus-admin、TDesign Starter等？
> 因为懒，不想研究源码

## 功能特性

- 开箱即用的 Layout 布局：内置 mix（混合）、aside（侧边）、side（顶部）三种布局，支持路由模式与组件模式两种接入方式
- 菜单统一管理：menuManager 提供菜单更新、获取、激活、监听等能力，支持菜单树、面包屑、多级菜单、外链与 BUTTON 类型权限标识
- 主题切换：UxTheme 内置明暗主题切换，深度集成 ElementPlus 暗黑模式（dark/css-vars）
- 请求封装：uxRequest 基于 createFetch(@vueuse/core) 封装，内置接口响应约定处理（401 登录过期、10102 等待凭证刷新后重发）、文件下载、流式请求（SSE）
- 通用业务组件：页面容器 UxPages、表格 UxTable、分页 UxPagination、弹窗 UxDialog、抽屉 UxDrawer、上传 UxUpload、图标 UxIconFont、数据请求 UxRequest、主题 UxTheme
- 工具集：uxUtils、uxVerify、uxCrypto、uxMaths、uxModal、uxCached、uxComponent，并注册到全局属性，可在模板中直接使用
- 按需自动导入：提供 UxWebResolver，配合 unplugin-auto-import、unplugin-vue-components 使用
- TypeScript 支持：完整的类型声明（UxWebConfig、组件 Props / Emits、工具类型等）

## 安装

```bash
npm install @bytegeek/ux-web
# 或
pnpm add @bytegeek/ux-web
# 或
yarn add @bytegeek/ux-web
```

> ux-web 通过 `peerDependencies` 声明以下依赖，需由宿主项目自行安装：

| 依赖 | 版本 |
| :-: | - |
| vue | >=3.5.30 |
| vue-router | >=5.0.4 |
| element-plus | >=2.13.6 |


## 快速开始

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import UxWeb from '@bytegeek/ux-web'
import '@bytegeek/ux-web/index.css'

const app = createApp(App)
app.use(UxWeb)
app.mount('#app')
```

## 全局配置项

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

### 布局模式

| 布局 | 说明 |
| :-: | - |
| mix | 混合模式：左侧一级导航栏，内容区为顶部头部 + 二级菜单 + 主区域 |
| aside | 侧边模式：左侧完整侧栏（logo + 一级导航 + 二级菜单），内容区为主区域 |
| side | 顶部模式：顶部头部 + 左侧完整菜单树 + 底部栏 |

### 配置(关闭)

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
<script setup lang="ts">
  import { uxLayout } from 'ux-web/layout'
</script>
```

- 参数

| 名称 | 说明| 类型|
| :-: | - | - |
| layout | 布局方式 | Object<'mix'\|'aside'\|'side'> |
| appName | 应用名称 | Object<string> |
| appLogo | 应用Logo | Object<string \| false> |
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

### 菜单项配置

| 名称 | 说明| 类型|
| :-: | - | :-: |
| uuid | 唯一标识（菜单树依赖） | string |
| name | 菜单名称 | string |
| parentId | 父级 uuid（根节点为 0） | string |
| type | 菜单类型（未配置时自动推断） | DIR \| MENU \| BUTTON |
| target | 打开方式 | _blank \|_self |
| routeName | 路由名称 | string |
| routePath | 路由路径 | string |
| permission | 权限标识 | string |
| description | 描述 | string |
| visible | 是否显： | Y \| N |
| usable | 是否可用 | Y \| N |
| iconfont | iconfont 图标名称 | string |
| iconsvg | svg 图标 | string |

### menuManager 方法

| 方法 | 说明 |
| :-: | - |
| update(menus) | 更新菜单 |
| clearfix() | 清空菜单 |
| getRouters() | 获取所有菜单（可用的） |
| getMenus() | 获取所有菜单（启用且不是按钮的） |
| getButtons() | 获取所有按钮（启用的） |
| get(routeName) | 获取指定菜单（返回索引与菜单项） |
| activate(menu) | 激活菜单（支持 RouteName 或 MenuMeta） |
| on(eventName, listener) | 监听菜单变化（change） |
| once(eventName, listener) | 监听菜单变化（change，仅触发一次） |

### 路由 meta.uxLayout 配置（Layout 模式）

| 名称 | 说明| 类型|
| :-: | - | - |
| uxLayout | 布局名称（ux-layout-mix、ux-layout-aside、ux-layout-side），false 为不使用布局 | string、false |
| uxLayout.name | 布局名称（对象形式，默认 default） | string |
| uxLayout.menu | 菜单配置 | MenuMeta |
| uxLayout.menu.activeName | 激活菜单名称 | string、string[] |
| uxLayout.menu.separator | activeName 为数组时通过连接符号连接，默认 false | false、string |
| uxLayout.menu.breadcrumb | 自定义面包屑，false 为不显示 | false、MenuBreadcrumb[] |
| requiresAuth | 是否需要登录鉴权，默认 true | boolean |

### 内置设置

布局内置“设置”抽屉（mix、aside 布局可通过左侧栏底部设置图标打开），提供：

| 设置项 | 说明 | 默认值 |
| :-: | - | - |
| 主题模式 | 明亮 / 暗黑 | - |
| 导航模式 | mix / aside / side | mix |
| 点击遮罩关闭弹窗 | 开关 | 否 |
| 按下Esc键关闭弹窗 | 开关 | 否 |
| 点击遮罩关闭抽屉 | 开关 | 否 |
| 按下Esc键关闭抽屉 | 开关 | 否 |

设置持久化在 localStorage（key：uxSettings），UxDialog、UxDrawer 组件会读取该设置控制关闭行为。

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

- UxTable：表格组件，基于 ElementPlus 的 Table 组件封装，内置数据请求、分页与树形数据渲染。

> 属性

| 名称 | 说明| 类型|备注|
| :-: | - | - | - |
| url | 数据查询接口 | string | 配置后自动请求（GET） |
| data | 数据列表 | Record<any,any>[] | 优先级高于接口数据 |
| limit | 每页条数 | number | 默认：20 |
| queryParams | 数据查询参数 | Record<string,any> | - |
| border | 显示边框 | Boolean | 默认：True |
| pagination | 显示分页区 | Boolean | 默认：True |
| total | 数据总数 | number | 与 url 二选一 |
| loading | 加载状态 | Boolean | - |
| loadtime | 数据查询时机 | onready、manual | 默认为 onready |
| beforeRender | 渲染前置操作 | (list:ApiRespList<any>) => Promise<ApiRespList<any>> | - |
| $attrs | 同 ElTable 属性 | any | 配置 rowKey 时列表自动转为树形数据 |

> 事件

| 事件名 | 说明 | 类型 |
| :-: | - | - |
| update:loading | 加载状态变化 | (val: boolean) => void |
| pageChange | 分页变化（未配置 url 时触发） | (val: { page: number, limit: number }) => void |
| complete | 数据渲染完成 | (val: any[]) => void |

> 暴露方法（通过 ref 获取）

| 名称 | 说明 |
| :-: | - |
| request(callback?) | 重新请求数据 |
| getListData(force?) | 获取当前列表数据 |

```html
<template>
    <ux-table url="/api/user/list" :query-params="{ status: 1 }" rowKey="id">
        <el-table-column prop="name" label="姓名" />
    </ux-table>
</template>
```

- UxPagination：分页组件，基于 ElementPlus 的 Pagination 组件封装。

> 属性

| 名称 | 说明| 类型|备注|
| :-: | - | - | - |
| page | 当前页码 | number | 默认：1 |
| limit | 每页条数 | number | 默认：10 |
| total | 数据总数 | number | 默认：0 |
| size | 尺寸 | small、large、default | 默认：small |

> 事件

| 事件名 | 说明 | 类型 |
| :-: | - | - |
| update:page | 页码变化 | (val: number) => void |
| update:limit | 每页条数变化 | (val: number) => void |
| change | 分页变化 | (val: { type: 'page' | 'size', page: number, limit: number }) => void |

- UxDialog：弹窗组件，基于 ElementPlus 的 Dialog 组件封装，内置底部操作按钮与确认 Loading。

> 属性

| 名称 | 说明| 类型|备注|
| :-: | - | - | - |
| modelValue | 显示状态 | Boolean | - |
| top | 弹窗顶部距离 | string | 默认：20px |
| showLoading | 确认按钮显示 Loading | Boolean | 默认：False |
| showHeader | 显示头部 | Boolean | 默认：True |
| showFooter | 显示底部 | Boolean | 默认：True |
| $attrs | 同 ElDialog 属性 | any | - |

> 插槽

| 名称 | 说明|
| :-: | - |
| default | 内容区 |
| header | 头部 |
| footer | 底部（默认提供取消、确认按钮） |

> 事件

| 事件名 | 说明 | 类型 |
| :-: | - | - |
| update:modelValue | 显示状态变化 | (val: boolean) => void |
| ok | 点击确认触发，执行完成后调用 done 结束 Loading | (done: () => void) => void |
| close | 关闭触发 | - |
| cancel | 加载中点击取消触发 | - |

```html
<template>
    <ux-dialog v-model="visible" show-loading @ok="handleOk">
        内容
    </ux-dialog>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const handleOk = (done: () => void) => {
    // 请求成功后关闭 Loading
    setTimeout(() => done(), 1000)
}
</script>
```

- UxDrawer：抽屉组件，基于 ElementPlus 的 Drawer 组件封装，头部默认为 PageHeader（返回 + 标题）。

> 属性

| 名称 | 说明| 类型|备注|
| :-: | - | - | - |
| modelValue | 显示状态 | Boolean | - |
| title | 标题 | string | - |
| backText | 返回按钮文字 | string | 默认：关闭 |
| size | 抽屉大小 | string | 默认：full |
| full | 全屏（预留页面边距） | Boolean | 默认：False |
| showLoading | 确认按钮显示 Loading | Boolean | 默认：False |
| showHeader | 显示头部 | Boolean | 默认：True |
| showFooter | 显示底部 | Boolean | 默认：True |
| $attrs | 同 ElDrawer 属性 | any | - |

> 插槽

| 名称 | 说明|
| :-: | - |
| default | 内容区 |
| header | 头部 |
| footer | 底部（默认提供取消、确认按钮） |

> 事件

| 事件名 | 说明 | 类型 |
| :-: | - | - |
| update:modelValue | 显示状态变化 | (val: boolean) => void |
| ok | 点击确认触发，执行完成后调用 done 结束 Loading | (done: () => void) => void |
| close | 关闭触发 | - |
| cancel | 加载中点击取消触发 | - |

- UxUpload：上传组件，基于 ElementPlus 的 Upload 组件封装，内置大小校验、图片预览、进度显示。需配置 Upload 参数。

> 属性

| 名称 | 说明| 类型|备注|
| :-: | - | - | - |
| modelValue | 绑定值 | string、string[]、UxFileResp、UxFileResp[] | multiple 为 True 时使用数组 |
| urls | 初始文件地址 | string、string[] | - |
| action | 上传接口地址 | string | 优先于全局 Upload 配置 |
| tips | 提示文案 | string、Boolean | 默认：True |
| size | 卡片/缩略图尺寸 | number | 默认：72 |
| multiple | 多选上传 | Boolean | 默认：False，最多 9 个 |
| disabled | 禁用 | Boolean | - |
| type | 上传类型 | file、image、video、audio | 默认：image |
| showFileList | 显示文件列表 | Boolean | 默认：True |
| $attrs | 同 ElUpload 属性 | any | - |

> 插槽

| 名称 | 说明|
| :-: | - |
| trigger | 触发区（作用域参数：tips、files） |
| tips | 提示区 |
| file | 文件项（作用域参数：file） |

> 事件

| 事件名 | 说明 | 类型 |
| :-: | - | - |
| update:modelValue | 绑定值变化 | (val) => void |
| update:urls | 地址列表变化 | (val: string | string[]) => void |
| success | 上传成功 | (val: UxFileResp) => void |
| remove | 移除文件 | (val: UploadFile) => void |

- UxTheme：主题切换组件，基于 useDark(@vueuse/core) 封装，切换 ElementPlus 暗黑模式。

> 属性

| 名称 | 说明| 类型|备注|
| :-: | - | - | - |
| mode | 显示模式 | capsule、tab | 默认：capsule |

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

- uxRequest 补充方法：文件下载与流式请求（SSE）。

```typescript
/**
 * 文件下载（自动从响应头/URL 解析文件名，失败时降级为直链下载）
 * @param url 访问地址
 * @param params 访问参数
 */
uxRequest.download(url: string, params?: Record<string,any>): Promise<void>
/**
 * 流式请求（SSE）
 * @param url 访问地址
 * @param data 访问参数
 * @param headers 自定义头部
 */
uxRequest.stream(url: string, data?: Record<string,any>, headers?: Record<string,any>): Promise<ReadableStreamDefaultReader<Uint8Array>>
/**
 * 创建自定义请求实例（可传入自定义拦截器）
 */
createRequest(intercept?: UseFetchOptions): Request
```

- uxVerify：常用正则校验与类型判断工具，全部返回 boolean。

> 方法

| 名称 | 说明|
| :-: | - |
| ipv4 | 验证IP格式 |
| domain | 验证域名格式 |
| email | 验证电子邮箱格式 |
| phone | 验证手机格式 |
| url | 验证URL格式 |
| date | 验证日期格式 |
| dateISO | 验证ISO类型的日期格式 |
| number | 验证十进制数字 |
| digits | 验证整数 |
| isLetterNumber | 是否字母和数字组合 |
| isImg | 验证图片(base64、文件名称) |
| isColor | 判断是否是16进制颜色 |
| isPercentage | 判断是否百分比 |
| idCard | 验证身份证号码 |
| carNo | 是否车牌号 |
| amount | 金额,只允许2位小数 |
| chinese | 中文 |
| letter | 只能输入字母 |
| json | 是否json字符串 |
| svg | 是否svg字符串 |
| contains | 验证是否包含某个值 |
| empty / isEmpty | 判断是否为空 |
| object | 是否对象 |
| isArray | 是否数组 |

- uxCrypto：加解密工具。需配置 uxCrypto.key、uxCrypto.iv 参数。

```typescript
// 加密（返回密文十六进制串）
uxCrypto.encrypt(value: string, key?: string, iv?: string): string
// 解密
uxCrypto.decrypt(value: string, key?: string, iv?: string): string
// MD5
uxCrypto.md5(value: string): string
// SHA256
uxCrypto.sha256(value: string): string
// 密码加密（SHA256 后再 AES 加密）
uxCrypto.password(password: string): string
// 生成 UUID
uxCrypto.uuid(length: number = 16): string
```

- uxModal：基于 ElMessageBox 的弹窗工具。

```typescript
// 确认弹窗（默认追加“此操作不可恢复”文案），callback 内调用 done() 关闭，done('reset') 复位按钮
uxModal.confirm(message: string, callback: (done: (command?: 'reset' | 'close') => void) => void)
// 提示弹窗
uxModal.alert(title: string, message: string, callback?: (action: Action) => void, option?: ElMessageBoxOptions)
// 输入并提交：确认后以 POST 提交 url，参数为 { [key]: 输入值, ...params }
uxModal.input(url: string, options: { text: string | string[], key: string | Record<string, any>, params?: Record<string, any> }, resolve: (done: () => void) => void, reject?: (message: string) => void)
// 自定义内容弹窗
uxModal.open(title: string, message?: ElMessageBoxOptions['message'], callback?: (instance: MessageBoxState, done: () => void) => void)
```

- uxCached：本地缓存工具（localStorage / sessionStorage），支持过期时间（秒）。

```typescript
// 设置缓存，expired 单位秒（0为不过期），session 为 true 时写入 sessionStorage
uxCached.set(key: string, value: T, expired?: number, session?: boolean): void
// 获取缓存（返回 Promise，已过期则返回空字符串）
uxCached.get<T>(key: string, session?: boolean): Promise<T>
// 移除缓存
uxCached.remove(key: string, session?: boolean): void
// 获取所有缓存
uxCached.all(session?: boolean): Promise<ItemInstance<any>[]>
```

- uxComponent：组件相关工具。

```typescript
// 带重试的异步组件加载器（默认重试3次）
uxComponent.loader(loader, delay?, timeout?): Component
// 表格列文本（点击复制）
uxComponent.table.copyText(text: string, message?: string | false)
// 表格列 tooltip（点击复制）
uxComponent.table.copyTooltip(data: TableTooltipData<any>)
```

## 自动导入

ux-web 提供 `UxWebResolver`，配合 [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)、[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 使用，可自动导入：

- 全局工具：uxUtils、uxVerify、uxCrypto、uxMaths、uxModal、uxCached、uxRequest、uxComponent
- ElementPlus 图标：`ElIcon` 前缀组件（如 `ElIconSearch` 对应 Search 图标）
- Layout 组件：`ux-layout` 系列组件（从 ux-web/layout 导入）

```typescript
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { UxWebResolver } from 'ux-web/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [UxWebResolver()],
      // 需在模板中使用 uxUtils 等工具函数时开启
      vueTemplate: true
    }),
    Components({
      resolvers: [UxWebResolver()]
    })
  ]
})
```

> 组件库已通过 `app.use(UxWeb)` 注册全部组件与 `ElIcon` 前缀图标，模板中可直接使用 `<ux-pages>`、`<ux-table>`、`<el-icon-*>` 等标签；uxUtils、uxVerify 等工具对象已挂载到全局属性（`$UxWeb` 为全局配置），模板中可直接访问。

## 常见问题

### 组件样式未生效？

请确认已引入样式文件：

```typescript
import 'ux-web/index.css'
// 或
import 'ux-web/dist/index.css'
```

### iconfont 图标不显示？

UxIconFont 组件依赖 iconfont 的 js 文件，需在全局配置中设置 `IconFont.jsURL`，组件渲染时会自动在 head 中插入该脚本。

### 接口请求返回的数据格式有什么要求？

uxRequest 约定接口返回格式为 `{ code, data, message }`（即 ApiRespReturn）：code 为 200 时视为成功；code 为 401 时提示“登录已过期”；code 为 10102 时挂起请求，等待凭证刷新后自动重发；其他 code 弹出 message 错误提示。如需自定义处理逻辑，可通过 `uxRequest.intercept` 配置覆盖默认拦截器。

### 表格接口的数据格式有什么要求？

UxTable 请求的接口需返回分页结构：`{ list: any[], total: number }`（即 ApiRespList），请求参数默认为 `{ page, limit, ...queryParams }`。也支持直接返回数组，此时总数取数组长度。

### 提示“Layout 配置错误”？

menuManager 需要在 Layout 路由模式或组件模式下使用。当 `Layout: false` 时，禁止调用菜单管理相关方法，否则会抛出该错误。

### 修改密码如何与后端对接？

监听 ux-layout 的 `update_pwd` 事件，参数中 oldPwd、newPwd、confirmPwd 已通过 `uxCrypto.password` 加密，请求完成后调用参数中的 `done()` 即可提示“修改成功”并关闭弹窗。

```html
<ux-layout @update_pwd="handleUpdatePwd"></ux-layout>
```

```typescript
const handleUpdatePwd = (val: updatePwdOKVal) => {
    const { done, ...params } = val
    uxRequest.post('/api/update_pwd', params).then(() => done?.())
}
```

### 如何获取组件库版本？

```typescript
import UxWeb from 'ux-web'
console.log(UxWeb.version)
```
