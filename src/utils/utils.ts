import { dayjs, ElMessage } from "element-plus";
import { useCloned, useTimeAgo } from '@vueuse/core'
import { uxVerify } from './verify'

/**
 * 生成随机数
 * @param length 长度
 * @param prefix 前缀
 * @param suffix 后缀
 * @returns 
 */
const random = (length: number = 2, prefix = '', suffix = '') => {
    let min = parseInt('1' + Array(length).join('0'));
    let max = parseInt('1' + Array(length + 1).join('0'));
    let number = Math.ceil(Math.random() * (max - min + 1) + min);
    return prefix + number + suffix;
}
/**
 * 打乱数组顺序
 */
const randomArray = <T>(array: T[]) => {
    const arr = [...array];
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        const index = Math.random() * (len - i);
        const temp = arr[index];
        arr[index] = arr[len - i - 1];
        arr[len - i - 1] = temp;
    }
    return arr;
}
/**
 * 唯一标识符
 * @param len 长度
 * @param radix 基数
 * @returns 
 */
const guid = (len = 32, radix = null) => {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [];
    let ix = radix || chars.length;

    if (len > 0) {
        for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * ix];
    } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    uuid.shift();
    return 'g' + uuid.join('');
}

/**
 * 格式化日期
 */
const dateFormat = (time: dayjs.ConfigType = new Date(), format: string = 'YYYY-MM-DD') => {
    return time ? dayjs(time).format(format) : '-';
}

/**
 * 格式化时间
 */
const timeFormat = (time: dayjs.ConfigType = new Date(), format: string = 'YYYY-MM-DD HH:mm:ss') => {
    return time ? dayjs(time).format(format) : '-';
}

/**
 * 时间之前
 * @param time 时间
 * @returns 
 */
const timeAgo = (time: Date | number | string) => useTimeAgo(time).value

/**
 * 转为千分位
 * @param value 数值
 * @param len 小数位长度，默认为0
 * @returns
 */
const fmtMicrometer = (value: string | number, len: number) => {
    if (value.toString().indexOf('.') > 0) {
        let int = value.toString().split('.')[0];
        if (len > 0) {
            int = (Array(len).join("0") + parseInt(value.toString())).slice(-len)
        }
        return int?.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return s + ','
        }) + `.${value.toString().split('.')[1]}`
    } else {
        if (len > 0) {
            value = (Array(len).join("0") + parseInt(value.toString())).slice(-len)
        }
        return value.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return s + ','
        })
    }
}
/**
 * 列表转树形
 * @param {Array} list 列表数据
 * @param idKey id键，默认为'id'
 * @param parentKey 父id键，默认为'parentId'
 * @param children 子节点键，默认为'children'
 * @param rootId 根节点id，默认为0
 */
const listToTree = <T, R>(
    list: T[] = [],
    idKey: keyof T = "id" as keyof T,
    parentKey: keyof T = 'parentId' as keyof T,
    childrenKey: keyof R = 'children' as keyof R,
    rootId: number | string = 0
) => {

    const tree: R[] = []
    const childrenMap = {} as Record<any, R[]>;

    for (const item of list) {
        const id = item[idKey] as any
        const parentId = item[parentKey] as any

        // 初始化当前节点的子节点列表
        if (!childrenMap[id]) {
            childrenMap[id] = [];
        }

        // 将当前节点的子节点赋值给它自己（不影响原数据）
        const node = { ...item, [childrenKey]: childrenMap[id] } as R;

        // 如果有父节点，则加入父节点的子节点列表中
        if (parentId !== undefined && parentId !== rootId) {
            if (!childrenMap[parentId]) {
                childrenMap[parentId] = [];
            }
            childrenMap[parentId].push(node);
        } else {
            // 没有父节点，就是根节点
            tree.push(node);
        }
    }
    return tree;
}
/**
 * 树形转列表
 * @param tree 树形数据
 * @param childrenKey 子节点键，默认为'children'
 * @returns 列表数据
 */
const treeToList = <T>(tree: T[], childrenKey: keyof T = 'children' as keyof T) => {
    let list: T[] = [];

    function parseTree(data: any[]) {
        if (!data || !data.length) {
            return
        }
        for (let i in data) {
            let rows = data[i];
            let newRow = JSON.parse(JSON.stringify(rows));
            list.push(newRow);
            parseTree(rows[childrenKey]);
        }
    }

    parseTree(tree);
    return list;
}

/**
 * 查找树形上级
 * @param dataTree 树形
 * @param value 要查找的值
 * @param key 要查找的键
 * @param parentId 上级键
 * @param children 下级键
 */
const findTreeParents = <T, P>(
    dataTree: T[], value: string, key: keyof T = 'id' as keyof T,
    parentId: keyof T = 'parentId' as keyof T,
    children: keyof T = 'children' as keyof T
) => {
    let temp: P[] = [];
    let callback = function (tree: any[], value: string) {
        for (const item of tree) {
            if (item[key].toString() === value) {
                temp.push(item);
                callback(dataTree, item[parentId].toString());
                break;
            } else if (item[children]) {
                callback(item[children], value);
            }
        }
    };
    callback(dataTree, value);
    return temp;
}

/**
 * 复制文本到剪贴板
 * @param text
 * @param message 复制成功提示，true为默认提示，字符串为自定义提示，false为不提示
 */
const copyText = (text: string, message: string | boolean = true) => {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                if (message === true) {
                    ElMessage.success('复制成功');
                } else if (typeof message === 'string') {
                    ElMessage.success(message);
                }
                resolve(text);
            }).catch(reject);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            if (document.execCommand('copy')) {
                document.body.removeChild(textarea);
                if (message === true) {
                    ElMessage.success('复制成功');
                } else if (typeof message === 'string') {
                    ElMessage.success(message);
                }
                resolve(text)
            } else {
                reject('复制失败')
            }
        }
    });
}

/**
 * 将对象中的空值转换为指定的占位文本
 * @param data 对象
 * @param emptyText 指定空值
 * @returns 
 */
const objectValueTransform = <T extends Record<string, any>>(data: T, emptyText = ''): T => {
    const objs = useCloned(data).cloned.value
    const trans = (objs: Record<string, any>) => {
        Object.keys(objs).forEach(key => {
            const val = objs[key]
            if (uxVerify.isEmpty(val)) {
                objs[key] = emptyText
            } else if (typeof val === 'object') {
                return trans(val)
            }
        })
        return objs
    }
    return trans(objs) as T
}

export const uxUtils = {
    copyText, guid, random, randomArray,
    listToTree, treeToList, findTreeParents, fmtMicrometer,
    dateFormat, timeFormat, timeAgo, objectValueTransform
}