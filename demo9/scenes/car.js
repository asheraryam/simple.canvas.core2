class CarCommissionScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        // bg
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.sky = {
                    colorTo: [282, 13, 19],
                    colorFrom: [282, 37, 3],
                    yTo: 200
                }

                
                this.colorsChange = {
                    s: easing.createProps(this.sky.yTo, this.sky.colorFrom[1], this.sky.colorTo[1], 'quad', 'in'),
                    v: easing.createProps(this.sky.yTo, this.sky.colorFrom[2], this.sky.colorTo[2], 'quad', 'in')
                }

                this.bgImg = createCanvas(this.size, (ctx, size, hlp) => {
                	for(let y = 0; y <=this.sky.yTo; y++){
                		this.colorsChange.s.time = y;
                		this.colorsChange.v.time = y;

                		let s = fast.r(easing.process(this.colorsChange.s));
                		let v = fast.r(easing.process(this.colorsChange.v));
                		hlp.setFillColor(colors.hsvToHex([this.sky.colorTo[0], s,v])).rect(0,y,size.x, 1);
                	}

                	hlp.rect(0, this.sky.yTo, size.x, size.y);
                })

				this.layer3BGen = ({ hlp,  leftX = 10, width = 50, height = 200 })=> {
					let topY = this.size.y - height;
					if(width%3 != 0){
                        width+= width%3;
                    }
					
					hlp.setFillColor('#C04000').dot(leftX-1, topY-1).dot(leftX+width, topY-1).dot(leftX+width+4, topY+2)
					hlp.setFillColor('#000020').rect(leftX, topY, width, height).rect(leftX-1, topY, 1, height)
					.rect(leftX+width, topY, 1, height)
					.setFillColor('#000040').rect(leftX+width+1, topY+1, 1, height)
					.setFillColor('#000020').rect(leftX+width+2, topY+2, 1, height)
					.setFillColor('#000040').rect(leftX+width+3, topY+3, 1, height)

					let count = fast.r(height/8);
                    let currentY = 0;
                    for(let i = 0; i< count;i++){
                        hlp.setFillColor('#002040').rect(leftX+width+1, topY+currentY + 1+1, 1,4).rect(leftX+width+1, topY+currentY + 1+6, 1,2)
                        hlp.setFillColor('#002040').rect(leftX+width+3, topY+currentY + 3+1, 1,4).rect(leftX+width+3, topY+currentY + 3+6, 1,2)

                        currentY+=8;
                    }

					count = fast.r(width/3);
					currentY = 1;
					while(currentY < height){
						//hlp.setFillColor('#000040').rect(leftX, topY+currentY+1, width, 1)
						let currentX = 0;
						for(let i = 0; i<count;i++){

							if(getRandomInt(0,2) == 0){
								hlp.setFillColor('#002040').rect(leftX+currentX, topY+currentY, 2, 2)
							}

							if(getRandomBool()){
								hlp.setFillColor('#004060').rect(leftX+currentX, topY+currentY, getRandomInt(1,2), 1)
							}

							currentX+=3;
						}
						
						currentY+=2;
					}
				}

                this.layer2BGen = ({ hlp,  leftX = 10, width = 50, height = 200 })=> {
                    let topY = this.size.y - height;
                    if(width%4 != 0){
                        width+= width%4;
                    }
                    let windowColors1 = {
                        upper: '#A06020', lower: '#604040', corner: '#C0C080'
                    }

                    let windowColors2 = {
                        upper: '#008080', lower: '#006080', corner: '#008080'
                    }

                    let c1Height = fast.r(height*0.1);

                    hlp.setFillColor('#002040').rect(leftX, topY, width, height)
                    .setFillColor('#006080').rect(leftX+width, topY,1,height)
                    .setFillColor('#002040').rect(leftX+width+1, topY,1,height)
                    .setFillColor('#000040').rect(leftX+width+2, topY+1,1,height)
                    .setFillColor('#000').rect(leftX+width+3, topY+1,1,height)
                    .setFillColor('#000020').rect(leftX+width+4, topY+2,1,height)
                    .setFillColor('#000').rect(leftX+width+5, topY+2,1,height)
                    .setFillColor('#000020').rect(leftX+width+6, topY+3,1,height)
                    .setFillColor('#000').rect(leftX+width+7, topY+3,1,height)
                    .setFillColor('#C04000').dot(leftX+1, topY-1, 1,1).dot(leftX+width-1, topY-1).dot(leftX+fast.r(width/2)-2, topY-1).dot(leftX+fast.r(width/2)+2, topY-1).dot(leftX+width+7, topY+2)

                    let count = fast.r(height/8);
                    let currentY = 0;
                    for(let i = 0; i< count;i++){
                        hlp.setFillColor('#004060').rect(leftX+width+2, topY+currentY + 2, 1,1).rect(leftX+width+2, topY+currentY + 6, 1,1)
                        .setFillColor('#002040').rect(leftX+width+2, topY+currentY + 3, 1,1).rect(leftX+width+2, topY+currentY + 5, 1,1)

                        hlp.setFillColor('#002040').rect(leftX+width+4, topY+currentY + 2, 1,1).rect(leftX+width+4, topY+currentY + 2 + 2, 1,4)

                        hlp.setFillColor('#000040').rect(leftX+width+6, topY+currentY + 3, 1,2).rect(leftX+width+6, topY+currentY + 4 + 3, 1,1)
                        currentY+=8;
                    }

                    currentY = getRandomInt(2,3)*2;
                    while(currentY < height){
                        let currentX = 1;
                        let count = width/4;
                        for(let i = 0; i < count;i++){
                            if(getRandomInt(0,4) > 0){
                                let colorGroup = currentY <= c1Height ? windowColors1 : windowColors2;
                                hlp.setFillColor(colorGroup.lower).rect(currentX + leftX, currentY + topY, 3, 2)

                                if(getRandomInt(0,6) == 0){
                                    colorGroup = windowColors1
                                }

                                hlp.setFillColor(colorGroup.upper).rect(currentX + leftX, currentY + topY, 3, 1)
                                hlp.setFillColor(colorGroup.corner).rect(currentX + leftX, currentY + topY, 1, 1)
                            }

                            currentX+=4;
                        }

                        currentY+=4;
                    }
                }
                
                this.frontalBGen = ({ hlp,  leftX = 10, width = 50, height = 100 }) => {
                    let mainWindowColors = ['#A06020', '#C0C080']
                    let secondaryWindowColors = ['#604040', '#002040']
                    let topY = this.size.y - height;
                    let secondPartTy = topY + getRandomInt(2,5)*2
                    hlp.setFillColor('#000').rect(leftX, topY, width, height)
                        .rect(leftX + fast.r(width/2), secondPartTy, fast.r(width), height);
                    
                    if(getRandomBool()) {
                        hlp.rect(leftX + 2, topY-1, width+getRandomInt(-6, 6), height)
                    }

                    let _c = getRandomInt(0,5);
                    for(let i = 0; i < _c;i++){
                        let tx = leftX + getRandomInt(4, width*1.5 - 4);
                        let ty = topY - getRandomInt(3,6);
                        
                        if(tx > leftX+width){
                            ty = secondPartTy - getRandomInt(3,6)
                        }

                        let w = getRandomInt(1,3);
                        hlp.rect(tx, ty, w, height)
                        .rect(tx+fast.r(w/2), ty+getRandomInt(2,4), getRandomInt(1,3), height );
                    }

                    let currentY = getRandomInt(1,5)*2;
                    let rowGroups = [1, 2];
                    let currentRowGroup = {index: 0, count: rowGroups[0]};

                    while(currentY < height){
                        let currentX = 2;
                        
                        for(let i = 0; i < 6;i++){
                            let colorGroup = getRandomInt(0, 4) == 0? secondaryWindowColors : mainWindowColors;
                            let color = colorGroup[getRandomInt(0, colorGroup.length-1)];
                            if(getRandomInt(0,3) != 0)
                                hlp.setFillColor(color).rect(leftX + currentX, currentY+topY, 1,1)

                            currentX+=2;
                            if(i == 2){
                                currentX++;
                            }
                        }

                        hlp.setFillColor(secondaryWindowColors[0]).rect(leftX+ width*3/2 - 4, topY + currentY + 1 + 10, 1,1)

                        currentRowGroup.count--;

                        if(currentRowGroup.count == 0){
                            currentRowGroup.index++;
                            if(currentRowGroup.index >= rowGroups.length){
                                currentRowGroup.index = 0;
                            }

                            currentRowGroup.count = rowGroups[currentRowGroup.index];
                            currentY+=4;
                        }
                        else {
                            currentY+=2;
                        }

                        
                    }
                }

                this.bGen = ({hlp, leftX = 10, width = 50, height = 150, windowSize = new V2(3, 2), windowGap = 1, fillColor = '#000000',
                              redLight = '#C04000', windowColorMain = '#006080', windowColorSecondary = '#004060', sideColorMain = '#000020', sideColorSecondary = '#000040'}
                    ) =>  {
                              

                	let topY = this.size.y - height;
					hlp.setFillColor(fillColor).rect(leftX, topY, width, height)
                	hlp.setFillColor(redLight).rect(leftX+5, topY-1, 1, 1).rect(leftX+width-5, topY-1, 1,1);
					hlp.setFillColor(sideColorMain).rect(leftX + width - 3,topY + 1, 2, height);		
                	let currentY = 4;
                	let sideSecondary = true;
                	while(currentY < height){
                		let currentX = 2;
                		while(currentX < (width-(windowSize.x + windowGap))){
                			if(getRandomInt(0,4) != 0){
                				hlp.setFillColor(windowColorMain).rect(currentX+leftX,currentY+topY, windowSize.x, 1)
                				.setFillColor(windowColorSecondary).rect(currentX+leftX,currentY+topY+1, windowSize.x, 1)

                			}

                			currentX+=windowSize.x + windowGap;
                		}

                		if(sideSecondary){
                			hlp.setFillColor(sideColorSecondary).rect(leftX + width - 3,topY + 1 + currentY, 2, 2)
                		}

                		sideSecondary = !sideSecondary;

                		currentY+=4;
                	}
                }

                this.frontalBLayerImg =  createCanvas(this.size, (ctx, size, hlp) => {
                    let buildings = [{x: 10, height: getRandomInt(100, 140), width: 20}, {x: 45, height: getRandomInt(100, 140), width: 30},
                        {x: 100, height: getRandomInt(100, 140), width: 25}, {x: 150, height: getRandomInt(120, 160), width: 30}, {x: 185, height: getRandomInt(100, 140), width: 35},
                        {x: 245, height: getRandomInt(100, 140), width: 22}, {x: 295, height: getRandomInt(130, 170), width: 25}, {x: 335, height: getRandomInt(110, 130), width: 20},
                        {x: 390, height: getRandomInt(90, 120), width: 25}, {x: 440, height: getRandomInt(100, 140), width: 30}]

                    for(let i = 0; i < buildings.length; i++){
                        let b = buildings[i];
                        this.frontalBGen({ hlp, leftX: b.x, width: b.width, height: b.height})
                    }
                });

                this.buildingLayer2Img =  createCanvas(this.size, (ctx, size, hlp) => {
                    let buildings = [{x: 30, height: getRandomInt(150, 200), width: 40},{x: 120, height: getRandomInt(150, 200), width: 50},
                    {x: 200, height: getRandomInt(150, 200), width: 50}, {x: 320, height: getRandomInt(150, 220), width: 60},{x: 420, height: getRandomInt(150, 220), width: 40}
                        ]

                    for(let i = 0; i < buildings.length; i++){
                        let b = buildings[i];
                        this.layer2BGen({ hlp, leftX: b.x, width: b.width, height: b.height})
                    }
                });

                this.buildingLayer3Img =  createCanvas(this.size, (ctx, size, hlp) => {
                    let buildings = [{x: 60, height: getRandomInt(180, 250), width: 20}, {x: 250, height: getRandomInt(180, 250), width: 20}, {x: 380, height: getRandomInt(180, 250), width: 20}
                        ]

                    for(let i = 0; i < buildings.length; i++){
                        let b = buildings[i];
                        this.layer3BGen({ hlp, leftX: b.x, width: b.width, height: b.height})
                    }
                });

                this.farBuildingLayerImg = createCanvas(this.size, (ctx, size, hlp) => {
                	let currentX = 5; 
                	
                	while(currentX < this.size.x){
                		let width = getRandomInt(4, 8)*10;
                		if(currentX+width > this.size.x) {
                            width = this.size.x - currentX - 5;
                            if(width < 10) break;
                        }

                		this.bGen({hlp,leftX: currentX, width, height: getRandomInt(13,18)*10 })
                		currentX+=(width + getRandomInt(4,8));
                	}
                	
                })

                // this.frameCount = 10;
                // this.img = this.createImage();

                //this.framesCount = 20;

                this.totalFramesCount = 360;
                this.framesCountByLayers = [this.totalFramesCount, this.totalFramesCount/2, this.totalFramesCount/4, this.totalFramesCount/8];

                this.fXChangeByLayers = this.framesCountByLayers.map(l => easing.createProps(l-1, 0, -this.size.x, 'linear', 'base')) 

                this.frames = [];
                
                for(let i = 0;i < this.totalFramesCount; i++){
                    // this.fXChange.time = i;
                    // let currentX = fast.r(easing.process(this.fXChange));

                    let currentXByLayers = this.fXChangeByLayers.map((change, i) => {
                		let result = easing.process(change);

                    	change.time++;
                    	if(change.time > change.duration){
                    		console.log(`Layer ${i} recreated`)
                    		change.time = 0;
                    		//this.fXChangeByLayers = easing.createProps(this.framesCountByLayers[i]-1, 0, -this.size.x, 'linear', 'base') 
                    	}

                    	return result;
                    })

                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        // ctx.drawImage(this.asp.img, currentX, 0);
                        // ctx.drawImage(this.asp.img, currentX+this.size.x, 0)

                        ctx.drawImage(this.bgImg, 0,0);

						ctx.drawImage(this.buildingLayer3Img, currentXByLayers[0],0);ctx.drawImage(this.buildingLayer3Img, currentXByLayers[0]+this.size.x,0);
	                    ctx.drawImage(this.farBuildingLayerImg, currentXByLayers[1],0);ctx.drawImage(this.farBuildingLayerImg, currentXByLayers[1]+this.size.x,0);
	                    ctx.drawImage(this.buildingLayer2Img, currentXByLayers[2],0);ctx.drawImage(this.buildingLayer2Img, currentXByLayers[2]+this.size.x,0);
	                    ctx.drawImage(this.frontalBLayerImg, currentXByLayers[3],0);ctx.drawImage(this.frontalBLayerImg, currentXByLayers[3]+this.size.x,0);
	                    
	                    hlp.setFillColor('#000').rect(0,220, size.x, 100);
                    })
                }

                this.currentFrame = 0;
                this.timer = this.regTimerDefault(30, () => {
                    this.img = this.frames[this.currentFrame++];
                    if(this.currentFrame == this.frames.length-1){
                        this.currentFrame = 0;
                    }
                })
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.bgImg, 0,0);

					ctx.drawImage(this.buildingLayer3Img, 0,0);
                    ctx.drawImage(this.farBuildingLayerImg, 0,0);
                    ctx.drawImage(this.buildingLayer2Img, 0,0);
                    ctx.drawImage(this.frontalBLayerImg, 0,0);
                    

                    hlp.setFillColor('#000').rect(0,220, size.x, 100);
                })
            }
        }), 1)

        // road
        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //
                
                this.asp = {
                    color: '#66645D',
                    colorSecondary: '#36393D',
                    linesFrom: 15,
                    height: 40,
                    darkFrom: 30,
                     csParts: [],
                     lines: {
                        color: '#D1D1D1',
                        solid: {    
                            y: 2,
                            height: 2
                        }
                    }
                }

                this.fencing = {
                    //height: 20,
                    lowerY: 39,
                    column: {
                        colors: {
                            light: '#2B3147',
                            dark: '#1C1F32',
                        },
                        count: 2,
                        width: 10,
                        height: 40
                    },
                    bar: {
                        height: 20,
                        y: 7,
                        colors: {
                            main: '#161F3C',
                            dark: '#0C0F22',
                            bottom: '#101733',
                            upper: '#212F5B'
                        }
                    }
                }

                //this.asp.csParts = []
                let countChange = easing.createProps(15, 4, 20, 'quad', 'in');
                let maxlChange = easing.createProps(15, 4, 50, 'quad', 'in');
                let minlChange = easing.createProps(15, 2, 25, 'quad', 'in');

                //hlp.setFillColor(this.asp.colorSecondary);
                for(let y = 0; y <= 15;y++){
                    countChange.time = y;
                    maxlChange.time = y;
                    minlChange.time = y;
                    let count = fast.r(easing.process(countChange));
                    let maxlength = fast.r(easing.process(maxlChange));
                    let minlength = fast.r(easing.process(minlChange));

                    for(let i = 0; i < count; i++){
                        let len = getRandomInt(minlength, maxlength);
                        let x = getRandomInt(0, this.size.x);
                        this.asp.csParts.push({x, y, len});
                        //hlp.rect(x, this.asp.linesFrom + i, len, 1);
                    }
                }

                this.asp.img = this.createImage();

                this.framesCount = 20;
                this.frames = [];
                this.fXChange = easing.createProps(this.framesCount-1, 0, -this.size.x, 'linear', 'base');

                for(let i = 0;i < this.framesCount; i++){
                    this.fXChange.time = i;
                    let currentX = fast.r(easing.process(this.fXChange));

                    this.frames[i] = createCanvas(this.size, (ctx) => {
                        ctx.drawImage(this.asp.img, currentX, 0);
                        ctx.drawImage(this.asp.img, currentX+this.size.x, 0)
                    })
                }

                this.currentFrame = 0;
                this.timer = this.regTimerDefault(100, () => {
                    this.img = this.frames[this.currentFrame++];
                    if(this.currentFrame == this.frames.length-1){
                        this.currentFrame = 0;
                    }
                })
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    let aspYFrom = size.y-this.asp.height;
                    hlp.setFillColor(this.asp.color).rect(0, aspYFrom, size.x, this.asp.height)
                    .setFillColor(this.asp.colorSecondary).rect(0, aspYFrom + this.asp.darkFrom, size.x, this.asp.height-+ this.asp.darkFrom);

                    hlp.setFillColor(this.asp.colorSecondary);
                    for(let i = 0; i < this.asp.csParts.length; i++){
                        let l = this.asp.csParts[i];
                        hlp.rect(l.x, aspYFrom+this.asp.linesFrom+l.y, l.len, 1);
                    }

                    hlp.setFillColor(this.asp.lines.color).rect(0, aspYFrom+ this.asp.lines.solid.y, size.x, this.asp.lines.solid.height);
                    
                    let f = this.fencing;
                    let segWidth = fast.r(size.x/f.column.count);
                    for(let i = 0; i < f.column.count;i++){
                        let x = fast.r(segWidth*i + segWidth/2);
                        let y = size.y - f.lowerY - f.column.height;

                        hlp.setFillColor(f.column.colors.light).rect(x,y,f.column.width, f.column.height)
                        .setFillColor(f.column.colors.dark).rect(x+f.column.width-3,y,3, f.column.height)
                    }

                    let barYTop = size.y - f.lowerY - f.column.height + f.bar.y;
                    hlp.setFillColor(f.bar.colors.main).rect(0, barYTop, size.x, f.bar.height)

                    hlp.setFillColor(f.bar.colors.bottom)
                    for(let i = 0; i < 40; i++){
                        hlp.rect(getRandomInt(0,size.x), getRandomInt(0, f.bar.height) + barYTop, getRandomInt(1,4), 1);
                    }

                    hlp.setFillColor(f.bar.colors.upper).rect(0, barYTop, size.x, 2)
                    .setFillColor(f.bar.colors.dark).rect(0, barYTop+8, size.x, 7)
                    .setFillColor(f.bar.colors.bottom).rect(0, barYTop+14, size.x, 1)
                    .setFillColor(f.bar.colors.bottom).rect(0, barYTop+7, size.x, 1)
                    .setFillColor(f.bar.colors.bottom).rect(0, barYTop+20, size.x, 2)
                    .setFillColor(f.bar.colors.dark).rect(0, barYTop+21, size.x, 1);

                    
                })
            }
        }), 30)

        //car
        this.car = this.addGo(new GO({
            position: new V2(200, 230),
            size: new V2(290, 100),
            init() {
                this.colors = {
                    baseFill: '#552E54',
                    darkFill: '#391E31',
                    lightFill: '#713D77',
                    veryLight: '#976691',
                    baseStroke: '#1C0F0E',
                    black: '#000',
                    faceFill: '#A9A9A9',
                    fWindowFill: '#2B2B2B',
                    lowerLine: '#2D2D2D'
                }
                this.wheelModel = () => 
                	(
                		{"general":{"originalSize":{"x":50,"y":55},"size":{"x":50,"y":55},"zoom":4,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#000000","fillColor":"#000000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":33}},{"point":{"x":49,"y":40}},{"point":{"x":49,"y":0}}]},{"order":1,"type":"lines","strokeColor":"#202020","fillColor":"#202020","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":17,"y":15}},{"point":{"x":18,"y":54}},{"point":{"x":32,"y":54}},{"point":{"x":35,"y":53}},{"point":{"x":37,"y":51}},{"point":{"x":41,"y":44}},{"point":{"x":41,"y":35}},{"point":{"x":41,"y":32}},{"point":{"x":41,"y":28}},{"point":{"x":39,"y":22}},{"point":{"x":36,"y":19}},{"point":{"x":34,"y":17}},{"point":{"x":30,"y":15}}]},{"order":2,"type":"lines","strokeColor":"#2C2C2C","fillColor":"#2C2C2C","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":14,"y":16}},{"point":{"x":11,"y":18}},{"point":{"x":9,"y":21}},{"point":{"x":7,"y":26}},{"point":{"x":6,"y":30}},{"point":{"x":6,"y":36}},{"point":{"x":7,"y":42}},{"point":{"x":9,"y":48}},{"point":{"x":11,"y":51}},{"point":{"x":14,"y":54}},{"point":{"x":22,"y":54}},{"point":{"x":26,"y":51}},{"point":{"x":28,"y":48}},{"point":{"x":30,"y":43}},{"point":{"x":30,"y":37}},{"point":{"x":30,"y":33}},{"point":{"x":30,"y":30}},{"point":{"x":29,"y":25}},{"point":{"x":28,"y":22}},{"point":{"x":26,"y":19}},{"point":{"x":24,"y":17}},{"point":{"x":21,"y":15}},{"point":{"x":16,"y":15}}]},{"order":3,"type":"lines","strokeColor":"#555555","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":19}},{"point":{"x":12,"y":17}},{"point":{"x":14,"y":16}},{"point":{"x":15,"y":15}},{"point":{"x":21,"y":15}},{"point":{"x":22,"y":16}},{"point":{"x":23,"y":16}},{"point":{"x":26,"y":19}},{"point":{"x":24,"y":17}},{"point":{"x":21,"y":16}},{"point":{"x":15,"y":16}},{"point":{"x":14,"y":17}},{"point":{"x":12,"y":18}}]},{"order":4,"type":"dots","strokeColor":"#555555","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":28,"y":22}},{"point":{"x":28,"y":23}},{"point":{"x":9,"y":21}},{"point":{"x":9,"y":22}},{"point":{"x":8,"y":23}}]},{"order":5,"type":"lines","strokeColor":"#000000","fillColor":"#000000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":26,"y":15}},{"point":{"x":32,"y":18}},{"point":{"x":37,"y":22}},{"point":{"x":40,"y":27}},{"point":{"x":42,"y":33}},{"point":{"x":41,"y":17}},{"point":{"x":34,"y":15}}]},{"order":6,"type":"lines","strokeColor":"#515151","fillColor":"#515151","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":33}},{"point":{"x":10,"y":31}},{"point":{"x":10,"y":29}},{"point":{"x":12,"y":23}},{"point":{"x":15,"y":20}},{"point":{"x":18,"y":20}},{"point":{"x":21,"y":20}},{"point":{"x":24,"y":22}},{"point":{"x":25,"y":23}},{"point":{"x":26,"y":25}},{"point":{"x":27,"y":29}},{"point":{"x":27,"y":31}},{"point":{"x":27,"y":43}},{"point":{"x":21,"y":41}},{"point":{"x":16,"y":36}},{"point":{"x":13,"y":33}}]},{"order":7,"type":"lines","strokeColor":"#D8D8D8","fillColor":"#D8D8D8","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":34}},{"point":{"x":10,"y":38}},{"point":{"x":11,"y":43}},{"point":{"x":13,"y":47}},{"point":{"x":15,"y":49}},{"point":{"x":17,"y":50}},{"point":{"x":20,"y":50}},{"point":{"x":23,"y":49}},{"point":{"x":25,"y":46}},{"point":{"x":26,"y":44}},{"point":{"x":24,"y":43}},{"point":{"x":22,"y":42}},{"point":{"x":19,"y":40}},{"point":{"x":12,"y":31}}]},{"order":8,"type":"lines","strokeColor":"#888888","fillColor":"#888888","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":33}},{"point":{"x":13,"y":29}},{"point":{"x":14,"y":26}},{"point":{"x":16,"y":24}},{"point":{"x":18,"y":23}},{"point":{"x":22,"y":24}},{"point":{"x":24,"y":26}},{"point":{"x":25,"y":29}},{"point":{"x":25,"y":32}},{"point":{"x":25,"y":35}},{"point":{"x":25,"y":38}},{"point":{"x":25,"y":42}},{"point":{"x":24,"y":45}},{"point":{"x":22,"y":47}},{"point":{"x":19,"y":48}},{"point":{"x":17,"y":47}},{"point":{"x":15,"y":45}},{"point":{"x":14,"y":42}},{"point":{"x":13,"y":39}},{"point":{"x":13,"y":36}}]}]}}
                		)

				this.backWheelModel = 
				{"general":{"originalSize":{"x":40,"y":45},"size":{"x":40,"y":45},"zoom":2,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#000","fillColor":"#000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":17}},{"point":{"x":0,"y":22}},{"point":{"x":1,"y":31}},{"point":{"x":1,"y":34}},{"point":{"x":3,"y":37}},{"point":{"x":5,"y":39}},{"point":{"x":6,"y":40}},{"point":{"x":8,"y":42}},{"point":{"x":13,"y":44}},{"point":{"x":26,"y":44}},{"point":{"x":30,"y":43}},{"point":{"x":33,"y":40}},{"point":{"x":35,"y":38}},{"point":{"x":36,"y":37}},{"point":{"x":38,"y":33}},{"point":{"x":38,"y":31}},{"point":{"x":39,"y":28}},{"point":{"x":39,"y":17}},{"point":{"x":39,"y":4}},{"point":{"x":0,"y":4}}]}]}}

                this.bodyModel = {"general":{"originalSize":this.size,"size":this.size,"zoom":10,"showGrid":false},
                "main": {
                    "layers":[
                        {"order":0,"type":"lines","strokeColor":this.colors.baseStroke,"fillColor":this.colors.baseFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(2,42), new V2(4,36), new V2(8,34), new V2(18,30), new V2(39, 27), new V2(76,29), new V2(102, 32), new V2(136, 32), new V2(206, 30),
                            //face 
                            new V2(264,32),new V2(272, 34),new V2(278, 36),new V2(283, 39),new V2(287, 44),new V2(288, 59),new V2(284,66),new V2(284, 71),new V2(278,77),
                            //bottom
                            new V2(197,77), new V2(149, 80), new V2(59, 80), new V2(22,73),new V2(13,70), new V2(8, 67), new V2(4,64), new V2(2, 60)
                        ].map(point => ({point}))
                        },
                        {"order":1,"type":"lines","strokeColor":this.colors.darkFill,"fillColor":this.colors.darkFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(4,36), new V2(7,42), new V2(51,43),new V2(78,48), 
                            //face 
                            new V2(287, 44),new V2(288, 59),new V2(284,66),new V2(284, 71),new V2(278,77),
                            //bottom
                            new V2(197,77), new V2(149, 80), new V2(59, 80), new V2(22,73),new V2(13,70), new V2(8, 67), new V2(4,64), new V2(2, 60)
                        ].map(point => ({point}))
                        },
                        {"order":2,"type":"lines","strokeColor":this.colors.black,"fillColor":this.colors.black,"closePath":true,"fill":true,"visible":true,"clear":true,"points":[
                            new V2(22,73), new V2(26,56), new V2(36,48),new V2(45,48), new V2(50,54), new V2(59,80)
                            
                        ].map(point => ({point}))
                        },
                        {"order":300,"type":"lines","strokeColor":this.colors.black,"fillColor":this.colors.black,"closePath":true,"fill":true,"visible":true,"clear":true,"points":[
                            new V2(149,82), new V2(150,65), new V2(155,54),new V2(165,48), new V2(173,49), new V2(182,54), new V2(190, 70), new V2(197, 77), new V2(197, 82)
                            
                        ].map(point => ({point}))
                        },
                        {"order":4,"type":"lines","strokeColor":this.colors.faceFill,"fillColor":this.colors.faceFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(202,45), new V2(212,44), new V2(287,44),new V2(288,59), new V2(284,66), new V2(279,67), new V2(212,67), new V2(206,64), new V2(202,57)
                            
                        ].map(point => ({point}))
                        },
                        {"order":5,"type":"lines","strokeColor":this.colors.lightFill,"fillColor":this.colors.lightFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(18,30), new V2(39, 27), new V2(76,29), new V2(102, 32), new V2(136, 32), new V2(206, 30),
                            new V2(264,32),new V2(272, 34),new V2(278, 36),new V2(283, 39),new V2(287, 44), new V2(212, 44), new V2(202,45)
                            
                        ].map(point => ({point}))
                        },
                        {"order":6,"type":"lines","strokeColor":this.colors.fWindowFill,"fillColor":this.colors.fWindowFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(125,8), new V2(148,6), new V2(157,6), new V2(183,8), new V2(206,30), new V2(136,32),
                            
                        ].map(point => ({point}))
                        },
                        {"order":6,"type":"lines","strokeColor":'#1A0A0C',"fillColor":this.colors.lowerLine,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(59,80), new V2(59,77), new V2(149,77), new V2(149,80)
                            
                        ].map(point => ({point}))
                        },
                        
                        {"order":8,"type":"lines","strokeColor":this.colors.black,"fillColor":this.colors.black,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(59,81), new V2(149,81), new V2(197,78), new V2(272,78), new V2(272,80), new V2(201,80), new V2(199,82), new V2(149,82), new V2(94,84),
                            new V2(88,87), new V2(84,87), new V2(78,84), new V2(65,84)
                            
                        ].map(point => ({point}))
                        },
                        {"order":9,"type":"lines","strokeColor":this.colors.veryLight,"fillColor":this.colors.veryLight,"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(156,32), new V2(173,33), new V2(187,35), new V2(192,37), new V2(222,38), new V2(231,39), new V2(233,43), new V2(211,43), new V2(284,43),new V2(286,44),new V2(210,44)
                            
                        ].map(point => ({point})) // frontal light line
                        },
                        {"order":8,"type":"lines","strokeColor":'#262827',"fillColor":'#262827',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(212,44), new V2(284,44), new V2(284,58), new V2(215,58), new V2(212,56) 
                        ].map(point => ({point}))
                        },
                        {"order":9,"type":"lines","strokeColor":'#6A3470',"fillColor":'#6A3470',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(136,32), new V2(124,10), new V2(125,8), new V2(141,32)
                        ].map(point => ({point}))
                        },
                        {"order":11,"type":"lines","strokeColor":'#201112',"fillColor":this.colors.lowerLine,"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(284,67), new V2(284,71), new V2(278,77), new V2(197,77), new V2(207,72), new V2(282,72)
                            
                        ].map(point => ({point}))
                        },
                        {"order":11,"type":"lines","strokeColor":'#414242',"fillColor":'#000',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(241,62), new V2(261,62), new V2(261,74),new V2(241,74)
                        ].map(point => ({point}))
                        },

                        //white strokes
                        {"order":90,"type":"lines","strokeColor":'#FFF',"fillColor":'#6A3470',"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(154,32), new V2(142,33), new V2(125,8),new V2(148,6),new V2(157,6),new V2(183,8)
                        ].map(point => ({point}))
                        },
                        
                        // dark strokes
                        {"order":698,"type":"lines","strokeColor":this.colors.baseStroke,"fillColor":'#6A3470',"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(183,8), new V2(206,30), new V2(264,32),new V2(272, 34),new V2(278, 36),new V2(283, 39),new V2(287, 44)
                        ].map(point => ({point}))
                        },
                        {"order":699,"type":"lines","strokeColor":'#201112',"fillColor":this.colors.lowerLine,"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(82,30), new V2(76,43), new V2(76,54), new V2(80,67), new V2(87,77), new V2(144,77), new V2(139,63), new V2(139,37), new V2(143,33)
                            
                        ].map(point => ({point}))
                        },
                        
                    ]}}

                this.img = this.createImage();
                //this.img = SCG.images['c'];
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor(this.colors.base);//.rect(0,0,size.x, size.y)
                    ctx.drawImage(PP.createImage(this.backWheelModel), 233, 50);
                    ctx.drawImage(PP.createImage(this.backWheelModel), 105, 50);

                     hlp.setFillColor('#000').rect(40, size.y-6, size.x-70, 1)
                    ctx.drawImage(PP.createImage(this.wheelModel()), 20, 40);
                    let fW = this.wheelModel();
                    fW.main.layers[0].points[1].point.y = 42
                    fW.main.layers[0].points[2].point.y = 42
                    ctx.drawImage(PP.createImage(fW), 148, 40);
                    
                    ctx.drawImage(PP.createImage(this.bodyModel), 0,0)

                    hlp.setFillColor('#000').rect(15, size.y-5, size.x-30, 1)
                })
            }
        }), 50)
    }
}