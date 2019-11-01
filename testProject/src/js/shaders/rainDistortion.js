export let rainDistortion = `

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
        

        float mask1 = smoothstep(0.07, 0.00, distance);
        
        
        //Mask2
        vec2 mask2AspectRatio = vec2(1.0, 2.0);
        vec2 offset2 = (fract(uvInUse*aspectRatio.x*mask2AspectRatio)-0.5)/mask2AspectRatio;
        
        distance = length(offset2);
        float mask2Cutoff = smoothstep(-0.1, 0.1, rainUV.y-point1.y);
        //distance *= smoothstep(0.00001, 1.0, rainUV.y-point1.y);
        
        float mask2Point = smoothstep(0.3*(0.5-rainUV.y), 0.0, distance);
        
        float mask2 = mask2Point * mask2Cutoff;
       
        //debugging
        //if (rainUV.x >  0.46 || rainUV.y >  0.49) {mask1 = 1.0;} 
        
        //return sin(uvInUse.y * 40.0) * 0.01;

        return vec2(mask1*(offset1*10.0) + mask2*(offset2*20.0));
    }
    
`;