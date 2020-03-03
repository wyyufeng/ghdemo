/**
 * @description Vector2 向量
 * @typedef Vector2
 * @type {Object}
 * @property {number} x
 * @property {number} y
 */

/**
 * Vector2 工厂函数
 * @param {number} x
 * @param {number} y
 * @returns {Vector2}
 */
const vector = function(x = 0, y = 0) {
    // 固定在一个地方生成对象 v8 似乎有优化
    const v = {
        x,
        y
    };
    return v;
};
/**
 * 向量相加
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {Vector2} target
 * @returns {Vector2}
 */
vector.add = (v1, v2, target) => {
    if (target) {
        target.x = v1.x + v2.x;
        target.y = v1.y + v2.y;
        return target;
    } else {
        v1.x += v2.x;
        v1.y += v2.y;
        return v1;
    }
};
/**
 * 向量相减
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {Vector2} target
 * @returns {Vector2}
 */
vector.sub = (v1, v2, target) => {
    if (target) {
        target.x = v1.x - v2.x;
        target.y = v1.y - v2.y;
        return target;
    } else {
        v1.x -= v2.x;
        v1.y -= v2.y;
        return v1;
    }
};
/**
 * 向量放大
 * @param {Vector2} v
 * @param {number} s
 * @returns {Vector2}
 */
vector.multiplyScalar = (v, s) => {
    v.x *= s;
    v.y *= s;
    return v;
};
/**
 * 向量缩小
 * @param {Vector2} v
 * @param {number} s
 * @returns {Vector2}
 */
vector.devideScalar = (v, s) => {
    v.x /= s;
    v.y /= s;
    return v;
};

/**
 * 向量长度
 * @param {Vector2} v
 * @returns {number}
 */
vector.magnitude = (v) => {
    return Math.sqrt(v.x ** 2 + v.y ** 2);
};
/**
 * 向量格式化
 * @param {Vector2} v
 * @returns {Vector2}
 */
vector.normalize = (v) => {
    return vector.devideScalar(vector.clone(v), vector.magnitude(v));
};
/**
 * 向量克隆
 * @param {Vector2} v
 * @returns {Vector2}
 */
vector.clone = (v) => {
    return vector(v.x, v.y);
};
export default vector;
