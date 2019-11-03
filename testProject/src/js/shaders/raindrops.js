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
        
        
        //RainDistortion(uvInUse, time, count, fade) 
        vec2 rain = RainDistortion(uvInUse * 7.0, time * 80.0, 1.0);
        //rain = RainDistortion(uvInUse * 1.0, time * 80.0)*1.2;
        
        uvInUse.x += sin(uvInUse.y*73.1)*0.002;
        uvInUse.y += sin(uvInUse.x*23.1)*0.005;
        
        ray cameraRay = GetRay(cameraPosition, lookat, uvInUse-rain, zoom);
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