(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(t,i,n){t.exports=n(15)},15:function(t,i,n){"use strict";n.r(i);var e=n(8),o=n(5),s=n(3),a=n(1),r=n(13),d=n.n(r),h=n(7),c=window.innerWidth,l=window.innerHeight,u=document.body,p=.5*c,f=.5*l,g=new a.a({width:c,height:l,antialias:!0,backgroundColor:5949});u.appendChild(g.view);var v=new a.c;g.stage.addChild(v);!function(){var t=0}();var y=function t(){Object(s.a)(this,t),this.gh=null,this.position=new k},w=function(){function t(i,n){Object(s.a)(this,t),this.index=n,this.id=i,this.position=new k,this.v=new k,this.a=new k,this.mass=1,this.fx=void 0,this.fy=void 0}return Object(o.a)(t,[{key:"applyForce",value:function(t){this.a.add(t.devideScalar(this.mass))}}]),t}(),x=function t(i,n){Object(s.a)(this,t),this.target=i,this.source=n,this.length=100},k=function(){function t(i,n){Object(s.a)(this,t),this.x=i||0,this.y=n||0}return Object(o.a)(t,[{key:"set",value:function(t,i){return this.x=t,this.y=i,this}},{key:"add",value:function(t){return this.x+=t.x,this.y+=t.y,this}},{key:"sub",value:function(t){return this.x-=t.x,this.y-=t.y,this}},{key:"multiplyScalar",value:function(t){return this.x*=t,this.y*=t,this}},{key:"devideScalar",value:function(t){return this.x/=t,this.y/=t,this}},{key:"length",value:function(){return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))}},{key:"normalize",value:function(){return this.devideScalar(this.length())}},{key:"clone",value:function(){return new t(this.x,this.y)}},{key:"addScalar",value:function(t){return this.x+=t,this.y+=t,this}}]),t}();function m(){this.nodes=[],this.links=[],this.circles=[],this.nodesMap=new Map,this.linksMap=new Map,this.onTick=function(){},this.initLayout=function(){},this.ke=0,this.stats=new d.a,this.stats.showPanel(0),document.getElementById("app").appendChild(this.stats.dom)}m.prototype={addNodes:function(t){var i;(i=this.nodes).push.apply(i,Object(e.a)(t.map((function(t,i){return new w(t.id,i)}))))},addLinks:function(t){var i,n=this;(i=this.links).push.apply(i,Object(e.a)(t.map((function(t,i){var e=n.nodes.find((function(i){return i.index===t.target})),o=n.nodes.find((function(i){return i.index===t.source}));return new x(e,o)}))))},start:function(){var t=this,i=this;this.nodes.forEach((function(n){var e=p+100*(Math.random()-.5),o=f+100*(Math.random()-.5);n.position.set(e,o);var s=new a.b,r=new a.c,d=new a.d(n.id,new a.e({fill:16777215}));s.addChild(d),r.beginFill(16711680),r.arc(0,0,20,0,2*Math.PI),r.endFill(),r.node=n,s.node=n,s.interactive=!0,s.on("pointerdown",t.onDragStart).on("pointerup",t.onDragEnd).on("pointerupoutside",t.onDragEnd).on("pointermove",t.onDragMove).on("click",(function(t){if(console.log(this.dragging),!this.dragging){var n=t.data.getLocalPosition(this.parent);i.createBigCircle(n)}})),s.position.set(n.position.x,n.position.y),n.gh=r,n.c=s,s.addChild(r),g.stage.addChild(s)})),this.initLayout(),window.requestAnimationFrame((function t(){i.stats.begin(),i.tick(),requestAnimationFrame(t),i.ke=0,i.stats.end()}))},createBigCircle:function(t){for(var i=this,n=new k(t.x,t.y),e=0;e<this.circles.length;e++){var o=this.circles[e].position.clone().sub(n),s=o.length();s<=200&&n.add(o.normalize().addScalar(100-s))}var r=new a.c;r.lineStyle(0),r.beginFill(14561865,1),r.drawCircle(0,0,100),r.endFill();var d=new a.d("\u70b9\u51fb\u5173\u95ed",new a.e({fill:16777215}));d.position.set(n.x,n.y);var h=new y;h.gh=r,r.popup=h,h.txt=d,r.position.set(n.x,n.y),h.position.set(n.x,n.y),this.circles.push(h),r.interactive=!0,r.on("click",(function(t){var n=t.target.popup;g.stage.removeChild(n.gh,n.txt),i.circles.splice(i.circles.findIndex((function(t){return t===n})),1)})),g.stage.addChild(r),g.stage.addChild(d)},tick:function(){for(var t=0;t<2;t++)this.updateCoulombsLaw(),this.updateHooksLaw();this.updateCircles(),this.update(),this.onTick()},updateCircles:function(){for(var t=0;t<this.nodes.length;t++)for(var i=0;i<this.circles.length;i++){var n=this.nodes[t],e=this.circles[i];if(Math.sqrt(Math.pow(n.position.x-e.position.x,2)+Math.pow(n.position.y-e.position.y,2))<120){var o=n.position.clone().sub(e.position).normalize().multiplyScalar(2);n.a.add(o)}}},updateCoulombsLaw:function(){for(var t=this.nodes.length,i=0;i<t;i++)for(var n=i+1;n<t;n++)if(i!==n){var e=this.nodes[i],o=this.nodes[n],s=e.position.clone().sub(o.position),a=s.length(),r=s.normalize().multiplyScalar(400).multiplyScalar(1/Math.pow(a,2)),d=r.clone().multiplyScalar(-1);e.a.add(r),o.a.add(d)}},updateHooksLaw:function(){for(var t=this.links.length,i=0;i<t;i++){var n=this.links[i],e=n.source,o=n.target,s=n.length,a=e.position.clone().sub(o.position),r=a.clone().normalize(),d=s-a.length(),h=r.multiplyScalar(.01*d),c=h.clone().multiplyScalar(-1);e.a.add(h),o.a.add(c)}},update:function(){for(var t=0,i=this.nodes.length;t<i;t++){var n=this.nodes[t];n.v.add(n.a);var e=n.position.clone();"undefined"!==typeof n.fx?n.position.x=n.fx:n.position.x=e.add(n.v.multiplyScalar(.8)).x,"undefined"!==typeof n.fy?n.position.y=n.fy:n.position.y=e.add(n.v.multiplyScalar(.8)).y,n.a.set(0,0),this.calcKE(n)}v.clear();for(var o=0,s=this.links.length;o<s;o++){var a=this.links[o],r=a.target,d=a.source;v.lineStyle(2,16777215),v.moveTo(d.position.x,d.position.y),v.lineTo(r.position.x,r.position.y)}},calcKE:function(t){this.ke+=.5*t.mass*Math.pow(t.v.length(),2)},onDragStart:function(t){this.data=t.data,this.alpha=.5,this.presing=!0},onDragEnd:function(){console.log("onDragEnd"),this.alpha=1,this.dragging=!1,this.presing=!1,this.data=null,this.node.fx=void 0,this.node.fy=void 0,this.node.a.set(0,0),this.node.v.set(0,0)},onDragMove:function(){if(this.presing&&(this.dragging=!0),this.dragging){var t=this.data.getLocalPosition(this.parent);this.node.fx=t.x,this.node.fy=t.y}}},function(){var t=new m;t.addNodes(h.nodes),t.addLinks(h.links),t.start(),t.onTick=function(){t.nodes.forEach((function(t){t.c.position.set(t.position.x,t.position.y)}))}}()},7:function(t){t.exports=JSON.parse('{"nodes":[{"id":"\u9c81\u8fc5"},{"id":"\u8001\u820d"},{"id":"\u80e1\u9002"},{"id":"\u6768\u7edb"},{"id":"\u6c88\u4ece\u6587"},{"id":"\u77db\u76fe"},{"id":"\u66f9\u79ba"},{"id":"\u8427\u7ea2"},{"id":"\u90ed\u6cab\u82e5"},{"id":"\u5468\u4f5c\u4eba"}],"links":[{"source":0,"target":1},{"source":2,"target":3},{"source":4,"target":5},{"source":4,"target":6},{"source":4,"target":7},{"source":7,"target":8}]}')}},[[14,1,2]]]);
//# sourceMappingURL=index.7f7f729b.chunk.js.map