export let rainDistortion = `
    
   vec2 getCurrentCellID(vec2 rainUV) {
    return floor(rainUV);
   }
   
    vec2 RainDistortion (vec2 uvInUse, float time, float fade) {        
        vec2 aspectRatio = vec2(3.0, 1.0);
        vec2 rainUV = uvInUse*aspectRatio;
        vec2 cellID = getCurrentCellID(rainUV);
        rainUV.y += time * 0.22;
        
        // *** Randomizing the cells ***
        float cellNoise = fract(sin(cellID.x*9.4)*7634.32);
        rainUV.y += cellNoise;
        uvInUse.y += cellNoise;
        
        // *** 
        cellID = getCurrentCellID(rainUV);
        rainUV = fract(rainUV)-0.5;
        
        
        //Mask1
        float mask1FallTimer = time + fract(sin(cellID.x * 76.4 + cellID.y * 557.0)*760.32) * 6.283; 
        float posY = -sin(mask1FallTimer+sin(mask1FallTimer+sin(mask1FallTimer))*0.5)*0.27;  
        vec2 point1 = vec2(0.0, posY);
        vec2 offset1 = (rainUV-point1)/aspectRatio;
        float distance = length(offset1);
        float mask1 = smoothstep(0.07, 0.00, distance);
        
        //Mask2
        vec2 mask2AspectRatio = vec2(1.0, 2.0);
        float mask2Cutoff = smoothstep(-0.1, 0.1, rainUV.y-point1.y);
        vec2 offset2 = (fract(uvInUse*aspectRatio.x*mask2AspectRatio) -0.5)/mask2AspectRatio;
        distance = length(offset2);
        float mask2Point = smoothstep(0.3*(0.5-rainUV.y), 0.0, distance);        
        float mask2 = mask2Point * mask2Cutoff;
       
        //debugging
        //if (rainUV.x >  0.45 || rainUV.y >  0.48) {mask1 = 1.0;} 
        
        return vec2(mask1*(offset1*10.0) + mask2*(offset2*20.0)) * fade;
    }
    
`;