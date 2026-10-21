import { h } from "vue";
import { ElTooltip, ElLink } from "element-plus";
import type { TableTooltipData } from "element-plus";

import { uxUtils } from "../../utils/utils";

export const copyTooltip = (data: TableTooltipData<any>) => {
    return h('div', {
        title: '点击复制',
        style: {
            cursor: 'pointer'
        },
        onClick: () => {
            uxUtils.copyText(data.cellValue)
        }
    }, data.cellValue)
}

export const copyText = (text: string, message: string | false = '复制成功') => {
    return h(ElTooltip, {
        effect: 'dark',
        content: '点击复制',
        placement: 'left',
    }, {
        default: () => h(ElLink, {
            onClick: () => {
                if (!text) return;
                uxUtils.copyText(text, message)
            }
        }, {
            default: () => text
        })
    })
}

export const uxTable = {
    copyText, copyTooltip
}