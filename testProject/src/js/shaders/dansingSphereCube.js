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

    varying vec2 vUv;
    varying vec3 col;
    varying vec3 transformedNormal;
    
    
    float DistanceLine(vec3 rayOrigin, vec3 rayDirection, vec3 point){
        return length(cross(point-rayOrigin, rayDirection))/length(rayDirection);
    }
    
    float DrawPoint (vec3 rayOrigin, vec3 rayDirection, vec3 point) {
        float direction = DistanceLine(rayOrigin, rayDirection, point);
        direction = smoothstep(0.019, 0.009, direction);
        
        return direction; 
    }
    
    void main() {
    
    
        // 2d uv
        vec2 flatUV = gl_FragCoord.xy / uResolution.xy;
        flatUV -= 0.5;
        flatUV.x *= uResolution.x / uResolution.y;
        
        // 3d uv
        vec2 centeredvUv = vUv;
        centeredvUv += -0.5;
        
        // set UV to use
        vec2 uvInUse = centeredvUv;
       
        //Ray
        vec3 rayOrigin = vec3(3.0 * sin(uTime), 1.0, -1.0);
        
        //Camera
        float zoom = 1.0;
        vec3 lookout = vec3(0.2);
        vec3 forward = normalize(lookout - rayOrigin);
        vec3 right = cross(vec3(0.0, 1.0, 0.0), forward);
        vec3 up = cross(forward, right);
        vec3 cameraCenter = rayOrigin + forward * zoom;
        vec3 intersection = cameraCenter + uvInUse.x * right+ uvInUse.y * up;
        
        //Ray dir without camera
        //vec3 rayIntersection = vec3 (uvInUse.x, uvInUse.y, 0.0);
        //vec3 rayDirection = rayIntersection - rayOrigin;
        
        //Ray dir with camera
        vec3 rayDirection = intersection - rayOrigin;
                
        float direction = 0.0;
        float translation = 0.4;
        direction += DrawPoint(rayOrigin, rayDirection, vec3(0.0, 0.0, 0.0));
        direction += DrawPoint(rayOrigin, rayDirection, vec3(0.0, 0.0, translation));
        direction += DrawPoint(rayOrigin, rayDirection, vec3(0.0, translation, 0.0));
        direction += DrawPoint(rayOrigin, rayDirection, vec3(0.0, translation, translation));
        direction += DrawPoint(rayOrigin, rayDirection, vec3(translation, 0.0, 0.0));
        direction += DrawPoint(rayOrigin, rayDirection, vec3(translation, 0.0, translation));
        direction += DrawPoint(rayOrigin, rayDirection, vec3(translation, translation, 0.0));
        direction += DrawPoint(rayOrigin, rayDirection, vec3(translation, translation, translation));


        vec3 color = vec3(direction);
        color += col;
        
        gl_FragColor = vec4(color, direction);
    }  
`;