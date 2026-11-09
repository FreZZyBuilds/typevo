import{r as p,j as P}from"./index-DlBQENF4.js";const Z=`
                attribute vec2 position;
                void main() { gl_Position = vec4(position, 0.0, 1.0); }
            `,ee=`
                precision highp float;
                uniform vec2 u_resolution;
                uniform float u_time;
                uniform vec2 u_mouse;
                uniform float u_strike;

                #define PI 3.14159265359

                float hash(vec2 p) { return fract(sin(dot(p, vec2(23.71, 91.37))) * 41537.1234); }

                // damped-cosine stand-in for the Bessel envelope of a circular mode
                float bess(float x) { return cos(x - 0.785398) / sqrt(1.0 + abs(x)); }

                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                    vec2 p = uv * 2.0 - 1.0;
                    p.x *= u_resolution.x / u_resolution.y;
                    p.y += 0.08;

                    vec2 m = u_mouse / u_resolution.xy * 2.0 - 1.0;
                    m.y = -m.y;
                    m.x *= u_resolution.x / u_resolution.y;
                    p -= m * 0.11;

                    float t = u_time * 0.09;
                    float r = length(p);
                    float a = atan(p.y, p.x);

                    // the bell drifts between partials the way a struck bell does
                    float ang = 3.0 + 1.6 * sin(t * 0.37) + sin(t * 0.19 + 1.7);
                    float k   = 3.1 + 1.0 * sin(t * 0.23 + 0.6);

                    float amp = 1.0 + (1.0 - u_strike) * 0.55;
                    float f1 = bess(r * k * PI - t * 2.2) * cos(ang * a + t * 0.5);
                    float f2 = bess(r * k * 1.6 * PI + t * 1.4) * cos((ang * 2.0 + 1.0) * a - t * 0.31);
                    float f = (f1 + f2 * 0.30) * amp;

                    // nodal lines — where the metal stands still
                    float node = 1.0 - smoothstep(0.0, 0.075 + 0.075 * r, abs(f));
                    // antinodes — where it moves, and glows hot
                    float anti = smoothstep(0.40, 0.95, abs(f));

                    // the crown stays quiet — clears a reading zone under the type
                    float open = smoothstep(0.14, 0.92, r);
                    node *= open;
                    anti *= open;

                    vec3 deep   = vec3(0.031, 0.055, 0.051);
                    vec3 patina = vec3(0.306, 0.608, 0.541);
                    vec3 bronze = vec3(0.847, 0.608, 0.247);
                    vec3 ash    = vec3(0.937, 0.914, 0.863);

                    vec3 col = deep;
                    col = mix(col, patina, node * 0.50);
                    col = mix(col, bronze, anti * 0.22);
                    col += ash * pow(node, 3.0) * 0.13;

                    // shock ring travelling out from the strike
                    float ring = smoothstep(0.06, 0.0, abs(r - u_strike * 2.3)) * (1.0 - u_strike);
                    col += mix(bronze, ash, 0.4) * ring * 0.7;

                    col *= mix(0.10, 1.0, smoothstep(2.0, 0.28, r));
                    col += (hash(gl_FragCoord.xy) - 0.5) * 0.022;

                    gl_FragColor = vec4(col, 1.0);
                }
            `,O={speed:1,pointerAmount:1,strikeDuration:2400,emberAmount:1,brightness:1,opacity:1,hue:0,saturation:1};function G(s,g,v){const l=s.createShader(g);if(!l)throw new Error("Unable to create Bell Field shader");if(s.shaderSource(l,v),s.compileShader(l),!s.getShaderParameter(l,s.COMPILE_STATUS))throw new Error(s.getShaderInfoLog(l)??"Bell Field shader compilation failed");return l}function oe({className:s="",...g}){const v=p.useRef(null),l=p.useRef(null),S=p.useRef(null),x=p.useRef({...O,...g});x.current={...O,...g},p.useEffect(()=>{const c=v.current,a=l.current,b=S.current;if(!c||!a||!b)return;const e=a.getContext("webgl"),m=b.getContext("2d");if(!e||!m)return;const I=G(e,e.VERTEX_SHADER,Z),L=G(e,e.FRAGMENT_SHADER,ee),r=e.createProgram();if(!r)return;if(e.attachShader(r,I),e.attachShader(r,L),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(r)??"Bell Field program link failed");e.useProgram(r);const B=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,B),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),e.STATIC_DRAW);const T=e.getAttribLocation(r,"position");e.enableVertexAttribArray(T),e.vertexAttribPointer(T,2,e.FLOAT,!1,0,0);const H=e.getUniformLocation(r,"u_resolution"),V=e.getUniformLocation(r,"u_time"),X=e.getUniformLocation(r,"u_mouse"),Y=e.getUniformLocation(r,"u_strike");let i=1,h=1,d=1,y=.5,_=.5,E=.5,R=.5,u=0,A=!0,C=!1,U=-1e9;const K=performance.now(),$=Array.from({length:58},()=>({x:Math.random(),y:Math.random(),r:.4+Math.random()*1.4,vy:-(.1+Math.random()*.26),vx:(Math.random()-.5)*.08,ph:Math.random()*Math.PI*2,sp:.5+Math.random()*1.4,hot:Math.random()<.36})),z=()=>{const n=c.getBoundingClientRect();i=Math.max(1,n.width),h=Math.max(1,n.height),d=Math.min(window.devicePixelRatio||1,2),a.width=Math.max(1,Math.round(i*d)),a.height=Math.max(1,Math.round(h*d)),b.width=a.width,b.height=a.height,m.setTransform(d,0,0,d,0,0),e.viewport(0,0,a.width,a.height),e.uniform2f(H,a.width,a.height),C||(y=E=i*.5,_=R=h*.5,C=!0),$.forEach(o=>{o.x<=1&&(o.x*=i),o.y<=1&&(o.y*=h)})},D=n=>{const o=c.getBoundingClientRect(),f=x.current.pointerAmount;E=i*.5+(n.clientX-o.left-i*.5)*f,R=h*.5+(n.clientY-o.top-h*.5)*f},M=()=>{U=performance.now()},W=window.setTimeout(M,1700),J=window.setInterval(M,8200),F=n=>{const o=x.current,f=n*.001*o.speed;y+=(E-y)*.04,_+=(R-_)*.04,e.uniform1f(V,(n-K)*.001*o.speed),e.uniform1f(Y,Math.min(1,Math.max(0,(n-U)/o.strikeDuration))),e.uniform2f(X,y*d,_*d),e.drawArrays(e.TRIANGLES,0,6),m.clearRect(0,0,i,h);const Q=Math.max(0,Math.min(58,Math.round(58*o.emberAmount)));for(let k=0;k<Q;k+=1){const t=$[k];t.y+=t.vy*o.speed,t.x+=(t.vx+Math.sin(f*t.sp*.5+t.ph)*.13)*o.speed,t.y<-4&&(t.y=h+4,t.x=Math.random()*i),t.x<-4&&(t.x=i+4),t.x>i+4&&(t.x=-4);const N=.5+.5*Math.sin(f*t.sp+t.ph);m.beginPath(),m.arc(t.x,t.y,t.r,0,Math.PI*2),m.fillStyle=t.hot?`rgba(231, 193, 101, ${.06+N*.34})`:`rgba(143, 203, 185, ${.04+N*.24})`,m.fill()}u=A&&!document.hidden?requestAnimationFrame(F):0},j=new ResizeObserver(z),q=new IntersectionObserver(([n])=>{A=n?.isIntersecting??!0,A&&!u&&(u=requestAnimationFrame(F)),!A&&u&&(cancelAnimationFrame(u),u=0)});return j.observe(c),q.observe(c),c.addEventListener("pointermove",D,{passive:!0}),c.addEventListener("pointerdown",M),z(),u=requestAnimationFrame(F),()=>{u&&cancelAnimationFrame(u),window.clearTimeout(W),window.clearInterval(J),j.disconnect(),q.disconnect(),c.removeEventListener("pointermove",D),c.removeEventListener("pointerdown",M),e.deleteBuffer(B),e.deleteShader(I),e.deleteShader(L),e.deleteProgram(r)}},[]);const w=x.current;return P.jsxs("div",{ref:v,className:`threeui-background bell-field${s?` ${s}`:""}`,style:{background:"#08100f",opacity:w.opacity,filter:`hue-rotate(${w.hue}deg) saturate(${w.saturation}) brightness(${w.brightness})`},children:[P.jsx("canvas",{ref:l,style:{zIndex:0}}),P.jsx("canvas",{ref:S,style:{zIndex:1,pointerEvents:"none"}})]})}export{oe as BellFieldBackground};
