import Qs from 'qs'
import { computed, type ShallowRef } from 'vue'
import { createFetch, type UseFetchReturn, type UseFetchOptions } from '@vueuse/core'
import { ElMessage, ElNotification } from 'element-plus'

import { uxVerify } from './verify'

import { configManager, configDefault } from './../config'

type ApiMethod = 'GET' | 'POST' | 'DELETE'

export type ApiRequest = {
    baseURL: string,
    intercept?: UseFetchOptions
}

export type ApiRespAll<T> = {
    total: number,
    list: Array<T>
}

export type ApiRespList<T> = ApiRespAll<T> & {
    pageSize: number,
    pageNumber: number,
    pageTotal: number
}

export type ApiRespReturn<T> = {
    code: number,
    data: T,
    message: string,
}

type FetchReturn<T> = Omit<UseFetchReturn<T>, 'data'> & {
    data: ShallowRef<T>
}

const refreshSubscribers: Array<() => void> = []

const config = computed(() => {
    return configManager.get('uxRequest') || configDefault.uxRequest
})

const BASE_URL = (url: string): URL => {
    if (uxVerify.url(url)) {
        return new URL(url);
    }
    const { baseURL } = config.value
    if (baseURL == null || baseURL.trim() == "") {
        return new URL(url, window.location.origin);
    }
    try {
        return new URL(
            url.replace(/^\/+/, ''),
            baseURL.replace(/\/*$/, '/')
        )
    } catch (e) {
        const path = (baseURL.replace(/\/*$/, '/'))
            .concat(url.replace(/^\/+/, ''))
            .replace(/\/\//g, '/');
        return new URL(path, window.location.origin)
    }
}

const transformParams = (params = {}) => {
    const query: Record<string, any> = {};
    if (Object.keys(params).length > 0) {
        for (const [key, value] of Object.entries(params)) {
            if (value === null || value === undefined || value === "") {
                continue;
            }
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    query[key] = value.join(",");
                }
            } else {
                query[key] = value;
            }
        }
    }
    return Qs.stringify(query, { arrayFormat: "repeat" });
}

const createIntercept = () => {
    return {
        updateDataOnError: true,
        async beforeFetch({ options }) {
            options.cache = 'default'
            return { options }
        },
        async afterFetch({ data, response, context, execute }) {
            const apiResp = data as ApiRespReturn<any>
            if (apiResp == null) {
                context.cancel()
                return Promise.reject(new Error("接口未返回数据"));
            }
            if (apiResp.code != 200) {
                context.cancel()
                let message: string = apiResp.message
                if (apiResp.code == 401) {
                    refreshSubscribers.length = 0;
                    message = "登录已过期"
                } else if (apiResp.code == 10102) {
                    refreshSubscribers.length = 0;
                    return new Promise((resolve) => {
                        refreshSubscribers.push(() => {
                            execute().then((response) => {
                                resolve({ data, response })
                            })
                        })
                    })
                }
                ElMessage.error(message)
                throw new Error(message)
            }
            return { data, response }
        },
        onFetchError({ error, data, response }) {
            if (response?.status === 404) {
                ElMessage.error('资源不存在')
            } else if (response?.status === 500) {
                ElNotification({
                    title: '提示',
                    type: 'error',
                    message: '网络异常',
                })
            }
            return { error, data }
        },
    } as UseFetchOptions
}

const newRequest = (options?: UseFetchOptions) => {
    const { intercept } = config.value
    return createFetch({
        combination: 'overwrite',
        fetchOptions: {
            mode: 'cors',
        },
        options: options || intercept || createIntercept(),
    })
}


class Request {

    private options?: UseFetchOptions;

    constructor(options?: UseFetchOptions) {
        this.options = options;
    }

    async request<T>(url: string, method: ApiMethod = "GET", params: Record<string, any> = {}, options?: RequestInit): Promise<FetchReturn<ApiRespReturn<T>>> {
        let apiResp: UseFetchReturn<ApiRespReturn<T>>;
        if (method === 'GET') {
            if (params && Object.keys(params).length > 0) {
                if (url.includes("?")) {
                    url = `${url}&${transformParams(params)}`
                } else {
                    url = `${url}?${transformParams(params)}`
                }
            }
        }

        const apiRequest = newRequest(this.options)(BASE_URL(url).toString(), options || {});

        if (method === "GET") {
            apiResp = await apiRequest.get().json<ApiRespReturn<T>>();
        } else if (method === "POST") {
            apiResp = await apiRequest.post(params).json<ApiRespReturn<T>>();
        } else if (method === "DELETE") {
            apiResp = await apiRequest.delete(params).json<ApiRespReturn<T>>();
        } else {
            return Promise.reject(new Error("不支持的请求方式"));
        }
        const statusCode = apiResp.statusCode.value;
        if (statusCode != 200) {
            return Promise.reject(new Error(`网络异常: ${statusCode}`));
        }
        if (apiResp.error.value) {
            return Promise.reject(apiResp.error.value)
        }
        return apiResp as unknown as FetchReturn<ApiRespReturn<T>>
    }

    /**
     *
     * @param url 访问地址
     * @param params 访问参数
     * @returns {Promise<*|undefined>}
     */
    get<T>(url: string, params?: Record<string, any>, options?: RequestInit): Promise<FetchReturn<ApiRespReturn<T>>> {
        return this.request<T>(url, "GET", params, options)
    }

    /**
     *
     * @param url 访问地址
     * @param data 访问参数
     * @returns {Promise<*|undefined>}
     */
    post<T>(url: string, data?: Record<string, any>, options?: RequestInit): Promise<FetchReturn<ApiRespReturn<T>>> {
        return this.request<T>(url, "POST", data, options)
    }

    /**
     *
     * @param url 访问地址
     * @param params 访问参数
     * @returns {Promise<*|undefined>}
     */
    delete<T>(url: string, params?: Record<string, any>, options?: RequestInit): Promise<FetchReturn<ApiRespReturn<T>>> {
        return this.request<T>(url, "DELETE", params, options)
    }

    /**
     *
     * @param url 访问地址
     * @param params 访问参数
     */
    async download(url: string, params?: Record<string, any>,) {
        if (params && Object.keys(params).length > 0) {
            if (url.includes("?")) {
                url = `${url}&${transformParams(params)}`
            } else {
                url = `${url}?${transformParams(params)}`
            }
        }
        url = BASE_URL(url).toString();

        const download = (url: string, filename: string,): Promise<void> => {
            return new Promise<void>((resolve, reject) => {
                // 创建 a 标签，直接设置 href 和 download
                const link = document.createElement('a');
                link.href = url;
                link.download = filename.replace(/[\\/:*?"<>|]/g, '_');
                link.style.display = 'none';
                // 如果是跨域，download 属性可能被忽略，但至少会导航到文件
                // 可添加 target="_blank" 但会引起新窗口，这里不添加，让浏览器决定
                document.body.appendChild(link);
                link.click();

                setTimeout(() => {
                    document.body.removeChild(link);
                    resolve()
                }, 200);
            })
        }

        try {
            // 设置超时，避免请求过久 (可选)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);

            const response = await (window.fetch || fetch).bind(window)(url, {
                signal: controller.signal,
                // 大部分公开文件不需要 credentials，避免因为凭据导致CORS失败
                credentials: 'omit',
                // 使用 no-cors 模式无法读取 blob，所以必须 cors 模式，否则 response.type 为 opaque
                mode: 'cors',
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const blob = await response.blob();

            // 尝试从 URL 或 Content-Disposition 提取文件名
            let filename = '';
            // 1) 从 Content-Disposition 解析 (如果有)
            const contentDisposition = response.headers.get('Content-Disposition');
            if (contentDisposition) {
                // 支持 filename*=UTF-8'' 和 filename=
                const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"'\n]+)/i);
                if (filenameMatch && filenameMatch[1]) {
                    filename = decodeURIComponent(filenameMatch[1]);
                }
            }

            // 2) 如果没解析到，从 URL path 提取
            if (!filename) {
                try {
                    // 取路径最后一部分
                    const pathname = new URL(url).pathname;
                    const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
                    // 如果最后一段包含查询参数，去掉查询
                    if (lastSegment) {
                        filename = lastSegment.split('?')[0].split('#')[0];
                    }
                } catch (e) {
                    // 忽略
                }
            }

            // 3) 仍无文件名，使用默认名
            if (!filename) {
                filename = 'download';
            }
            // 创建 blob 链接并下载
            const urlBlob = window.URL.createObjectURL(blob);
            download(urlBlob, filename).then(() => {
                window.URL.revokeObjectURL(urlBlob);
            })
        } catch (fetchError) {
            console.warn('fetch 下载失败，尝试直接链接下载:', fetchError);

            // 策略2: 降级为直接使用 <a download> （对于同源资源通常可行，跨域可能只是打开）
            try {
                // 尝试从 URL 提取文件名
                let filename = '';
                try {
                    const pathname = new URL(url).pathname;
                    const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
                    if (lastSegment) {
                        filename = lastSegment.split('?')[0].split('#')[0];
                    }
                } catch (e) { /* 忽略 */ }

                if (!filename) {
                    filename = 'download';
                }
                await download(url, filename)
            } catch (directError) {
                console.error('直接下载也失败:', directError);
            }
        }
    }


    /**
     * 流式请求
     * @param url 访问地址
     * @param data 访问参数
     * @param headers 自定义头部
     */
    stream(url: string, data?: Record<string, any>, headers?: Record<string, any>): Promise<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>> {
        return new Promise((resolve, reject) => {
            window.fetch(BASE_URL(url), {
                method: 'POST',
                headers: {
                    ...headers,
                    'Accept': 'text/event-stream',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(async (response) => {
                if (response.status !== 200) {
                    reject(new Error(response.statusText));
                    return;
                }
                if (response.body) {
                    resolve(response.body.getReader());
                    return
                }
                reject(new Error('未知错误'));
            }).catch(_ => reject(new Error('网络异常')))
        })
    }
}

export const uxRequest = new Request();

export const createRequest = (options?: UseFetchOptions) => {
    return new Request(options);
}
