export let utilities = `

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
    
`;