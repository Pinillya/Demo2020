export let vertexshader = `
    uniform vec2 uResolution;
    uniform vec2 uObjectSize;
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
    uniform vec2 uObjectSize;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 col;
    varying vec3 transformedNormal;
    
    #define Sm(a,b,t) smoothstep(a,b,t);
    
    struct ray {
        vec3 origin, direction;
    };
    
    ray GetRay (vec3 cameraPosition, vec3 lookout, vec2 uvInUse, float zoom) {
        ray a;
        a.origin = cameraPosition;
    
        vec3 forward = normalize(lookout - a.origin);
        vec3 right = cross(vec3(0.0, 1.0, 0.0), forward);
        vec3 up = cross(forward, right);
        vec3 cameraCenter = a.origin + forward * zoom;
        vec3 intersection = cameraCenter + uvInUse.x * right+ uvInUse.y * up;
        
        //Ray dir with camera
        a.direction = normalize(intersection - a.origin);
        return a;
    
    }
    
    vec3 ClosestPoint (ray r, vec3 point) {
        return r.origin + max(0.0, dot(point-r.origin, r.direction))* r.direction ;
    }
    
    
    float DistanceRay(ray r, vec3 point){
        //return length(cross(point-r.origin, r.direction))/length(r.direction);
        return length(point-ClosestPoint(r, point));
    }
    
    float Bokeh (ray r, vec3 point, float size, float blur) {
        float distance = DistanceRay(r, point);
        
        size *= length(point);
       
        float circle = Sm(size, size*(1.0-blur), distance);
        circle *= mix( 0.6, 1.0, smoothstep(size*0.8, size, distance));
        return circle;
    }
    
    vec3 StreetLights (ray r, float time, vec3 color) {
        //mirror the screen
        float lightIntervalStep = step(r.direction.x, 0.0);
        r.direction.x = abs(r.direction.x);
        
        float massOfCircles = 0.0;
        for (float i = 0.0; i < 10.0; i += 1.0) {
            float timeDistorted = fract((time + i * 0.1 + lightIntervalStep * 0.1 * 0.5  ));
            
            vec3 point = vec3(2.0, 2.0, 100.0 - timeDistorted * 100.0);
            massOfCircles += Bokeh(r, point, 0.05, 0.1) * timeDistorted * timeDistorted * timeDistorted;
        }
        
        color = vec3(massOfCircles);
        
        return color;
    }
    
    void main() {
        // 2d uv
        vec2 flatUV = gl_FragCoord.xy / uResolution.xy;
        flatUV -= 0.5;
        flatUV.x *= uResolution.x / uResolution.y;
        
        // 3d uv
        vec2 centeredvUv = vUv;
        centeredvUv += -0.5;
        centeredvUv.x *= uObjectSize.x / uObjectSize.y;
        
        // set UV to use
        vec2 uvInUse = centeredvUv;
       
       //Camera
        vec3 cameraPosition = vec3(0.0, 0.2, 0.0);
        float zoom = 2.0;
        vec3 lookat = vec3(0.0, 0.2, 1.0);
        ray cameraRay = GetRay(cameraPosition, lookat, uvInUse, zoom);
        
        vec3 color = vec3(0.0);
        float time = uTime*0.1;
        vec3 streetLights = StreetLights(cameraRay, time, color);

        color += streetLights;
        color *= col;
        
        gl_FragColor = vec4(color, 1.0);
    }  
`;