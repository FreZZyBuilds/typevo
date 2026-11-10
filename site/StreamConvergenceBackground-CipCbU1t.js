import{r as g,j as b}from"./index-B0nNxUwU.js";const P=`
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,T=`
                uniform float u_time;
                uniform vec2 u_resolution;
                uniform float u_interactive_fidelity;
                varying vec2 vUv;

                mat2 rotate2d(float _angle){
                    return mat2(cos(_angle),-sin(_angle),
                                sin(_angle),cos(_angle));
                }

                void main() {
                    vec2 p = vUv * 2.0 - 1.0;
                    p.x *= u_resolution.x / u_resolution.y;
                    p = rotate2d(0.55) * p;

                    vec3 color = vec3(0.0);
                    float spread = 0.06 * (0.3 + u_interactive_fidelity * 0.7);

                    for(int i = 0; i < 3; i++) {
                        float offset = float(1 - i) * spread;
                        float y = p.y + offset + (sin(p.x * 2.5 - u_time * 1.5) * 0.12);
                        float wave = smoothstep(0.85, 0.99, sin(y * 6.0 + u_time * 2.0) * 0.5 + 0.5);
                        
                        // Modulating color mixing logic for the violet-indigo theme
                        if(i == 0) color.r += wave * 1.2; 
                        if(i == 1) color.g += wave * 0.5; 
                        if(i == 2) color.b += wave * 1.8; 
                    }

                    float vignette = exp(-length(vUv * 2.0 - 1.0) * 0.8);
                    color *= vignette;

                    gl_FragColor = vec4(color, 1.0);
                }
            `,y={speed:1,fidelity:.5,scale:1,brightness:1,opacity:1,hue:0,saturation:1};function x(r,l,u){const o=r.createShader(l);if(!o)throw new Error("Unable to create Stream Convergence shader");if(r.shaderSource(o,u),r.compileShader(o),!r.getShaderParameter(o,r.COMPILE_STATUS))throw new Error(r.getShaderInfoLog(o)??"Stream Convergence shader compilation failed");return o}function L({className:r="",...l}){const u=g.useRef(null),o=g.useRef(null),d=g.useRef({...y,...l});d.current={...y,...l},g.useEffect(()=>{const f=u.current,n=o.current;if(!f||!n)return;const e=n.getContext("webgl",{alpha:!0,antialias:!1});if(!e)return;const v=x(e,e.VERTEX_SHADER,P),p=x(e,e.FRAGMENT_SHADER,`precision highp float;
${T}`),t=e.createProgram();if(!t)return;if(e.attachShader(t,v),e.attachShader(t,p),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(t)??"Stream Convergence program link failed");e.useProgram(t);const _=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,_),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);const A=e.getAttribLocation(t,"position");e.enableVertexAttribArray(A),e.vertexAttribPointer(A,2,e.FLOAT,!1,0,0);const E=e.getUniformLocation(t,"u_time"),F=e.getUniformLocation(t,"u_resolution"),U=e.getUniformLocation(t,"u_interactive_fidelity");let i=0,m=!0;const w=()=>{const a=f.getBoundingClientRect(),s=Math.min(window.devicePixelRatio||1,2);n.width=Math.max(1,Math.round(a.width*s)),n.height=Math.max(1,Math.round(a.height*s)),e.viewport(0,0,n.width,n.height),e.uniform2f(F,n.width,n.height)},h=a=>{const s=d.current;e.uniform1f(E,a*3e-4*s.speed),e.uniform1f(U,s.fidelity),e.drawArrays(e.TRIANGLES,0,6),i=m&&!document.hidden?requestAnimationFrame(h):0},S=new ResizeObserver(w),R=new IntersectionObserver(([a])=>{m=a?.isIntersecting??!0,m&&!i&&(i=requestAnimationFrame(h)),!m&&i&&(cancelAnimationFrame(i),i=0)});return S.observe(f),R.observe(f),w(),i=requestAnimationFrame(h),()=>{i&&cancelAnimationFrame(i),S.disconnect(),R.disconnect(),e.deleteBuffer(_),e.deleteShader(v),e.deleteShader(p),e.deleteProgram(t)}},[]);const c=d.current;return b.jsx("div",{ref:u,className:`threeui-background stream-convergence${r?` ${r}`:""}`,children:b.jsx("canvas",{ref:o,style:{opacity:c.opacity,filter:`hue-rotate(${c.hue}deg) saturate(${c.saturation}) brightness(${c.brightness})`,transform:`scale(${c.scale})`}})})}export{L as StreamConvergenceBackground};
