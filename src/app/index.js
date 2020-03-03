import * as PIXI from 'pixi.js';
import ForceLayout from './ForceLayout';
import data from '../assets/graph.json';

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
const linkGh = new PIXI.Graphics();
app.stage.addChild(linkGh);
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
    linkGh.clear();
    layout.eachLinks(function(link) {
        const { target, source } = link;
        linkGh.lineStyle(2, 0xffffff);
        linkGh.moveTo(source.p.x, source.p.y);
        linkGh.lineTo(target.p.x, target.p.y);
    });
});
function renderNode(node) {
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
    c.position.set(node.p.x, node.p.y);
    c.addChild(gh);
    node.ctx = c;
    c.node = node;
    app.stage.addChild(c);
}

function renderLink(link) {
    const { source, target } = link;
    linkGh.lineStyle(2, 0xffffff);
    linkGh.moveTo(source.p.x, source.p.y);
    linkGh.lineTo(target.p.x, target.p.y);
}
