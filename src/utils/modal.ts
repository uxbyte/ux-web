import { ElMessageBox } from "element-plus";
import type { Action, ElMessageBoxOptions, MessageBoxState } from "element-plus";

import { uxRequest } from "./request";
import { uxSettings } from "../layout/template/libs/setting";

type Input = {
    text: string | string[],
    key: string | Record<string, any>,
    params?: Record<string, any>,
}

const closeOnClickModal = uxSettings.options.get('dialog', 'click')
const closeOnPressEscape = uxSettings.options.get('dialog', 'escape')

export const uxModal = {
    confirm(message: string, callback: (done: (command?: 'reset' | 'close') => void) => void) {
        return ElMessageBox.confirm(`${message}此操作不可恢复`, '提示', {
            type: 'warning',
            draggable: true,
            lockScroll: false,
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    instance.confirmButtonText = 'Loading...'
                    if (typeof callback == 'function') {
                        callback((command: 'reset' | 'close' = 'close') => {
                            if (command === 'close') {
                                done()
                            } else {
                                instance.confirmButtonLoading = false
                                instance.confirmButtonText = '确定'
                            }
                        })
                    } else {
                        done();
                        instance.confirmButtonLoading = false
                    }
                } else {
                    done()
                }
            }
        })
    },
    alert(title: string, message: string, callback?: (action: Action) => void, option: ElMessageBoxOptions = {}) {
        const options: ElMessageBoxOptions = {
            type: 'warning',
            draggable: true,
            showClose: false,
            lockScroll: false,
            closeOnClickModal,
            closeOnPressEscape,
            ...option,
            callback
        }
        ElMessageBox.alert(message, title, options)
    },
    /**
     * 
     * @param text 提示文本 | [标题，提示文本]
     * @param url 请求地址
     * @param key  键名或键值对 
     * @param params  附加参数 
     */
    input(url: string, options: Input, resolve: (done: () => void) => void, reject?: (message: string) => void) {
        let tips = '', title = '', key = '';
        if (Array.isArray(options.text)) {
            title = options.text[0] || '';
            tips = options.text[1] || '';
        } else {
            title = options.text;
            tips = `请输入${options.text}`;
        }
        let value = '';
        if (typeof options.key === 'object') {
            const index = Object.keys(options.key)[0];
            if (index) {
                value = options.key[index];
            }
            key = index || '';
        } else {
            key = options.key;
        }

        ElMessageBox.prompt('', title, {
            draggable: true,
            lockScroll: false,
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            inputPattern: /.+/,
            inputValue: value,
            closeOnClickModal,
            closeOnPressEscape,
            inputPlaceholder: `请输入${tips || title}`,
            inputErrorMessage: `${tips || title}不能为空`,
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    instance.confirmButtonText = 'Loading...'
                    let data: Record<string, any> = options.params || {};
                    data[key] = instance.inputValue;
                    uxRequest.post(url, data).then(() => {
                        resolve(done)
                    }).catch((error) => {
                        if (reject) {
                            reject(error.message)
                        }
                    }).finally(() => {
                        instance.confirmButtonLoading = false
                        instance.confirmButtonText = '确定'
                    })
                } else {
                    done();
                }
            }
        })
    },
    open(title: string, message?: ElMessageBoxOptions['message'], callback?: (instance: MessageBoxState, done: () => void) => void) {
        ElMessageBox({
            title,
            message,
            draggable: true,
            showClose: false,
            closeOnClickModal,
            closeOnPressEscape,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: '关闭',
            appendTo: document.body,
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    callback && callback(instance, done)
                } else {
                    done();
                }
            },
        })
    }
}