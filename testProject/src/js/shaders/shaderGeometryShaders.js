export let vertexshader = `
    uniform vec2 uResolution;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 col;
    varying vec3 transformedNormal;
    
    void main() {
      vUv = uv;
      vec3 warpUV = position;
      float warpFactor = 0.05;
      col = position;
      col = normal;
      transformedNormal = normalMatrix * normal;

      col = vec3(uv.x, uv.y, 1.0);
     
      gl_Position = projectionMatrix * modelViewMatrix * vec4(warpUV,1.0);
    }
`;

export let fragmentshader = `
    uniform vec2 uResolution;
    uniform float uTime;
    uniform vec3 colorA;
    uniform vec3 colorB;
    
    varying vec2 vUv;
    varying vec3 col;
    
    varying vec3 transformedNormal;
    
    float makeSquare(vec2 st, float size, vec2 pos) {
        st.x += pos.x;
        st.y += pos.y;
        
        //vec2 squareSize = vec2(size);
    
        vec2 bl = step(vec2(0.4, 0.4),st);
        float pct = bl.x * bl.y;
        
        vec2 tr = step(vec2(0.4), 1.0-st);
        pct *= tr.x * tr.y;
        
        return pct;
    }

void main() {
	vec2 st = vUv.yx;
    vec3 color = vec3(0.0);
    vec3 colorMaroon= vec3(0.522, 0.078, 0.294) * vec3(transformedNormal);
        
    color += vec3(makeSquare(st, 0.4, vec2(0.2, 0.3)) * colorMaroon);
    color += vec3(makeSquare(st, 0.4, vec2(0.2, 0.0))) * colorMaroon;
    
	gl_FragColor = vec4(color.r, color.g, color.b , 1.0);
}  
`;