/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import * as PIXI from 'pixi.js';
import Stats from 'stats.js';
import data from '../assets/graph.json';

const width = window.innerWidth;
const height = window.innerHeight;
const container = document.body;
const center = {
    x: width * 0.5,
    y: height * 0.5
};
const app = new PIXI.Application({
    width,
    height,
    antialias: true,
    backgroundColor: 0x00173d
});
container.appendChild(app.view);
const linkGh = new PIXI.Graphics();
app.stage.addChild(linkGh);
const _log = log();

class Popup {
    constructor() {
        this.gh = null;
        this.position = new Vector();
    }
}

class Node {
    constructor(id, index) {
        this.index = index;
        this.id = id;
        this.position = new Vector();
        this.v = new Vector(); // 速度
        this.a = new Vector(); // 加速度
        this.mass = 1;
        this.fx = undefined;
        this.fy = undefined;
    }
    applyForce(force) {
        this.a.add(force.devideScalar(this.mass));
    }
}

class Link {
    constructor(target, source) {
        this.target = target;
        this.source = source;
        this.length = 100;
    }
}
class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    devideScalar(s) {
        this.x /= s;
        this.y /= s;
        return this;
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normalize() {
        return this.devideScalar(this.length());
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
    }
}
function ForceLayout() {
    this.nodes = [];
    this.links = [];
    this.circles = [];
    this.nodesMap = new Map();
    this.linksMap = new Map();
    this.onTick = () => {};
    this.initLayout = () => {};
    this.ke = 0;
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.getElementById('app').appendChild(this.stats.dom);
    // console.log(this.stats);
}

ForceLayout.prototype = {
    addNodes(nodes) {
        this.nodes.push(...nodes.map((node, index) => new Node(node.id, index)));
    },
    addLinks(links) {
        this.links.push(
            ...links.map((link, index) => {
                const t = this.nodes.find((n) => n.index === link.target);
                const s = this.nodes.find((n) => n.index === link.source);
                return new Link(t, s);
            })
        );
    },
    start() {
        const self = this;
        this.nodes.forEach((node) => {
            const x = center.x + 100 * (Math.random() - 0.5);
            const y = center.y + 100 * (Math.random() - 0.5);
            node.position.set(x, y);
            const c = new PIXI.Container();
            const gh = new PIXI.Graphics();
            const basicText = new PIXI.Text(
                node.id,
                new PIXI.TextStyle({
                    fill: 0xffffff
                })
            );

            c.addChild(basicText);
            gh.beginFill(0xff0000);
            gh.arc(0, 0, 20, 0, Math.PI * 2);
            gh.endFill();
            gh.node = node;
            c.node = node;
            // gh.interactive = true;
            c.interactive = true;
            c.on('pointerdown', this.onDragStart)
                .on('pointerup', this.onDragEnd)
                .on('pointerupoutside', this.onDragEnd)
                .on('pointermove', this.onDragMove)
                .on('click', function(e) {
                    console.log(this.dragging);
                    if (this.dragging) return;
                    const newPosition = e.data.getLocalPosition(this.parent);
                    self.createBigCircle(newPosition);
                });
            c.position.set(node.position.x, node.position.y);
            node.gh = gh;
            node.c = c;
            c.addChild(gh);
            app.stage.addChild(c);
        });

        this.initLayout();
        window.requestAnimationFrame(function step() {
            self.stats.begin();

            self.tick();

            requestAnimationFrame(step);
            self.ke = 0;
            self.stats.end();
        });
    },
    createBigCircle(pos) {
        const p = new Vector(pos.x, pos.y);
        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            const v = circle.position.clone().sub(p);
            const distance = v.length();
            if (distance <= 200) {
                p.add(v.normalize().addScalar(100 - distance));
            }
        }

        const gh = new PIXI.Graphics();
        gh.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        gh.beginFill(0xde3249, 1);
        gh.drawCircle(0, 0, 100);
        gh.endFill();
        const basicText = new PIXI.Text(
            '点击关闭',
            new PIXI.TextStyle({
                fill: 0xffffff
            })
        );

        basicText.position.set(p.x, p.y);
        const popup = new Popup();
        popup.gh = gh;
        gh.popup = popup;
        popup.txt = basicText;
        gh.position.set(p.x, p.y);
        popup.position.set(p.x, p.y);
        this.circles.push(popup);

        gh.interactive = true;
        gh.on('click', (e) => {
            const target = e.target;
            const ins = target.popup;
            app.stage.removeChild(ins.gh, ins.txt);
            this.circles.splice(
                this.circles.findIndex((i) => i === ins),
                1
            );
        });

        app.stage.addChild(gh);
        app.stage.addChild(basicText);
    },
    tick() {
        const self = this;
        for (let i = 0; i < 2; i++) {
            self.updateCoulombsLaw();
            self.updateHooksLaw();
        }
        self.updateCircles();
        self.update();
        self.onTick();
    },
    updateCircles() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.circles.length; j++) {
                const node = this.nodes[i];
                const circle = this.circles[j];
                const distance = Math.sqrt(
                    (node.position.x - circle.position.x) ** 2 +
                        (node.position.y - circle.position.y) ** 2
                );
                if (distance < 120) {
                    const v = node.position.clone().sub(circle.position);
                    const dir = v.normalize();
                    const f = dir.multiplyScalar(2);
                    node.a.add(f);
                }
            }
        }
    },
    updateCoulombsLaw() {
        const l = this.nodes.length;
        for (let i = 0; i < l; i++) {
            for (let j = i + 1; j < l; j++) {
                if (i === j) continue;

                const ni = this.nodes[i];
                const nj = this.nodes[j];
                const v = ni.position.clone().sub(nj.position);
                const distance = v.length();
                const dir = v.normalize();

                const f1 = dir.multiplyScalar(400).multiplyScalar(1 / distance ** 2);
                const f2 = f1.clone().multiplyScalar(-1);
                // console.log(f1, f2);
                ni.a.add(f1);
                nj.a.add(f2);
            }
        }
    },
    updateHooksLaw() {
        const l = this.links.length;
        for (let i = 0; i < l; i++) {
            const link = this.links[i];
            const { source, target, length } = link;
            const v = source.position.clone().sub(target.position);
            const dir = v.clone().normalize();
            const interpolation = length - v.length();
            const f1 = dir.multiplyScalar(interpolation * 0.01);
            const f2 = f1.clone().multiplyScalar(-1);
            // _log(v, dir, interpolation, f1, f2);
            source.a.add(f1);
            target.a.add(f2);
        }
    },

    update() {
        for (let i = 0, l = this.nodes.length; i < l; i++) {
            const node = this.nodes[i];
            node.v.add(node.a);
            const clone = node.position.clone();
            // node.position.add(node.v.multiplyScalar(0.8));
            if (typeof node.fx !== 'undefined') {
                node.position.x = node.fx;
            } else {
                node.position.x = clone.add(node.v.multiplyScalar(0.8)).x;
            }
            if (typeof node.fy !== 'undefined') {
                node.position.y = node.fy;
            } else {
                node.position.y = clone.add(node.v.multiplyScalar(0.8)).y;
            }
            node.a.set(0, 0);
            this.calcKE(node);
        }
        linkGh.clear();
        for (let i = 0, l = this.links.length; i < l; i++) {
            const link = this.links[i];
            const { target, source } = link;
            linkGh.lineStyle(2, 0xffffff);
            linkGh.moveTo(source.position.x, source.position.y);
            linkGh.lineTo(target.position.x, target.position.y);
        }
        // linkGh.endFill();
        // console.log(this.ke);
    },
    calcKE(node) {
        // console.log(node.v.length());
        this.ke += 0.5 * node.mass * Math.pow(node.v.length(), 2);
        // console.log(this.ke);
    },
    onDragStart(event) {
        this.data = event.data;
        this.alpha = 0.5;
        this.presing = true;
        // this.dragging = true;
    },
    onDragEnd() {
        console.log('onDragEnd');
        this.alpha = 1;
        this.dragging = false;
        this.presing = false;
        // set the interaction data to null
        this.data = null;
        this.node.fx = undefined;
        this.node.fy = undefined;
        this.node.a.set(0, 0);
        this.node.v.set(0, 0);
    },

    onDragMove() {
        // console.log(this);
        if (this.presing) this.dragging = true;
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.node.fx = newPosition.x;
            this.node.fy = newPosition.y;
            // console.log(this);
        }
    }
};

function test() {
    const layout = new ForceLayout();
    layout.addNodes(data.nodes);
    layout.addLinks(data.links);
    layout.start();
    layout.onTick = function() {
        layout.nodes.forEach((node) => {
            node.c.position.set(node.position.x, node.position.y);
        });
    };
    // console.log(layout);
}
test();

function log() {
    let i = 0;
    return (...args) => {
        if (i > 100) return;
        console.log(...args);
        i++;
    };
}
