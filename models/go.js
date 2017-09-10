class GO {
    constructor(options = {}){
        
        if(!options.position || !(options.position instanceof V2))
            throw 'No position defined for grapthical object';
        
        if(!options.size || !(options.size instanceof V2))
            throw 'No size defined for grapthical object';

        var objectContext = this;

        Object.assign(this, {
            alive: true,
            id: '',
            img: undefined,
            imgPropertyName: undefined,
            context: undefined,
            contextName: 'main',
            selected: false,
            handlers: {},
            isAnimated: false,
            isCustomRender: false,
            needRecalcRenderSize: true,
            isStatic: false, // not affected by scale
            animation: { // todo test needed
                totalFrameCount: 0,
                framesInRow: 0,
                framesRowsCount: 0,
                frameChangeDelay: 0,
                destinationFrameSize: new V2,
                sourceFrameSize: new V2,
                currentDestination : new V2,
                currentFrame: 0,
                reverse: false,
                paused: false,
                loop : false,
                animationTimer : undefined,
                animationEndCallback: function(){},
                frameChange : function(){
                    if(this.paused){
                        return;
                    }
        
                    if(this.reverse){
                        this.currentFrame--;	
                    }
                    else
                    {
                        this.currentFrame++;
                    }
        
                    if((!this.reverse && this.currentFrame > this.totalFrameCount)
                        || (this.reverse && this.currentFrame < 1)
                        ){
                        if(this.loop){
                            this.currentFrame = this.reverse? this.totalFrameCount :  1;
                        }
                        else{
                            this.animationEndCallback.call(objectContext);
                            return;
                        }
                    }
                    var crow = Math.ceil(this.currentFrame/this.framesInRow);
                    var ccol = this.framesInRow - ((crow*this.framesInRow) - this.currentFrame);
                    this.currentDestination = new V2(ccol - 1, crow - 1);
                }
            }
        } ,options);

        if(this.isAnimated){
            this.size = this.animation.destinationFrameSize.clone();
            this.animation.currentFrame = 0;
            this.animation.animationTimer = {
                lastTimeWork: new Date,
                delta : 0,
                currentDelay: this.animation.frameChangeDelay,
                originDelay: this.animation.frameChangeDelay,
                doWorkInternal : this.animation.frameChange,
                context: this
            };
        }

        this.type = this.constructor.name;

        if(SCG.GO.counter[this.type] == undefined)
            SCG.GO.counter[this.type] = 0;

        SCG.GO.counter[this.type]++;

        if(this.id == undefined)
            this.id = this.type + '_' + SCG.GO.counter[this.type];	

        this.creationTime = new Date;

        this.regClick();

        if(this.img == undefined && this.imgPropertyName != undefined)
            this.img = SCG.images[this.imgPropertyName];

        if(SCG.AI && SCG.AI.worker)
            SCG.AI.sendEvent({ type: 'created', message: {goType: this.type, id: this.id, position: this.position.clone() }});

        var ctx = SCG.contexts[this.contextName];
        
        if(ctx)
            this.context = ctx;
    }

    beforeDead(){}

    setDead() {
		this.beforeDead();
		
		//remove from event handlers
		var eh = SCG.controls.mousestate.eventHandlers;
		var index = eh.click.indexOf(this);
        if(index > -1)
            eh.click.splice(index, 1);	
	
		//send to ai msg
        if(SCG.AI && SCG.AI.worker)
            SCG.AI.sendEvent({ type: 'removed', message: {goType: this.type, id: this.id }});	

		this.alive = false;
    }
    
    customRender(){ }
        
    internalPreRender(){}
        
    internalRender(){}

    render(){ 
        if(!this.alive || !this.renderPosition)
            return;

		this.internalPreRender();

		if(this.isCustomRender)
		{
			this.customRender();
		}
		else{
			if(this.img != undefined)
			{
				var rp = this.renderPosition;
				var rs = this.renderSize;
				var dsp = this.destSourcePosition;
				var s = this.size;
				var ctx = this.context;
				if(this.isAnimated)
				{
					var ani = this.animation;
					ctx.drawImage(this.img,  
						ani.currentDestination.x * ani.sourceFrameSize.x,
						ani.currentDestination.y * ani.sourceFrameSize.y,
						ani.sourceFrameSize.x,
						ani.sourceFrameSize.y,
						rp.x - rs.x/2,
						rp.y - rs.y/2,
						rs.x,
						rs.y
					);
				}
				else{
					if(dsp != undefined){ //draw part of image (sprite sheet)
						var destSourceSize = this.destSourceSize ? this.destSourceSize : this.size;
						ctx.drawImage(this.img, 
							dsp.x,
							dsp.y,
							destSourceSize.x,
							destSourceSize.y,
							(rp.x - rs.x/2), 
							(rp.y - rs.y/2), 
							rs.x, 
							rs.y);		
					}
					else { // draw simple img without any modifications
						ctx.drawImage(this.img, 
							(rp.x - rs.x/2), 
							(rp.y - rs.y/2), 
							rs.x, 
							rs.y);			
					}
					
				}
			}	
		}

		this.internalRender();
    }
    
    internalPreUpdate(){}
        
    internalUpdate(now){}

    update(now){
        if(this.img == undefined && this.imgPropertyName != undefined){ //first run workaround
			this.img = SCG.images[this.imgPropertyName];
			if(this.img == undefined){
				throw `Cant achieve image named: ${this.imgPropertyName}`;
			}
		}

		if(this.context == undefined && this.contextName != undefined){
			this.context = SCG.contexts[this.contextName];
			if(this.context == undefined){
				throw `Cant achieve context named: ${this.contextName} `;
			}
		}

        this.internalPreUpdate(now);

        if(!this.isStatic && (!this.alive || SCG.logics.isPaused || SCG.logics.gameOver || SCG.logics.wrongDeviceOrientation)){
			return false;
		}

        var scale = SCG.viewport.scale;
        if(this.needRecalcRenderSize){
            this.renderSize = this.size.mul(scale);
            let tl = new V2(this.position.x - this.size.x/2,this.position.y - this.size.y/2);
            if(this.box)
                this.box = new Box(tl, this.size); //logical positioning box
            else
                this.box.update(tl, this.size);

            this.renderPosition = undefined;
            if(SCG.viewport.logical.isIntersectsWithBox(this.box) || this.isStatic)
            {
                this.renderPosition = this.position.add(this.isStatic ? new V2 : SCG.viewport.shift.mul(-1)).mul(scale);
                this.renderBox = new Box(new V2(this.renderPosition.x - this.renderSize.x/2, this.renderPosition.y - this.renderSize.y/2), this.renderSize);
            }

            this.needRecalcRenderSize = false;
        }

		// if(this.destination)
		// {
		// 	if(this.position.distance(this.destination) <= this.speed){
		// 		this.setDestination();
		// 	}
		// 	else{
		// 		this.position.add(this.direction.mul(this.speed), true);
		// 	}	
		// }

		// if(this.destination == undefined)
		// {
		// 	if(this.path.length > 0)
		// 	{
		// 		this.setDestination(this.path.shift());
		// 	}
		// 	else if(this.setDeadOnDestinationComplete) {
		// 		this.setDead();
		// 		return false;
		// 	}
		// }

		if(this.isAnimated)
            doWorkByTimer(this.animation.animationTimer, now);
        
		this.internalUpdate(now);

		if(!this.alive)
            return false;
	}

    regClick(){
		//register click for new objects
		if(this.handlers.click && isFunction(this.handlers.click)){
			var eh = SCG.controls.mousestate.eventHandlers;
			if(eh.click.indexOf(this) == -1){
				eh.click.push(this);
			}
		}
	}
}

GO.counter = {};
GO.ids = [];