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
     
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

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
    
    
    float Circle(vec2 point, float radius, vec2 origo, float blur) {
        vec2 transform = origo.xy;
        transform += -point;
        float dist = length(transform);
        
        float circleColor = smoothstep(radius, radius - blur, dist);
        
        if (circleColor < 0.0) {
            circleColor = 0.0;
        }
        
        return circleColor;
    }

    void main() {
        vec2 centerUV = -1.0 + (2.0 * vUv.xy);
        //vec3 color = vec3(0.3, 0.4, 0.4*length(centerUV));
        vec3 color = vec3(0.0);
        
        vec3 circleColor = vec3(1.0, 0.0, 0.0);
        vec3 circles = circleColor * Circle(vec2(0.0), 0.3, centerUV, 0.05);
        circles -= circleColor * Circle(vec2(0.0), 0.1, centerUV, 0.05);
        
        vec3 circleColor2 = vec3(1.0, 0.0, 0.0);
        vec3 circles2 = circleColor2 * Circle(vec2(0.3), 0.3, centerUV, 0.05);
        circles2 -= circleColor2 * Circle(vec2(0.3), 0.1, centerUV, 0.05);
        
        color += circles + circles2;

        gl_FragColor = vec4(color, 1.0);
    }  
`;