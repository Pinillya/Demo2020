export let vertexshader = `
    uniform vec2 uResolution;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 col;
    
    void main() {
      vUv = uv;
      vec3 warpUV = position;
      float warpFactor = 0.05;
      col = position;
      col = normal;
      col = vec3(uv.x, uv.y, 1.0);
      
      //warpUV.x += sin(warpUV.y * warpFactor)*5.0;
      //warpUV.y += sin(warpUV.z * warpFactor)*5.0;
      //warpUV.z += sin(warpUV.x * warpFactor)*5.0;
     
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
    
    float plot(vec2 st, float pct){
      return  smoothstep( pct-0.02, pct, st.y) -
              smoothstep( pct, pct+0.02, st.y);
    }


void main() {

	vec2 st = vUv.yx;
	
	float y = st.x;
	
	
    //float y = smoothstep(0.1,0.9,st.x);
    //float y = sin(st.x*20.0);

    vec3 color = vec3(0.0);
    
    
    
    //vec3 col = mix(colorA, colorB, vec3(color));

    // Plot a line
    float pct = plot(st,y);
    color = (1.0 - pct) * col + pct * vec3(0.0,1.0,0.0);
    
    //color = col;

	gl_FragColor = vec4(color.r, color.g, color.b , 1.0);
}
   
`;


/*

    void main() {
      vec2 center = -1.0 + (2.0 * vUv.xy);
      //vec2 uvCentered = floor(center.xy * 1.0);

      float circleP = smoothstep(0.4, 0.4, length(vUv-0.5));
      vec3 col = mix(colorA, colorB, vec3(circleP));

      col.xy *= center.xy;

      gl_FragColor = vec4(col.x, col.y, col.z, 1.0);

      //if(mod(uv.x + uv.y, 2.0) > 0.5){
      //  gl_FragColor = vec4(colorA, 1.0);
      //}else{
      //  gl_FragColor = vec4(colorB, 1.0);
      //}
    }

*/