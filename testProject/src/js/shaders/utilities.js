export let utilities = `

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

    // This is a box that will taper at one of the ends. 
    // This means that it can have a different width at the bottem then at the top.
    // (vec2 UV, float bottom_width_value, float top_width_value, float height_the_box_STARTS_at, float height_the_box_ENDS_at, float blured edge)
    float TaperBox(vec2 p, float widthBot, float widthTop, float yBot, float yTop, float blur) {
      float m = Sm(-blur, blur, p.y-yBot);
      m *= Sm(blur, -blur, p.y-yTop);

      p.x = abs(p.x);

      float w = mix(widthBot, widthTop, ((p.y-yBot)/(yTop-yBot)) );
      m *= Sm(blur, -blur, p.x-w);
      return m;
    }

    vec4 simpleTree (vec2 p, float blur, vec3 color) {
      
      // Bulk
      float m = TaperBox(p, 0.03, 0.03, -0.1, 0.25, blur); //trunk
      m += TaperBox(p, 0.2, 0.1, 0.25, 0.5, blur); //canopy 1
      m += TaperBox(p, 0.15, 0.05, 0.5, 0.75, blur); //canopy 2
      m += TaperBox(p, 0.1, 0.0, 0.75, 1.0, blur); // top

      // Shade
      float shadow = TaperBox(vec2(p.x+0.2, p.y), 0.1, 0.3, 0.15, 0.25, blur);
      shadow += TaperBox(vec2(p.x-0.2, p.y), 0.1, 0.3, 0.45, 0.5, blur);
      shadow += TaperBox(vec2(p.x+0.2, p.y), 0.1, 0.3, 0.70, 0.75, blur);

      color -= shadow*0.6;
      return vec4(color, m);
    }

    float getForestFloorHeight(float x) {
      return sin(x*0.244)+sin(x)*0.3;
    }

    vec4 simpleForestPlane(vec2 p, float uTime, vec4 col) {
      p.x += uTime;
      p *= 5.0;

      float id = floor(p.x);
      float randomXPos = fract(sin(id*289.1)*5991.0)*2.0-1.0;
      float randomScale = fract(sin(id*309.1)*5091.0)*2.0-1.0;
      float x = randomXPos*0.3;
      float y = getForestFloorHeight(p.x);
      col += Sm(0.005, -0.005, p.y + y); //ground
      y = getForestFloorHeight(id+0.5+x);
      p.x = fract(p.x) - 0.5;
      vec4 tree = simpleTree((p-vec2(x, -y))*vec2(1.0, 1.0+randomScale*0.2), 0.005, vec3(1.0));
      col = mix(col, tree, tree.a);
      return col;
    }
    
`;