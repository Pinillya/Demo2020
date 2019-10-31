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
    
    float Noise (float time) {
        return fract(sin(time*8058.0)*+9498.0);
    }
    
    vec4 Vec4Noise (float time) {
        return fract(sin(time*vec4(8445.0, 9736.0, 8743.0, 9149.0)) * vec4(3497.0, 9346.0, 7389.0, 9374.0));   
        //return vec4(Noise(time), Noise(time), Noise(time), Noise(time));
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
    
    vec3 StreetLights (ray r, float time) {
        //mirror the screen
        float lightIntervalStep = step(r.direction.x, 0.0);
        r.direction.x = abs(r.direction.x);
        
        float arrayOfCircles = 0.0;
        vec3 color = vec3(1.0, 0.7, 0.3);
        for (float i = 0.0; i < 10.0; i += 1.0) {
            float timeDistorted = fract((time + i * 0.1 + lightIntervalStep * 0.1 * 0.5  ));
            
            vec3 point = vec3(2.5, 2.0, 100.0 - timeDistorted * 100.0);
            arrayOfCircles += Bokeh(r, point, 0.05, 0.1) * timeDistorted * timeDistorted * timeDistorted;
        }
        
        color *= vec3(arrayOfCircles);
        
        return color;
    }
    
    vec3 EnvironmentLights (ray r, float time) {
        //mirror the screen
        float lightIntervalStep = step(r.direction.x, 0.0);
        r.direction.x = abs(r.direction.x);
        
        float arrayOfCircles = 0.0;
        vec3 color = vec3(0.0, 0.0, 0.0);
        for (float i = 0.0; i < 20.0; i += 1.0) {
            float timeDistorted = fract((time + i * 0.1 + lightIntervalStep * 0.1 * 0.5  ));
            float fade = timeDistorted * timeDistorted * timeDistorted * timeDistorted * timeDistorted * timeDistorted;
            vec4 noise4 = Vec4Noise(i+lightIntervalStep*100.0);
            float xpos = mix(2.5, 10.0, noise4.x);
            float ypos = mix(0.1 , 2.0, noise4.y);
            
            vec3 point = vec3(xpos, ypos, 50.0 - timeDistorted * 50.0);
            color += vec3(noise4.w, noise4.y, noise4.z) * Bokeh(r, point, 0.05, 0.1) * fade;
        }
        
        //color *= vec3(arrayOfCircles);
        
        return color;
    }
      
    // expands on StreetLights
    vec3 HeadLights (ray r, float time) {
        float width1 = 0.25;
        float width2 = width1 * 1.2;
        float arrayOfCircles = 0.0;
        vec3 color = vec3(0.9, 0.9, 1.0);
        time *= 2.0;
        const float carIntervals = 1.0/30.0;
        
        for (float i = 0.0; i < 1.0; i += carIntervals) {
            
            float noise = Noise(i);
            
            if (noise > 0.1) {
                continue;
            }
            
            float timeDistorted = fract((time + carIntervals));
            float z = 100.0 - timeDistorted * 100.0;
            float fade = timeDistorted * timeDistorted * timeDistorted;
            fade *= fade;
            float focus = Sm(0.8, 1.0, timeDistorted);
            float size = mix(0.05, 0.03, focus);
            
            //vec3 point = vec3(-1.0, 0.15, z);
            
            arrayOfCircles += Bokeh(r, vec3(-1.0-width1, 0.15, z), size, 0.1) * fade;
            arrayOfCircles += Bokeh(r, vec3(-1.0+width1, 0.15, z), size, 0.1) * fade;
            
            arrayOfCircles += Bokeh(r, vec3(-1.0-width2, 0.15, z), size, 0.1) * fade;
            arrayOfCircles += Bokeh(r, vec3(-1.0+width2, 0.15, z), size, 0.1) * fade;
        
            float reflection = 0.0;
            reflection += Bokeh(r, vec3(-1.0-width2, -0.15, z), size*3.0, 1.0) * fade;
            reflection += Bokeh(r, vec3(-1.0+width2, -0.15, z), size*3.0, 1.0) * fade;

            arrayOfCircles += reflection*focus;
        }
        
        color *= vec3(arrayOfCircles);
        
        return color;
    }
    
    
    // expands on HeadLights
    vec3 TailLights (ray r, float time) {
        float width1 = 0.25;
        float width2 = width1 * 1.2;
        float arrayOfCircles = 0.0;
        vec3 color = vec3(1.0, 0.1, 0.3);
        
        time *= 0.25;
        
        const float carIntervals = 1.0/10.0;
        
        for (float i = 0.0; i < 1.0; i += carIntervals) {
            
            float noise = Noise(i);
            
            if (noise > 0.5) {
                continue;
            }
            
            float timeDistorted = fract((time + i));
            float z = 100.0 - timeDistorted * 100.0;
            float fade = timeDistorted * timeDistorted * timeDistorted;
            fade *= fade;
            float focus = Sm(0.9, 1.0, timeDistorted);
            float size = mix(0.05, 0.03, focus);
            
            float lane = step(0.15, noise);
            float laneShit = Sm(0.99, 0.95, timeDistorted);
            float positionInRoad = 1.5;
            positionInRoad -= lane * laneShit;
            
            float blinker = (step(0.0, sin(time * 1000.0)) * 7.0) * lane * step(0.96,timeDistorted);

            arrayOfCircles += Bokeh(r, vec3(positionInRoad-width1, 0.15, z), size, 0.1) * fade;
            arrayOfCircles += Bokeh(r, vec3(positionInRoad+width1, 0.15, z), size, 0.1) * fade;
            
            arrayOfCircles += Bokeh(r, vec3(positionInRoad-width2, 0.15, z), size, 0.1) * fade;
            arrayOfCircles += Bokeh(r, vec3(positionInRoad+width2, 0.15, z), size, 0.1) * fade * (1.0+blinker);
            

            float reflection = 0.0;
            reflection += Bokeh(r, vec3(positionInRoad-width2, -0.15, z), size*3.0, 1.0) * fade;
            reflection += Bokeh(r, vec3(positionInRoad+width2, -0.15, z), size*3.0, 1.0) * fade * (1.0+blinker*0.1);

            arrayOfCircles += reflection*focus;
        }
        
        
        color *= vec3(arrayOfCircles);
        
        return color;
    }
    
    
    vec2 RainDistortion (vec2 uvInUse, float time) {
        
        vec2 aspectRatio = vec2(3.0, 1.0);
        //float screenDivisionCount = 3.0;
        time *= 80.0;

        
        //uvInUse *= screenDivisionCount;
        vec2 rainUV = uvInUse*aspectRatio;
        
        vec2 cellID = floor(rainUV);
        
        rainUV.y += time * 0.22;
        float cellNoise = fract(sin(cellID.x*706.4)*760.32);
        rainUV.y += cellNoise;
        uvInUse.y += cellNoise;
                
        cellID = floor(rainUV);
        rainUV = fract(rainUV)-0.5;
        
        time += fract(sin(cellID.x*76.4+cellID.y*557.0)*760.32) * 6.283; 
        
        
        
        float posY = -sin(time+sin(time+sin(time))*0.5)*0.27;  
        vec2 point1 = vec2(0.0, posY);
        
        vec2 offset1 = (rainUV-point1)/aspectRatio;
        float distance = length(offset1);
        

        float mask1 = Sm(0.07, 0.00, distance);
        
        
        //Mask2
        vec2 mask2AspectRatio = vec2(1.0, 2.0);
        vec2 offset2 = (fract(uvInUse*aspectRatio.x*mask2AspectRatio)-0.5)/mask2AspectRatio;
        
        distance = length(offset2);
        float mask2Cutoff = Sm(-0.1, 0.1, rainUV.y-point1.y);
        //distance *= Sm(0.00001, 1.0, rainUV.y-point1.y);
        
        float mask2Point = Sm(0.3*(0.5-rainUV.y), 0.0, distance);
        
        float mask2 = mask2Point * mask2Cutoff;
       
        //debugging
        //if (rainUV.x >  0.46 || rainUV.y >  0.49) {mask1 = 1.0;} 
        
        //return sin(uvInUse.y * 40.0) * 0.01;

        return vec2(mask1*(offset1*30.0) + mask2*(offset2*20.0));
    }
    
    void main() {
        // 2d uv
        vec2 flatUV = gl_FragCoord.xy / uResolution.xy;
        flatUV -= 0.5;
        flatUV.x *= uResolution.x / uResolution.y;
        float time = uTime*0.05;
        vec3 color = vec3(0.0);
        
        // 3d uv
        vec2 centeredvUv = vUv;
        centeredvUv += -0.5;
        centeredvUv.x *= uObjectSize.x / uObjectSize.y;
        
        // set UV to use
        vec2 uvInUse = centeredvUv;
       
       //Camera
        vec3 cameraPosition = vec3(0.5, 0.2, 0.0);
        float zoom = 2.0;
        vec3 lookat = vec3(0.5, 0.2, 1.0);
        
        vec2 rain = RainDistortion(uvInUse*5.0, time)*0.2;
        rain = RainDistortion(uvInUse*7.0, time)*0.2;
        
        uvInUse.x += sin(uvInUse.y*73.1)*0.002;
        uvInUse.y += sin(uvInUse.x*23.1)*0.005;
        
        ray cameraRay = GetRay(cameraPosition, lookat, uvInUse-rain, zoom);

        vec3 streetLights = StreetLights(cameraRay, time);
        vec3 environmentLights = EnvironmentLights(cameraRay, time);
        vec3 headLights = HeadLights(cameraRay, time);
        vec3 tailLights = TailLights(cameraRay, time);

        color += streetLights + headLights + tailLights + environmentLights;
        color += (cameraRay.direction.y + 0.25) * vec3(0.1, 0.1, 0.5);
        
        
        //color += vec3(rain.x, rain.y, 0.0);

        gl_FragColor = vec4(color, 1.0);
    }  
`;