import * as PIXI from 'pixi.js';

const LinkShape = {
    GH: new PIXI.Graphics(),
    clear() {
        LinkShape.GH.clear();
    },
    source(x, y) {
        LinkShape.GH.lineStyle(2, 0xffffff);
        LinkShape.GH.moveTo(x, y);
    },
    target(x, y) {
        LinkShape.GH.lineStyle(2, 0xffffff);
        LinkShape.GH.lineTo(x, y);
    }
};

export default LinkShape;
