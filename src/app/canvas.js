/* eslint-disable no-unused-vars */
import {
    forceSimulation,
    forceLink,
    forceCenter,
    forceManyBody,
    forceCollide,
    forceX,
    forceY
} from 'd3-force';
import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';
import avatar from '../assets/avatar.jpg';
import * as PIXI from 'pixi.js';
import json from '../assets/graph.json';
const data1 = JSON.parse(JSON.stringify(json));
const data2 = JSON.parse(JSON.stringify(json));

const width = window.innerWidth;
const height = window.innerHeight;
const container = document.body;

const app = new PIXI.Application({
    // transparent: true,
    width,
    height,
    antialias: true,
    backgroundColor: 0x00173d
});
container.appendChild(app.view);

const sim = forceSimulation(data2.nodes)
    .force('link', forceLink(data2.links).distance(400))
    .force('center', forceCenter(width / 2, height / 2)) // 指定力向图原点
    .force('charge', forceManyBody())
    .force('collide', forceCollide(100).strength(0.5));
// .force('x', forceX().strength(1))
// .force('y', forceY().strength(2));

select('canvas').call(
    drag()
        .on('drag', (...args) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        })
        .on('start', () => {
            // console.log(event.subject);
            if (!event.active) sim.alphaTarget(0.01).restart();

            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        })
        .on('end', () => {
            if (!event.active) sim.alphaTarget(0);

            event.subject.fx = null;
            event.subject.fy = null;
        })
        .subject(() => sim.find(event.x, event.y))
);
function renderNodes(nodes) {
    // );
    nodes.forEach((node, index) => {
        const c = new PIXI.Container();
        const sp = PIXI.Sprite.from(avatar);

        sp.anchor.set(0.5);
        sp.width = 60;
        sp.height = 60;

        const r1 = new PIXI.Graphics();
        r1.lineStyle(2, 0xffffff);
        r1.arc(0, 0, 65, 0, 2 * Math.PI);
        const r2 = new PIXI.Graphics();
        r2.lineStyle(2, 0xffffff);
        r2.arc(0, 0, 75, 0, 2 * Math.PI);
        c.addChild(sp, r1, r2);
        node.c = c;

        app.stage.addChild(c);
    });
}
renderNodes(data2.nodes);
const links = new PIXI.Graphics();
app.stage.addChild(links);
sim.on('tick', () => {
    // console.log(data);

    data2.nodes.forEach((node) => {
        // console.log(node);
        node.c.position.set(node.x, node.y);
    });
    links.clear();
    links.alpha = 0.6;
    data2.links.forEach((link) => {
        const { source, target, line } = link;
        links.lineStyle(2, 0xffffff);
        links.moveTo(source.x, source.y);
        links.lineTo(target.x, target.y);
        links.beginFill(0xde3249, 1);
        links.drawCircle(target.x, target.y, 10);
    });
    links.endFill();
});
console.log(data2);
