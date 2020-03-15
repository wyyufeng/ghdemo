/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js';
import ForceLayout from './ForceLayout';
import data from '../assets/graph.json';
import NodeShape from './shapes/NodeShape';
import LinkShape from './shapes/LinkShape';
console.log(new PIXI.PlaneGeometry());
const width = window.innerWidth;
const height = window.innerHeight;
const container = document.body;
// const center = {
//     x: width * 0.5,
//     y: height * 0.5
// };
const app = new PIXI.Application({
    width,
    height,
    antialias: true,
    backgroundColor: 0x00173d
});
container.appendChild(app.view);

app.stage.addChild(LinkShape.GH);
const layout = new ForceLayout({
    x: 0,
    y: 0,
    width,
    height
});
layout.addNodes(data.nodes).addLinks(data.links);
layout.on('layout', function(nodes, links) {
    layout.eachNodes(function(node) {
        renderNode(node);
    });
    layout.eachLinks(function(link) {
        renderLink(link);
    });
});
layout.layout();
console.log(layout);
layout.on('tick', function() {
    layout.eachNodes(function(node) {
        node.ctx.position.set(node.p.x, node.p.y);
    });
    LinkShape.clear();
    layout.eachLinks(function(link) {
        const { target, source } = link;
        // linkGh.lineStyle(2, 0xffffff);
        LinkShape.source(source.p.x, source.p.y);
        LinkShape.target(target.p.x, target.p.y);
    });
});
function renderNode(node) {
    const c = new PIXI.Container();
    const basicText = new PIXI.Text(
        node.id,
        new PIXI.TextStyle({
            fill: 0xffffff
        })
    );

    c.addChild(basicText);
    const nodeGh = new NodeShape(25);
    c.position.set(node.p.x, node.p.y);
    c.addChild(nodeGh);
    node.ctx = c;
    c.node = node;
    app.stage.addChild(c);
    c.interactive = true;
    c.on('pointerdown', onNodeDragStart)
        .on('pointerup', onNodeDragEnd)
        .on('pointerupoutside', onNodeDragEnd)
        .on('pointermove', onNodeDragMove);
}

function renderLink(link) {
    const { source, target } = link;
    // linkGh.lineStyle(2, 0xffffff);
    LinkShape.source(source.p.x, source.p.y);
    LinkShape.target(target.p.x, target.p.y);
}

function onNodeDragStart(event) {
    this.e_data = event.data;
    this.pressing = true;
}
function onNodeDragMove(event) {
    if (this.pressing) this.dragging = true;
    if (this.dragging) {
        const newPosition = this.e_data.getLocalPosition(this.parent);
        this.node.fx = newPosition.x;
        this.node.fy = newPosition.y;
    }
}

function onNodeDragEnd() {
    this.pressing = false;
    this.dragging = false;
    this.e_data = null;
    this.node.fx = undefined;
    this.node.fy = undefined;
}
