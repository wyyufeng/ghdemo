/* eslint-disable max-params */
import { node, link } from './libs/element';
import { dispatch } from 'd3-dispatch';
import vector from './libs/vector';

const { add, sub, multiplyScalar, magnitude, clone, normalize } = vector;
let _step = null;
/**
 * 力向图仿真
 */
class ForceLayout {
    constructor(stage) {
        this.nodes = [];
        this.links = [];
        this._nodeMap = new Map();
        /** @type {{x:number,y:number,width:number,height:number}} */
        this.stage = { x: stage.x, y: stage.y, width: stage.width, height: stage.height }; // 布局的中心位置

        this.dispatcher = dispatch('tick', 'layout');
        this.forces = new Map();
    }
    /**
     *
     * @param {string} name  - 事件名
     * @param {*} _ - 事件处理函数
     */
    on(name, _) {
        arguments.length > 1 ? this.dispatcher.on(name, _) : this.dispatcher.on(name);
        return this;
    }
    /**
     *  开启时钟
     */
    start() {
        const self = this;
        const dispatcher = this.dispatcher;
        this.applyForce('CoulombsLaw', this.applyCoulombsLaw);
        this.applyForce('HooksLaw', this.applyHooksLaw);
        // this.applyForce('BorderCollision', this.applyBorderCollision.bind(this));
        window.requestAnimationFrame(
            (_step = function() {
                self.update();
                dispatcher.call('tick', self);
                requestAnimationFrame(_step);
            })
        );
    }
    stop() {
        cancelAnimationFrame(_step);
    }
    /**
     * 帧循环
     */
    update() {
        this.forces.forEach((force) => {
            force(this.nodes, this.links);
        });
        this.updatePosition();
    }
    /**
     * 更新节点位置
     */
    updatePosition() {
        this.eachNodes((node, index) => {
            // 需要直接修改节点的位置
            add(node.v, node.a);
            add(node.p, multiplyScalar(node.v, 0.8));
            if (typeof node.fx !== 'undefined') {
                node.p.x = node.fx;
            }
            if (typeof node.fy !== 'undefined') {
                node.p.y = node.fy;
            }
            node.a.x = node.a.y = 0;
        });
    }
    /**
     * 增加一个node 节点
     * @param {number} index  - 索引
     * @param {any} id - 唯一标识
     * @param {Object} data - 数据
     * @returns {ForceLayout}
     */
    addNode(index, id, data) {
        if (this._nodeMap.has(id)) return console.warn('有相同数据项');

        const n = node(index, id, data);
        this.nodes.push(n);
        this._nodeMap.set(id, n);
        return this;
    }
    /**
     * 增加一个link 边
     * @param {any} source  - 起点的节点id
     * @param {any} target - 终点的节点id
     * @param {Object} data - 数据
     * @returns {ForceLayout}
     */
    addLink(source, target, data) {
        const l = link(source, target, data);

        this.links.push(l);
        return this;
    }
    /**
     * 批量增加节点
     *
     * @param {Array<import("./libs/element").Node>} nodes
     * @returns {ForceLayout}
     */
    addNodes(nodes) {
        for (let i = 0, l = nodes.length; i < l; i++) {
            const node = nodes[i];
            this.addNode(i, node.id, node.data);
        }
        return this;
    }
    /**
     * 批量增加节点
     *
     * @param {Array<import("./libs/element").Link>} links
     * @param {Function} id
     * @returns {ForceLayout}
     */
    addLinks(links, id) {
        for (let i = 0, l = links.length; i < l; i++) {
            const link = links[i];
            const s = this.nodes[link.source];
            const t = this.nodes[link.target];
            this.addLink(s, t, link.data);
        }
        return this;
    }
    /**
     *  迭代nodes
     * @param {Function} callback 迭代函数
     * @param {*} context 迭代函数上下文
     */
    eachNodes(callback, context = this) {
        for (let i = 0, l = this.nodes.length; i < l; i++) {
            callback.call(context, this.nodes[i], i);
        }
    }
    /**
     *  迭代links
     * @param {Function} callback 迭代函数
     * @param {*} context 迭代函数上下文
     */
    eachLinks(callback, context = this) {
        for (let i = 0, l = this.links.length; i < l; i++) {
            callback.call(context, this.links[i]);
        }
    }
    /**
     * 初始化布局
     */
    layout() {
        this.eachNodes(function(node) {
            const stage = this.stage;
            const x = stage.width * 0.5 + 300 * (Math.random() - 0.5);
            const y = stage.height * 0.5 + 300 * (Math.random() - 0.5);
            node.p.x = x;
            node.p.y = y;
        });

        this.eachLinks(function(node) {});
        this.dispatcher.call('layout', this, this.nodes, this.links);
        this.start();
    }
    /**
     * 由库伦公式计算斥力 f= k* q1*q2/r^2*e;
     * @link https://baike.baidu.com/item/%E5%BA%93%E4%BB%91%E5%AE%9A%E5%BE%8B
     *
     */
    applyCoulombsLaw(nodes) {
        const l = nodes.length;
        // TODO: 这里的时间复杂度为 o(n^2),可以用四叉搜索树优化
        for (let i = 0; i < l; i++) {
            for (let j = i + 1; j < l; j++) {
                if (i === j) continue;

                const ni = nodes[i];
                const nj = nodes[j];
                // 后续的迭代要依据当前节点的位置 不能直接修改节点的位置
                const v = sub(ni.p, nj.p, vector());
                const distance = magnitude(v);
                const dir = normalize(v);
                const f1 = multiplyScalar(multiplyScalar(dir, 1000), 1 / distance ** 2);
                const f2 = multiplyScalar(clone(f1), -1);
                add(ni.a, f1);
                add(nj.a, f2);
            }
        }
    }
    /**
     * 由胡克定律计算引力 f = k*x ,x为形变
     * @link https://baike.baidu.com/item/%E8%83%A1%E5%85%8B%E5%AE%9A%E5%BE%8B
     */
    applyHooksLaw(_, links) {
        for (let i = 0, l = links.length; i < l; i++) {
            const { source, target, length } = links[i];
            const v = sub(source.p, target.p, vector());
            const dir = normalize(v);
            const interpolation = length - magnitude(v);
            const f1 = multiplyScalar(dir, interpolation * 0.05);
            const f2 = multiplyScalar(clone(f1), -1);
            add(source.a, f1);
            add(target.a, f2);
        }
    }
    /**
     *  节点碰到边界反弹
     */
    applyBorderCollision(nodes) {
        const { width, height } = this.stage;
        for (let i = 0, l = nodes.length; i < l; i++) {
            const node = nodes[i];
            if (
                node.p.x >= width - 100 ||
                node.p.x <= 100 ||
                node.p.y >= height - 100 ||
                node.p.y <= 100
            ) {
                // 这里可以优化到更好的动效 比如随机朝某个方向运动
                // FIXME: 这里会导致其他的力失效
                node.v.x = 0;
                node.v.y = 0;
                node.a.x = 0;
                node.a.y = 0;
            }
        }
    }
    /**
     *  对系统应用力的效果
     * @param {string} name
     * @param {Function} force
     */
    applyForce(name, force) {
        this.forces.set(name, force);
        return this;
    }
}
export default ForceLayout;
