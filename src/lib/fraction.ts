export class Fraction {
  numerator: number
  denominator: number

  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) throw new Error('分母不能为0')
    if (numerator === 0) {
      this.numerator = 0
      this.denominator = 1
      return
    }
    if (denominator < 0) {
      numerator = -numerator
      denominator = -denominator
    }
    const gcd = this._gcd(Math.abs(numerator), Math.abs(denominator))
    this.numerator = numerator / gcd
    this.denominator = denominator / gcd
  }

  private _gcd(a: number, b: number): number {
    a = Math.abs(a); b = Math.abs(b)
    while (b !== 0) { const t = b; b = a % b; a = t }
    return a
  }

  add(other: Fraction | number): Fraction {
    if (typeof other === 'number') other = new Fraction(other)
    return new Fraction(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator
    )
  }

  subtract(other: Fraction | number): Fraction {
    if (typeof other === 'number') other = new Fraction(other)
    return new Fraction(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator
    )
  }

  multiply(other: Fraction | number): Fraction {
    if (typeof other === 'number') other = new Fraction(other)
    return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator)
  }

  divide(other: Fraction | number): Fraction {
    if (typeof other === 'number') other = new Fraction(other)
    if (other.numerator === 0) throw new Error('除数不能为0')
    return new Fraction(this.numerator * other.denominator, this.denominator * other.numerator)
  }

  negate(): Fraction { return new Fraction(-this.numerator, this.denominator) }

  toString(): string {
    if (this.denominator === 1) return this.numerator.toString()
    return `${this.numerator}/${this.denominator}`
  }

  valueOf(): number { return this.numerator / this.denominator }

  abs(): Fraction { return new Fraction(Math.abs(this.numerator), this.denominator) }

  equals(other: Fraction | number): boolean {
    if (typeof other === 'number') other = new Fraction(other)
    return this.numerator === other.numerator && this.denominator === other.denominator
  }

  static fromString(str: string): Fraction {
    str = str.trim()
    const fractionMatch = str.match(/^(-?)(\d+)\/(\d+)$/)
    if (fractionMatch) {
      const sign = fractionMatch[1] === '-' ? -1 : 1
      return new Fraction(sign * parseInt(fractionMatch[2]), parseInt(fractionMatch[3]))
    }
    const mixedMatch = str.match(/^(-?)(\d+)_(\d+)\/(\d+)$/)
    if (mixedMatch) {
      const sign = mixedMatch[1] === '-' ? -1 : 1
      const whole = parseInt(mixedMatch[2])
      const num = parseInt(mixedMatch[3])
      const den = parseInt(mixedMatch[4])
      return new Fraction(sign * (whole * den + num), den)
    }
    const num = parseFloat(str)
    if (isNaN(num)) throw new Error('无法解析为数字: ' + str)
    if (Number.isInteger(num)) return new Fraction(num)
    const parts = str.split('.')
    const decimalPlaces = parts[1] ? parts[1].length : 0
    const denominator = Math.pow(10, decimalPlaces)
    const numerator = parseFloat(str.replace('.', ''))
    return new Fraction(numerator, denominator)
  }
}
