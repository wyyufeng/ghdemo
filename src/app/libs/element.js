/* eslint-disable max-params */
import vector from './vector';

/**
 * @description 节点
 * @typedef Node
 * @type {object}
 * @property {number} index - 索引
 * @property {any} id - 唯一标识
 * @property {number} mass - 质量
 * @property {import("./vector").Vector2} p - 位置
 * @property {import("./vector").Vector2} a - 加速度
 * @property {import("./vector").Vector2} v - 速度
 * @property {number} fx - x 位置修正
 * @property {number} fy - y 位置修正
 * @property {Object} data  - 数据
 */
/**
 * @description 边
 * @typedef Link
 * @type {Object}
 * @property {Node} source - 起点
 * @property {Node} target - 终点
 * @property {Object} data  - 数据
 * @property {number} length - 长度
 */

/**
 * node 节点工厂函数
 * @param {number} index
 * @param {any} id
 * @param {Object} data
 * @returns {Node}
 */
function node(index, id, data) {
    const n = {
        index,
        id,
        data,
        p: vector(0, 0),
        a: vector(0, 0),
        v: vector(0, 0),
        fx: undefined, // 设置成非number
        fy: undefined
    };
    return n;
}
/**
 *
 * 边工厂函数
 * @param {Node} source
 * @param {Node} target
 * @param {Object} data
 * @param {number} [length = 100] -长度
 * @returns {Link}
 */
function link(source, target, data, length = 100) {
    const l = {
        source,
        target,
        data,
        length
    };
    return l;
}

function popup() {}

export { node, link, popup };
