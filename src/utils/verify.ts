/**
 * 验证IP格式
 * @param value 
 * @returns 
 */
function ipv4(value: string) {
	return /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/.test(value);
}

/**
 * 验证域名格式
 */
function domain(value: string) {
	return /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/.test(value);
}


/**
 * 验证电子邮箱格式
 */
function email(value: string) {
	return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
}

/**
 * 验证手机格式
 */
function phone(value: string) {
	// /^1([3589]\d|4[5-9]|6[1-2,4-7]|7[0-8])\d{8}$/.test(value)
	return /^1[3-9]\d{9}$/.test(value)
}

/**
 * 验证URL格式
 */
function url(value: string) {
	return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(value)
}

/**
 * 验证日期格式
 */
function date(value: string) {
	return !/Invalid|NaN/.test(new Date(value).toString())
}

/**
 * 验证ISO类型的日期格式
 */
function dateISO(value: string) {
	return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
}

/**
 * 验证十进制数字
 */
function number(value: string) {
	return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
}

/**
 * 验证整数
 */
function digits(value: string) {
	return /^\d+$/.test(value)
}

/**
 * 判断是否是16进制颜色
 */
function isColor(val: string) {
	return /^#[\dA-F]{6}$/i.test(val)
};


/**
 * 判断是否百分比
 */
function isPercentage(val: string) {
	return new RegExp(/^\d+%$/).test(val)
};

/**
 * 验证身份证号码
 */
function idCard(value: string) {
	return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
}

/**
 * 验证图片(base64、文件名称)
 */
function isImg(value: string) {
	// 判断 base64 图片
	if (/^data:image\/(jpg|jpeg|png|gif|bmp|webp|svg\+xml|ico|tiff|avif);base64,/i.test(value)) {
		return true
	}
	// 判断普通图片路径
	return /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|tiff|avif)(\?.*)?$/i.test(value)
}

/**
 * 是否车牌号
 */
function carNo(value: string) {
	// 新能源车牌
	const xReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
	// 旧车牌
	const cReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
	if (value.length === 7) {
		return xReg.test(value);
	} else if (value.length === 8) {
		return cReg.test(value);
	} else {
		return false;
	}
}

/**
 * 金额,只允许2位小数
 */
function amount(value: string) {
	//金额，只允许保留两位小数
	return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value);
}

/**
 * 中文
 */
function chinese(value: string) {
	return /^[\u4e00-\u9fa5]+$/gi.test(value);
}

/**
 * 只能输入字母
 */
function letter(value: string) {
	return /^[a-zA-Z]*$/.test(value);
}

/**
 * 是否字母和数字组合
 */
function isLetterNumber(value: any) {
	return /^[A-Za-z0-9]+$/.test(value);
}

/**
 * 验证是否包含某个值
 */
function contains(values: string, value: string) {
	return values.indexOf(value) >= 0
}

/**
 * 判断是否为空
 */
function empty(value: any) {
	switch (typeof value) {
		case 'undefined':
			return true;
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0) return true;
			break;
		case 'boolean':
			if (!value) return true;
			break;
		case 'number':
			if (0 === value || isNaN(value)) return true;
			break;
		case 'object':
			if (null === value || value.length === 0) return true;
	}
	return false;
}

/**
 * 是否json字符串
 */
function json(value: string) {
	if (typeof value == 'string') {
		try {
			const obj = JSON.parse(value);
			return (typeof obj == 'object' && obj);
		} catch (e) {
			return false;
		}
	}
	return false;
}

function svg(str: string) {
	if (typeof str !== 'string') return false;

	const trimmed = str.trim();

	// 快速检查 - 长度和基本结构
	if (trimmed.length < 10 || !trimmed.startsWith('<')) {
		return false;
	}

	// 检查是否包含svg标签
	const hasSvgTag = /<svg[\s>]/i.test(trimmed) && /<\/svg>/i.test(trimmed);
	if (!hasSvgTag) return false;

	// 尝试DOM解析进行验证
	try {
		// 如果是浏览器环境
		if (typeof DOMParser !== 'undefined') {
			const parser = new DOMParser();
			const doc = parser.parseFromString(trimmed, 'image/svg+xml');

			const parserError = doc.querySelector('parsererror');
			if (parserError) {
				// 如果没有解析错误，再检查标签名
				return doc.documentElement &&
					doc.documentElement.tagName.toLowerCase() === 'svg';
			}
			return true;
		}
	} catch (e) {
		// DOM解析失败，回退到正则检查
	}

	// 正则检查SVG结构
	return /^\s*<svg[\s\S]*<\/svg>\s*$/i.test(trimmed);
}


/**
 * 是否数组
 */
function array(value: any) {
	if (typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}

/**
 * 是否对象
 */
function object(value: any) {
	return Object.prototype.toString.call(value) === '[object Object]';
}

export const uxVerify = {
	ipv4, domain, email, phone, url, date, dateISO, number, digits,
	isLetterNumber, isImg,
	isColor, isPercentage, idCard, carNo, amount, chinese, json,
	svg, letter, contains, empty, isEmpty: empty, object, isArray: array
}
