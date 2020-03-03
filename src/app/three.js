/* eslint-disable no-unused-vars */
import { forceSimulation, forceLink, forceCenter, forceManyBody, forceX, forceY } from 'd3-force';
import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
console.log(OrbitControls);
import * as THREE from 'three';
import json from '../assets/graph.json';
const data = JSON.parse(JSON.stringify(json));
const width = window.innerWidth;
const height = window.innerHeight;
const container = document.body;
const raycaster = new THREE.Raycaster();
const sim = forceSimulation(data.nodes)
    .force('link', forceLink(data.links))
    .force('center', forceCenter())
    .force('charge', forceManyBody())
    .force('x', forceX())
    .force('y', forceY());

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    precision: 'highp',
    alpha: true
});
// const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);
scene.background = new THREE.Color('#012255');
camera.position.z = 150;

select('canvas').call(
    drag(sim)
        .on('drag', (...args) => {
            console.log(event);
            let pX = (event.x / renderer.domElement.clientWidth) * 2 - 1;
            let pY = -(event.y / renderer.domElement.clientHeight) * 2 + 1;

            let p = new THREE.Vector3(pX, pY, -1).unproject(camera);
            console.log(p);
            event.subject.position.set(event.x, event.y, 0);
        })
        .subject(() => {
            const mouse = {};
            mouse.x = (event.x / window.innerWidth) * 2 - 1;
            mouse.y = -(event.y / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) return intersects[0].object;
            return {};
        })
);

data.nodes.forEach((node, index) => {
    node.geometry = new THREE.CircleBufferGeometry(10, 64);
    node.material = new THREE.MeshBasicMaterial({
        color: `rgb(${index % 255},${index % 255},${index % 255})`
    });
    node.cube = new THREE.Mesh(node.geometry, node.material);
    scene.add(node.cube);
});
data.links.forEach((link) => {
    link.material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
    link.geometry = new THREE.Geometry();
    link.line = new THREE.Line(link.geometry, link.material);
    scene.add(link.line);
});
sim.on('tick', () => {
    data.nodes.forEach((node) => {
        node.cube.position.set(node.x, node.y, 0);
    });
    data.links.forEach((link) => {
        const { source, target, line } = link;
        line.geometry.verticesNeedUpdate = true;
        line.geometry.vertices[0] = new THREE.Vector3(source.x, source.y, -0.5);
        line.geometry.vertices[1] = new THREE.Vector3(target.x, target.y, -0.5);
    });
    renderer.render(scene, camera);
    // controls.update();
});
console.log(scene);
