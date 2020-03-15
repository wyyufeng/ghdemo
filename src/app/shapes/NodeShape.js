import * as PIXI from 'pixi.js';
// eslint-disable-next-line no-unused-vars
import avatar from '../../assets/avatar.jpg';
import { noop } from '../libs/util';

const emptyArr = new Array(361).fill(0);

class NodeShape extends PIXI.Mesh {
    constructor(radius = 50) {
        super(new PIXI.MeshGeometry(), new PIXI.MeshMaterial());
        this.radius = radius;
        this._width = radius * 2;
        this.innerHaloRadius = radius + 5;
        this.outerHaloRadius = radius + 10;
        this.drawMode = PIXI.DRAW_MODES.TRIANGLES;
        this._cacheMath = [];
        this.interactive = true;
        // this.buttonMode = true;
        this.create();
        this.createHalo();
        this.hitArea = new PIXI.Circle(0, 0, radius);
    }
    #vertShader = `
          precision mediump float;
          #define PI ${Math.PI};
          attribute vec2 aVertexPosition;
          uniform mat3 translationMatrix;
          uniform mat3 projectionMatrix;
          attribute vec2 aUv;
          varying vec2 vUv;
          void main() {
              vUv = aUv;
              gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
          }`;
    #fragShader = `
        precision mediump float;
        uniform sampler2D texture;
        varying vec2 vUv;
        void main() {
            vec4 color = texture2D(texture, vUv);
            gl_FragColor = color;
        }
        `;
    create() {
        const t = (deg, cf = noop, sf = noop) => {
            const tmp = this._cacheMath[deg];
            if (typeof tmp !== 'undefined') return [cf(tmp[0]), sf(tmp[1])];
            const rad = (deg / 360) * 2 * Math.PI;
            const c = Math.cos(rad);
            const s = Math.sin(rad);
            this._cacheMath[deg] = [c, s];
            return [cf(c), sf(s)];
        };

        this.uniforms = {
            texture: PIXI.Texture.from(avatar)
        };
        const radius = this.radius;
        // eslint-disable-next-line one-var
        let f1, f2;
        this.geometry
            .addAttribute(
                'aVertexPosition',
                emptyArr.reduce(
                    (a, b, i) => {
                        a.push(...t(i, f2 ? f2 : (f2 = (x) => x * radius), f2));
                        return a;
                    },
                    [0, 0]
                ),
                2
            )
            // 0 1 2 0 2 3 0 3 4
            .addIndex(
                emptyArr.reduce((a, b, i) => {
                    a.push(0, i + 1, i + 2);
                    return a;
                }, [])
            )
            .addAttribute(
                'aUv',

                emptyArr.reduce(
                    (a, b, i) => {
                        //  转换 st 坐标
                        a.push(...t(i, f1 ? f1 : (f1 = (x) => x * 0.5 + 0.5), f1));
                        return a;
                    },
                    [0.5, 0.5]
                ),
                2
            );

        // eslint-disable-next-line new-cap
        this.material = new PIXI.Shader.from(this.#vertShader, this.#fragShader, this.uniforms);
    }
    createHalo() {
        const arc = new PIXI.Graphics();
        arc.lineStyle(2, 0xffffff, 0.6);
        arc.arc(0, 0, this.innerHaloRadius, 0, 2 * Math.PI);
        const arc2 = new PIXI.Graphics();
        arc2.lineStyle(1, 0xffffff, 0.3);
        arc2.arc(0, 0, this.outerHaloRadius, 0, 2 * Math.PI);
        this.addChild(arc, arc2);
    }
}
export default NodeShape;
