class BlizzardLampScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(1330,2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'blizzard'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = BlizzardLampScene.models.main;
        let layersData = {};
        let exclude = [
            'lamp_overlay', 'man_p', 'lamp_p', 'ground_p'
        ];
        
        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;
        
            layersData[layerName] = {
                renderIndex
            }
            
            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }
            
            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName] }),
                init() {
            
                }
            }), renderIndex)
            
            console.log(`${layerName} - ${renderIndex}`)
        }

        let createRadialGradient = function({ size, center, radius, gradientOrigin, angle, setter }) {
            // if(!size){
            //     size = this.viewport.clone();
            // }
    
            angle = degreeToRadians(angle);
    
            if(!setter){
                throw 'Dot value setter is not provided';
            }
    
            let setDot = (x,y, setter) => {
                let row = dots[y];
                if(!row){
                    dots[y] = [];
                    row = dots[y];
                }
    
                if(!row[x]){
                    row[x] = {};
                }
    
                setter(row[x]);
            }
    
            let isInEllipsis = (x,y) => {
                let _x = x-center.x;
                let _y = y-center.y;
    
                return Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq <= 1
            }
    
            let dots = [];
            let rxSq = radius.x*radius.x;
            let rySq = radius.y*radius.y;
            let maxSize = radius.x > radius.y ? new V2(radius.x, radius.x) : new V2(radius.y, radius.y);
            let _cos = Math.cos(angle);
            let _sin = Math.sin(angle);
            let ellipsisBox = new Box(center.substract(maxSize).toInt().add(new V2(-1,-1)), maxSize.mul(2).add(new V2(3,3)));
    
            if(!isInEllipsis(gradientOrigin.x, gradientOrigin.y))
                throw 'Gradient origin is not inside elipsis';
    
            let pp = undefined;
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                pp = new PP({ctx});
            })
    
            for(let y = center.y-maxSize.y-1;y < center.y+maxSize.y+1;y++){
                dots[y] = [];
                for(let x = center.x-maxSize.x-1;x < center.x+maxSize.x+1;x++){
                    if(!isInEllipsis(x,y)){
                        continue;
                    }
    
                    let currentDot = new V2(x,y);
    
                    if(currentDot.equal(gradientOrigin)){
                        setDot(x,y, (dot) => setter(dot, 1))
                        continue;
                    }
    
                    let currentDirection = gradientOrigin.direction(currentDot);
                    let point2 = rayBoxIntersection(currentDot, currentDirection, ellipsisBox);
                    if(!point2 || point2.length == 0)
                        throw 'No box intersection found!';
    
                    point2 = point2[0];
                    let linePoints = pp.lineV2(gradientOrigin, point2);
    
                    let stopIndex = 0;
                    for(let i = 0; i < linePoints.length;i++){
                        let linePoint = linePoints[i];
                        let _x = linePoint.x-center.x;
                        let _y = linePoint.y-center.y;
                        stopIndex = i; // индекс первого элемента за границей эллипса
                        if(Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq > 1)
                            break;
    
                    }
    
                    let aValues = easing.fast({from: 1, to: 0, steps: stopIndex, type:'quad', method:'out'});
                    for(let i = 0; i < stopIndex;i++){
                        let linePoint = linePoints[i];
    
                        setDot(linePoint.x, linePoint.y, (dot) => { setter(dot, aValues[i]) } )
                    }
                }
            }
    
            return dots;
        }

        let createSnowFrames = function({framesCount, itemsCount, itemFrameslength, size, mask, tailLengthClamps, angleClamps, maxA, overlay,
            lowerYClamps}) {
            let frames = [];

            //let  = [-30,30];
            //let tailLengthClamps = [10,15];
            let sharedPP;

            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })

            let leftLine = createLine(new V2(0, -4*size.y), new V2(0, 4*size.y))
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let p1 = new V2(size.x*1.5 + getRandomInt(-50, 50), getRandomInt(0, size.y));
                let p2 = raySegmentIntersectionVector2(p1, V2.left.rotate(getRandom(angleClamps[0], angleClamps[1])), leftLine);

                if(!p2)
                    throw 'Failed to find left line intersection';

                let tailLength = getRandomInt(tailLengthClamps);
                let lineDots = sharedPP.lineV2(p1, p2);
                let indexValues = easing.fast({from: 0, to: lineDots.length-1, steps: totalFrames, type: 'linear', round: 0});

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: indexValues[f],
                    };
                }
            
                return {
                    lowerY: lowerYClamps ? getRandomInt(lowerYClamps): undefined,
                    lineDots,
                    tailLength,
                    frames
                }
            })

            let rgbPart = '255,255,255';
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let index = itemData.frames[f].index;
                            let prev = undefined;
                            for(let i = 0; i < itemData.tailLength; i++){
                                let _index = index-i;
                                if(_index < 0)
                                    break;
                                
                                let opacity = 0
                                let point = itemData.lineDots[_index];

                                if(point.y < 0 || point.y > size.y || point.x < 0 || point.x > size.x)
                                    continue;

                                if(lowerYClamps && point.y > itemData.lowerY) {
                                    continue;
                                }

                                if(mask) {
                                    let row = mask[point.y];
                                    if(row){
                                        let dotValue =  mask[point.y][point.x];
                                        if(dotValue){
                                            let values = dotValue.values;
                                            if(!dotValue.average){
                                                dotValue.average = 0;
                                                for(let i = 0; i < values.length;i++){
                                                    dotValue.average+=values[i];
                                                }
    
                                                dotValue.average/=values.length;
    
                                                dotValue.average100 = fast.r(dotValue.average*100)
                                            }
    
                                            opacity = fast.r(dotValue.average*maxA,2);
                                            // color = {
                                            //     red: mask.colorsChange.red[dotValue.average100],
                                            //     green: mask.colorsChange.green[dotValue.average100],
                                            //     blue: mask.colorsChange.blue[dotValue.average100]
                                            // }
    
                                            //opacity = mask.colorsChange.opacity[dotValue.average100];
                                        }
                                    }
                                }
                                else {
                                    opacity = maxA;
                                }
                                
                                if(itemData.tailLength == 3) {
                                    if(i == 0){
                                        let __index = index+1;
                                        if(__index < itemData.lineDots.length) {
                                            let point = itemData.lineDots[__index];
                                            hlp.setFillColor(`rgba(${rgbPart}, ${opacity/2})`).dot(point)
                                        }
                                    }
                                    else if(i == itemData.tailLength-1){
                                        opacity/=2;
                                    }
                                }
                                else if(itemData.tailLength <= 5)
                                {
                                    if(i == 0 || i == itemData.tailLength-1){
                                        opacity/=2;
                                    }
                                }
                                else {
                                    if(i == 0 || i == itemData.tailLength-1){
                                        opacity/=4;
                                    }

                                    if(i == 1 || i == itemData.tailLength-2){
                                        opacity/=2;
                                    }
                                }

                                hlp.setFillColor(`rgba(${rgbPart}, ${opacity})`).dot(point)

                                if(prev) {
                                    if(prev.y != point.y){
                                        hlp.setFillColor(`rgba(${rgbPart}, ${opacity/2})`)
                                            .dot(point.x-1, point.y)
                                            .dot(point.x, prev.y)
                                            
                                    }
                                }
                                
                                prev = point;
                            }
                        }
                        
                    }

                    // ctx.globalCompositeOperation = 'destination-in';
                    // ctx.drawImage(overlay, 0, 0)
                });
            }
            
            return frames;
        }

        let setter = (dot, aValue) => {
            if(!dot.values){
                dot.values = [];
            }

            dot.values.push(aValue);
        }

        let dots = createRadialGradient({ 
            size: this.size, 
            center: new V2(65,130), 
            radius: new V2(50, 67), 
            gradientOrigin: new V2(54,75), 
            //gradientOrigin: new V2(80,140), 
            angle: -20, setter
        })

        this.blizzardAmbience = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFrames({ framesCount: 300, itemsCount: 1000, itemFrameslength: 110, size: this.size,
                            tailLengthClamps: [3,5], angleClamps: [0,-20], maxA: 0.05, lowerYClamps: [150, 156] });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.lamp.renderIndex-2)

        this.blizzard1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let overlay = PP.createImage(model, { renderOnly: ['lamp_overlay'], forceVisivility: { lamp_overlay: { visible: true } } })

               

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFrames({ framesCount: 300, itemsCount: 1000, itemFrameslength: 90, size: this.size, mask: dots,
                            tailLengthClamps: [3,5], angleClamps: [-10,-20], maxA: 0.15, overlay});
        
                        this.registerFramesDefaultTimer({
                            // framesChangeCallback: () => {
                            //     let foo = true;
                            // }
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), layersData.lamp.renderIndex-1)

        this.blizzard = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //let overlay = PP.createImage(model, { renderOnly: ['lamp_overlay'], forceVisivility: { lamp_overlay: { visible: true } } })

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let y = 0; y < dots.length; y++){
                                if(!dots[y])
                                    continue;
                                
                                for(let x = 0; x < dots[y].length; x++){
                                    if(!dots[y][x])
                                        continue;
        
                                    let values = dots[y][x].values;
                                    let value = 0;
                                    for(let i = 0; i < values.length;i++){
                                        value+=values[i];
                                    }
            
                                    value/=values.length;
            
                                    hlp.setFillColor(`rgba(255,255,255, ${fast.r(value*0.1,3)})`).dot(x, y);//fast.r(value,2)/2
                                }
                            }
                        })
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFrames({ framesCount: 300, itemsCount: 3000, itemFrameslength: 90, size: this.size, mask: dots,
                            tailLengthClamps: [3,5], angleClamps: [0,-15], maxA: 0.3});
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                // this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         this.frames = createSnowFrames({ framesCount: 300, itemsCount: 500, itemFrameslength: 70, size: this.size, mask: dots,
                //             tailLengthClamps: [3,5], angleClamps: [-10,-20], maxA: 0.75,});
        
                //         this.registerFramesDefaultTimer({});
                //     }
                // }))

                

                
            }
        }), layersData.lamp.renderIndex+1)

        this.blizzard2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
               

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFrames({ framesCount: 300, itemsCount: 500, itemFrameslength: 90, size: this.size, mask: dots,
                            tailLengthClamps: [5,8], angleClamps: [-5,-5], maxA: 0.75});
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.man.renderIndex+1)

        this.treeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 150;
                let totalAnimationFrames = 140;
                let oneFrameLength = 20;
                let oneFrameStartShift = fast.r(((totalFrames-totalAnimationFrames)/2) - oneFrameLength/2);

                let aniParams = [
                    { layerName: 'l1', animationStartFrame: 20, },
                    { layerName: 'l2', animationStartFrame: 40, },
                    { layerName: 'l3', animationStartFrame: 50, },
                    { layerName: 'l4', animationStartFrame: 60, },

                    { layerName: 'l5', animationStartFrame: 80, },

                    { layerName: 'l6', animationStartFrame: 70, },
                    { layerName: 'l7', animationStartFrame: 60, },
                    { layerName: 'l8', animationStartFrame: 50, },
                    { layerName: 'l9', animationStartFrame: 30, },
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(BlizzardLampScene.models.treeAnimation, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)//.map((el,i) => getRandomInt(0,3) == 0 ? 1: 0);

                        //let oneFrameShift = oneFrame + getRandomInt(0,5);

                        // let v = 0;
                        // for(let i = 0; i < totalFrames; i++){
                        //     // if(i%oneFrameShift == 0){
                        //     //     v = v==0? 1: 0;
                        //     // }

                        //     let index = p.animationStartFrame+i;
                        //     if(index > (totalFrames-1)){
                        //         index-=totalFrames;
                        //     }

                        //     framesIndexValues[index] = v;
                        // }

                        //let animationStartFrame = p.animationStartFrame;

                        let animationStartFrame = getRandomInt(0, totalFrames-1);

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                                ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));
            }
        }), layersData.tree.renderIndex+1)

        this.man_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'man_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.man.renderIndex+1)

        this.lamp_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'lamp_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.lamp.renderIndex+1)

        this.ground_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 100, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.lamp.renderIndex+1)
    }
}