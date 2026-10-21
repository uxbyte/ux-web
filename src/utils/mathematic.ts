import Decimal from 'decimal.js';

class Mathematic {

    value = 0;

    constructor(num: number = 0) {
        this.value = num
    }

    /**
     * 加法
     * @param value 
     */
    plus(value: number | string): this;
    plus(value: number | string, ...args: number[] | string[]): this;
    plus(value: number | string, ...args: number[] | string[]) {
        this.value = new Decimal(this.value).plus(value).toNumber()
        if (args.length > 0) {
            args.forEach(val => this.plus(val))
            return this
        }
        return this;
    }

    /**
     * 减法
     * @param value 
     */
    minus(value: number | string): this;
    minus(value: number | string, ...args: number[] | string[]): this;
    minus(value: number | string, ...args: number[] | string[]) {
        this.value = new Decimal(this.value).minus(value).toNumber()
        if (args.length > 0) {
            args.forEach(val => this.minus(val))
            return this
        }
        return this;
    }

    /**
     * 乘法
     * @param value 
     */
    multiply(value: number | string): this;
    multiply(value: number | string, ...args: number[] | string[]): this;
    multiply(value: number | string, ...args: number[] | string[]) {
        this.value = new Decimal(this.value).times(value).toNumber()
        if (args.length > 0) {
            args.forEach(val => this.multiply(val))
            return this
        }
        return this;
    }

    /**
     * 除法
     * @param value 
     */
    divide(value: number | string): this;
    divide(value: number | string, ...args: number[] | string[]): this;
    divide(value: number | string, ...args: number[] | string[]) {
        if (value === 0) {
            this.value = 0
        } else {
            this.value = new Decimal(this.value).div(value).toNumber()
        }
        if (args.length > 0) {
            args.forEach(val => this.divide(val))
            return this
        }
        return this;
    }

    /**
     * 幂运算
     * @param value 
     */
    pow(value: number | string) {
        this.value = new Decimal(this.value).pow(value).toNumber()
        return this;
    }

    /**
     * 平方根
     */
    sqrt() {
        this.value = new Decimal(this.value).sqrt().toNumber()
        return this;
    }

    getValue() {
        return new Decimal(this.value)
    }

    toFixed(precision: number = 2) {
        return new Decimal(this.value).toFixed(precision, Decimal.ROUND_HALF_UP)
    }

    toDecimal(precision: number = 2) {
        return new Decimal(this.value).toDecimalPlaces(precision, Decimal.ROUND_HALF_UP).toNumber()
    }

}

export const uxMaths = (value: number) => {
    return new Mathematic(value)
}
