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
    uniform vec3 uCamera;

    varying vec2 vUv;
    varying vec3 transformedNormal;

    #define Sm(a,b,t) smoothstep(a,b,t);

    vec2 getUVInUse () {
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

        return uvInUse;
    }

    void main() {
        // set UV to use
        vec2 alteredUV = getUVInUse();
        
        // **** Mouse timeline scrubbing **** 
        float time = 0.0;
        if (uMouse != 0.0) {
            time = uMouse * 0.001;
        } else {
            time = uTime*0.05;
        }
       
       // **** Camera **** 
        vec3 cameraPosition = uCamera;
        float zoom = 10.0;
        vec3 lookat = vec3(0.0, 0.0, 0.0);

        // **** Main code section **** 
        //alteredUV.y += 0.5;

        vec4 col = vec4(0.0);
        col = simpleForestPlane(alteredUV, uTime*0.1, col);
        
        gl_FragColor = col;
    }
`;

export class OverTheMoon {
    getVertexshader() {
        return vertexshader;
    }

    getFragmentshader() {
        return fragmentshader;
    }
}