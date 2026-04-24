/**
 * 分数类 - 实现精确分数计算，避免浮点误差
 * 所有矩阵运算使用分数作为基础数据类型
 */
class Fraction {
    constructor(numerator, denominator = 1) {
        // 处理分母为0的情况
        if (denominator === 0) {
            throw new Error('分母不能为0');
        }
        
        // 处理分子为0的情况
        if (numerator === 0) {
            this.numerator = 0;
            this.denominator = 1;
            return;
        }
        
        // 确保分母为正数
        if (denominator < 0) {
            numerator = -numerator;
            denominator = -denominator;
        }
        
        // 计算最大公约数以简化分数
        const gcd = this._gcd(Math.abs(numerator), Math.abs(denominator));
        this.numerator = numerator / gcd;
        this.denominator = denominator / gcd;
    }
    
    // 计算最大公约数（欧几里得算法）
    _gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    // 加法
    add(other) {
        if (typeof other === 'number') {
            other = new Fraction(other);
        }
        
        const newNumerator = this.numerator * other.denominator + other.numerator * this.denominator;
        const newDenominator = this.denominator * other.denominator;
        
        return new Fraction(newNumerator, newDenominator);
    }
    
    // 减法
    subtract(other) {
        if (typeof other === 'number') {
            other = new Fraction(other);
        }
        
        const newNumerator = this.numerator * other.denominator - other.numerator * this.denominator;
        const newDenominator = this.denominator * other.denominator;
        
        return new Fraction(newNumerator, newDenominator);
    }
    
    // 乘法
    multiply(other) {
        if (typeof other === 'number') {
            other = new Fraction(other);
        }
        
        const newNumerator = this.numerator * other.numerator;
        const newDenominator = this.denominator * other.denominator;
        
        return new Fraction(newNumerator, newDenominator);
    }
    
    // 除法
    divide(other) {
        if (typeof other === 'number') {
            other = new Fraction(other);
        }
        
        if (other.numerator === 0) {
            throw new Error('除数不能为0');
        }
        
        const newNumerator = this.numerator * other.denominator;
        const newDenominator = this.denominator * other.numerator;
        
        return new Fraction(newNumerator, newDenominator);
    }
    
    // 取负
    negate() {
        return new Fraction(-this.numerator, this.denominator);
    }
    
    // 转换为字符串
    toString() {
        if (this.denominator === 1) {
            return this.numerator.toString();
        }
        return `${this.numerator}/${this.denominator}`;
    }
    
    // 转换为浮点数（仅用于需要数值比较的情况）
    valueOf() {
        return this.numerator / this.denominator;
    }
    
    // 绝对值
    abs() {
        return new Fraction(Math.abs(this.numerator), this.denominator);
    }
    
    // 比较相等
    equals(other) {
        if (typeof other === 'number') {
            other = new Fraction(other);
        }
        
        return this.numerator === other.numerator && this.denominator === other.denominator;
    }
    
    // 静态方法：从字符串解析分数
    static fromString(str) {
        str = str.trim();
        
        // 处理分数格式（如 1/2, -3/4）
        const fractionMatch = str.match(/^(-?)(\d+)\/(\d+)$/);
        if (fractionMatch) {
            const sign = fractionMatch[1] === '-' ? -1 : 1;
            return new Fraction(sign * parseInt(fractionMatch[2], 10), parseInt(fractionMatch[3], 10));
        }
        
        // 处理带分数格式（如 1_2/3）
        const mixedMatch = str.match(/^(-?)(\d+)_(\d+)\/(\d+)$/);
        if (mixedMatch) {
            const sign = mixedMatch[1] === '-' ? -1 : 1;
            const whole = parseInt(mixedMatch[2], 10);
            const num = parseInt(mixedMatch[3], 10);
            const den = parseInt(mixedMatch[4], 10);
            const numerator = sign * (whole * den + num);
            return new Fraction(numerator, den);
        }
        
        // 处理纯数字（整数或小数）
        const num = parseFloat(str);
        if (isNaN(num)) {
            throw new Error('无法解析为数字: ' + str);
        }
        
        // 如果是整数
        if (Number.isInteger(num)) {
            return new Fraction(num);
        }
        
        // 如果是小数，转换为分数
        const parts = str.split('.');
        const decimalPlaces = parts[1] ? parts[1].length : 0;
        const denominator = Math.pow(10, decimalPlaces);
        let numerator = parseFloat(str.replace('.', ''));
        return new Fraction(numerator, denominator);
    }
}
