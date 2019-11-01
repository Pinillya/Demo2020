let vertexshader = `
    uniform vec2 uResolution;
    uniform vec2 uObjectSize;
    uniform float uTime;
    uniform float uMouse;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

    }
`;

let fragmentshader = `
    uniform vec2 uResolution;
    uniform vec2 uObjectSize;
    uniform float uTime;
    uniform float uMouse;
    uniform sampler2D texture1;
    
    varying vec2 vUv;
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
    
    vec2 RainDistortion (vec2 uvInUse, float time) {
        
        vec2 aspectRatio = vec2(3.0, 1.0);
        //float screenDivisionCount = 3.0;
        time *= 80.0;

        
        //uvInUse *= screenDivisionCount;
        vec2 rainUV = uvInUse*aspectRatio;
        
        vec2 cellID = floor(rainUV);
        
        rainUV.y += time * 0.22;
        float cellNoise = fract(sin(cellID.x*706.4)*96.32);
        //cellNoise += fract(sin(cellID.x*7065.4)*7602.32);
        rainUV.y += cellNoise;
        
        uvInUse.y += cellNoise;
                
        cellID = floor(rainUV);
        rainUV = fract(rainUV)-0.5;
        
        time += fract(sin(cellID.x * 76.4 + cellID.y * 557.0)*760.32) * 6.283; 
        
        
        
        
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

        return vec2(mask1*(offset1*10.0) + mask2*(offset2*20.0));
    }
    
    float Bias(float time, float bias) {
      float biasValue = time / ((((1.0/bias) - 2.0)*(1.0 - time))+1.0);
      return biasValue;
    }
    
    float Gain (float time, float gain) {
      float gainReturn = 0.0;
      if (time < 0.5) {
        //gainReturn = Bias(time, gain);
        gainReturn = Bias(time * 2.0, gain)/2.0;
      } else {
        gainReturn = Bias((time * 2.0 - 1.0), (1.0 - gain)) / 2.0 + 0.5;
      }
      return gainReturn;
    }
    
    // blur must be between 0 and 1
    vec3 mix3 (vec3 v1, vec3 v2, vec3 v3, float mixVal, float midPoint, float topBlur, float botBlur) {
        topBlur = clamp(topBlur, 0.0, 1.0);
        botBlur = clamp(botBlur, 0.0, 1.0);
        
        mixVal = mod(mixVal, 1.0);
        mixVal = Bias(mixVal, midPoint);
        
        vec3 mixResult = vec3(0.0);
        if (mixVal < 0.5) {
            float normalizedValue = mixVal*2.0;
            normalizedValue = Gain(normalizedValue, botBlur);
            mixResult = mix(v1, v2, normalizedValue);
        } else {
            float normalizedValue = (mixVal-0.5)*2.0;
            normalizedValue = Gain(normalizedValue, topBlur);
            mixResult = mix(v2, v3, normalizedValue);
        }
        
        return mixResult;
    }
    
    void main() {    
        //****  2d uv **** 
        vec2 flatUV = gl_FragCoord.xy / uResolution.xy;
        flatUV -= 0.5;
        flatUV.x *= uResolution.x / uResolution.y;
        
        // **** 3d uv **** 
        vec2 centeredvUv = vUv;
        centeredvUv += -0.5;
        centeredvUv.x *= uObjectSize.x / uObjectSize.y;
        
        // set UV to use
        vec2 uvInUse = centeredvUv;
        
        // **** Mouse timeline scrubbing **** 
        float time = 0.0;
        if (uMouse != 0.0) {
            time = uMouse * 0.001;
        } else {
            time = uTime*0.05;
        }
       
       // **** Camera **** 
        vec3 cameraPosition = vec3(0.5, 0.2, 0.0);
        float zoom = 2.0;
        vec3 lookat = vec3(0.5, 0.2, 1.0);
        
        
        // This is the shader after all standard stuff has been added:
        // **** **** ---- ****
        vec3 color = vec3(0.0);
        vec3 colorTop = vec3(0.512,0.731,0.912);
        vec3 colorMid = vec3(1.000,0.510,0.529);
        vec3 colorBot = vec3(0.912,0.790,0.524);
        
        vec2 rain = RainDistortion(uvInUse*13.0, time)*0.5;
        rain = RainDistortion(uvInUse*15.0, time)*1.2;
        
        uvInUse.x += sin(uvInUse.y*73.1)*0.002;
        uvInUse.y += sin(uvInUse.x*23.1)*0.005;
        
        ray cameraRay = GetRay(cameraPosition, lookat, uvInUse-rain, zoom);

        vec3 colorTint = mix3(colorBot, colorMid, colorTop, vUv.y, 0.5, 0.6 *sin(vUv.x*3.0) , 0.2 * sin(vUv.x*3.0));
        colorTint *= vec3(0.6);
        // color += colorTint;
        color += (cameraRay.direction.y );
        
        vec4 textureColor = texture2D( texture1, vUv );

        gl_FragColor = textureColor + vec4(color, 1.0);
    }  
`;

export class Raindrops {
    getVertexshader() {
        return vertexshader;
    }

    getFragmentshader() {
        return fragmentshader;
    }
}