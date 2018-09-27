/* 

***** TODO *****
-- show/hide circles
	-- petit écart entre la courbe et les traits qu’on trace un par un, qui disparait quand on refait apparaitre les cercles.
-- save arguments of the curve (revolutionSpeed, radius, drawingLenght) with a URL !
--

*/

function Circle(x, y, radius, revolutionSpeed, parentCircle, level)
{
	const self = this;
	this.pos = createVector(x,y);
	this.radius = 	radius;
	this.drawingLength = abs(radius);
	this.lengthRadiusRatio = this.drawingLength/this.radius;
	this.childCircle = null;
	this.parentCircle = parentCircle;
	if (parentCircle !== null)
	{
		this.revolution = parentCircle.rotation;				//angle around the parent circle
		this.rotation = parentCircle.rotation + PI;
	}
	else
	{
		this.rotation = 0;					//angle on its own axis (anglePointSpeed)
		this.revolution = 0;
	}
	this.revolutionSpeed = revolutionSpeed;	//angleSpeed
	this.level = level;
	
	if (this.parentCircle !== null)
	{
		this.curveArray = [];
		this.drawing = (this.level == circleNumber-1);  //Draw only with the last circle 
		this.drawnJustOnce = false;
	}

	this.update = function(position) 			//update when window is resized *** NOT WORKING ***
	{
		this.pos = createVector(width/2, height/2);
		this.clear();
		/*
		var pos = createVector(0,0);
		if (this.level === 0)
		{
			pos.sub(this.pos);
			//console.log("old = " + oldPos);
			this.pos = createVector(width/2, height/2);
			pos.add(this.pos);
		}
		else
		{
			pos = position;
			for (i=0; i<this.curveArray.length-1; i++)
			{
				//this.curveArray[i].sub(old_);
				this.curveArray[i].add(pos);
			}
		}
		if (this.childCircle !== null)
		{
			this.childCircle.update(pos);
		}*/


	}
	this.changeDrawing = function()
	{
		self.drawing = !self.drawing;
		if (self.drawing === false)
		{
			self.curveArray.splice(0,self.curveArray.length);
		}
		else
		{
			//self.rotation = self.revolution + PI;
		}
	}
	
	this.changeRadius = function()
	{
		self.radius = Number(this.value());
		self.sliderRadius.value(self.radius);
		self.inputRadius.value(self.radius);
		if (self.parentCircle !== null)
		{
			self.drawingLength = abs(round(self.lengthRadiusRatio*self.radius));
			self.sliderDrawingLength.value(self.drawingLength);
			self.inputDrawingLength.value(self.drawingLength);
		}
		if(self.radius!==0)
		{
			self.updateSpeed();
			self.updateSliders();
		}
		self.clear();
		self.rotation = self.revolution + PI;
	}
	
	this.updateSliders = function()
	{
		if (this.childCircle !== null)
		{
			this.childCircle.sliderRadius.elt.max = abs(this.radius);
			this.childCircle.sliderRadius.elt.min = -abs(this.radius);
			this.childCircle.sliderDrawingLength.elt.max = abs(this.radius);
			this.childCircle.sliderDrawingLength.elt.min = 0;
			this.childCircle.updateSliders();
		}
	}
	
	this.changeDrawingLength = function()
	{
		self.drawingLength = Number(this.value());
		self.sliderDrawingLength.value(self.drawingLength);
		self.inputDrawingLength.value(self.drawingLength);
		self.lengthRadiusRatio = self.drawingLength/self.radius;
		console.log(self.radiusLengthRatio);
		if(self.parentCircle !== null && self.radius!==0)
		{
			self.curveArray.splice(0,self.curveArray.length);
		}
		self.rotation = self.revolution + PI;
	}
	
	this.changeSpeed = function()
	{
		self.revolutionSpeed = Number(this.value())/10000;
		self.sliderSpeed.value(self.revolutionSpeed*10000);
		self.inputSpeed.value(self.revolutionSpeed*10000);
		if(self.parentCircle !== null && self.radius!==0)
		{
			self.updateSpeed();
		}
		//self.drawing = true;
		//self.rotation = self.revolution + PI;
	}
	
	this.updateSpeed = function()
	{
		if (self.parentCircle !== null)
		{
			this.rotationSpeed = this.revolutionSpeed*(this.parentCircle.radius/this.radius+1) + this.parentCircle.rotationSpeed;
			this.totalRevolutionSpeed = this.parentCircle.rotationSpeed + this.revolutionSpeed;
		}
		if (this.childCircle !== null)
		{
			this.childCircle.updateSpeed();
		}
	}
	
	this.addCircle = function()
	{
		if (self.childCircle == null)
		{
			circleNumber++;
			self.childCircle = new Circle(self.pos.x, self.pos.y, self.radius/2, random(-0.01,0.01), self, self.level+1);
		}
		else
		{
			self.childCircle.addCircle();
		}
	}
	
	this.removeChildCircle = function()
	{
		if (self.childCircle !== null)
		{
			if (self.childCircle.childCircle == null)
			{
				self.childCircle.span.remove();
				self.childCircle = null; //remove the child of this circle.
				circleNumber--;
			}
			else
			{
				self.childCircle.removeChildCircle(); //try if we can remove the child of the child
			}
		}
	}
	
	this.hideControls = function()
	{
		self.span.hide();
		if (self.level === 0)
		{
			self.spanButtons.hide();
		}
		if (self.childCircle !== null)
		{
			self.childCircle.hideControls();
		}
	}
	
	this.showControls = function()
	{
		self.span.show();
		if (self.level === 0)
		{
			self.spanButtons.show();
		}
		if (self.childCircle !== null)
		{
			self.childCircle.showControls();
		}
	}
	
	this.changeShowCircles = function()
	{
		showCircles = this.checked();
		//console.log("showCircles = "+showCircles);
		if (showCircles)
		{
			self.resetShowCircles();
			drawnBackgroundJustOnce = false;
			self.showControls();
		}
		else
		{
			self.hideControls();
		}
	}
	
	this.resetShowCircles = function()
	{
		this.drawnJustOnce = false;
		if (this.childCircle !== null)
		{
			this.childCircle.resetShowCircles();
		}
	}
	
	if (this.level === 0) 														// **** CONTROL BOX ***//
	{
		this.generalSpan = createSpan("");									// white border
		this.generalSpan.parent(optionsZone); 
		this.generalSpan.class("circlefeatures");
			this.showCirclesCheck = createCheckbox("show Circles"); 	// **** show circles checkbox ****
			this.showCirclesCheck.parent(this.generalSpan);
			this.showCirclesCheck.checked(showCircles);
			this.showCirclesCheck.changed(this.changeShowCircles);
			this.spanButtons = createSpan(""); 								// **** add/remove circles
			this.spanButtons.parent(this.generalSpan);
			this.spanButtons.class("spanButtons");
			this.buttonRemove = createButton("−");
			this.buttonRemove.parent(this.spanButtons);
			this.buttonRemove.mousePressed(this.removeChildCircle);
			this.buttonAdd = createButton("+");
			this.buttonAdd.parent(this.spanButtons);
			this.buttonAdd.mousePressed(this.addCircle);
	}
	
	this.span = createSpan("");												// white border
	this.span.parent(optionsZone); 
	this.span.class("circlefeatures");
		this.spanTitle = createSpan("Circle " + this.level);			// ****** TITLE ******
		this.spanTitle.parent(this.span);
		this.spanTitle.class("title");
		if (this.parentCircle !== null)										// ****** draw checkbox ******
		{
			this.drawingCheck = createCheckbox("draw");
			this.drawingCheck.class("checkBox");
			this.drawingCheck.checked(this.drawing);
			this.drawingCheck.parent(this.span);
			this.drawingCheck.changed(this.changeDrawing);
		}
		this.spanRadius = createSpan("radius");							// ******  RADIUS CONTROL ******
		this.spanRadius.parent(this.span);
		this.spanRadius.class("feature");
			this.inputRadius = createInput("");
			this.inputRadius.parent(this.spanRadius);
			this.inputRadius.value(this.radius);
			this.inputRadius.class("input");
			this.inputRadius.changed(this.changeRadius);
			if (this.parentCircle !== null)
			{
				this.sliderRadius = createSlider(-this.parentCircle.radius, this.parentCircle.radius, this.radius, 1);
			}
			else
			{
				this.sliderRadius = createSlider(0, 3*bigRadius, bigRadius, 1);
			}
			this.sliderRadius.parent(this.spanRadius);
			this.sliderRadius.input(this.changeRadius);
			this.sliderRadius.changed(this.changeRadius);
			this.sliderRadius.class("slider");
			
		if (this.parentCircle !== null)
		{
			this.spanDrawingLength = createSpan("Length")			//****** LENGTH CONTROL ******
			this.spanDrawingLength.parent(this.span);
			this.spanDrawingLength.class("feature");
				this.inputDrawingLength = createInput("");
				this.inputDrawingLength.parent(this.spanDrawingLength);
				this.inputDrawingLength.value(this.drawingLength);
				this.inputDrawingLength.class("input");
				this.inputDrawingLength.changed(this.changeDrawingLength);
				this.sliderDrawingLength = createSlider(0, this.parentCircle.radius, this.radius, 1);
				this.sliderDrawingLength.parent(this.spanDrawingLength);
				this.sliderDrawingLength.input(this.changeDrawingLength);
				this.sliderDrawingLength.changed(this.changeDrawingLength);
				this.sliderDrawingLength.class("slider");

			this.spanSpeed = createSpan("speed");				// ****** SPEED CONTROL ******
			this.spanSpeed.parent(this.span);
			this.spanSpeed.class("feature");
				this.inputSpeed = createInput("");
				this.inputSpeed.parent(this.spanSpeed);
				this.inputSpeed.value(round(this.revolutionSpeed*10000));
				this.inputSpeed.class("input");
				this.inputSpeed.changed(this.changeSpeed);
				this.sliderSpeed = createSlider(-200, 200, this.revolutionSpeed*10000, 1);
				this.sliderSpeed.parent(this.spanSpeed);
				this.sliderSpeed.input(this.changeSpeed);
				this.sliderSpeed.changed(this.changeSpeed);
				this.sliderSpeed.class("slider");
		}
	
	if (this.parentCircle !== null) // *** ROTATION SPEED ***
	{
		this.updateSpeed();
	}
	else
	{
		this.rotationSpeed = 0;
	}
	if (this.level < circleNumber-1) // *** CREATE CHILD CIRCLES *** (!!!needs to happen after control box) (basically, after all the rest, create a child)
	{
		this.childCircle = new Circle(this.pos.x, this.pos.y, this.radius/2, random(-0.01,0.01), this, this.level+1);
	}
	else
	{
		this.childCircle = null;
	}
	
	this.move = function()
	{
		if (this.parentCircle != null)
		{
			this.revolution += this.totalRevolutionSpeed; 
			this.rotation += this.rotationSpeed;
			this.pos.x = this.parentCircle.pos.x + (this.parentCircle.radius+this.radius)*cos(this.revolution);
			this.pos.y = this.parentCircle.pos.y + (this.parentCircle.radius+this.radius)*sin(this.revolution);
		}
		if (this.childCircle != null)
		{
			this.childCircle.move();
		}
	}
	
	this.display = function()
	{
		var x = this.drawingLength*cos(this.rotation);
		var y = this.drawingLength*sin(this.rotation);
		if(this.drawing) 					// **** adds a new vertex to the array ****
		{
			var vect = createVector(this.pos.x+x,this.pos.y+y);
			this.curveArray.push(vect);
		}
		if (this.drawing)					// **** draws the curve
		{
			if (this.drawnJustOnce == false)
			{
				beginShape();
				for (i=0; i<this.curveArray.length-1; i++)
				{
					vertex(this.curveArray[i].x, this.curveArray[i].y);
				}
				endShape();
				if (showCircles == false)
				{
					this.drawnJustOnce = true;
				}
			}
			else
			{
				var i = this.curveArray.length-2;
				if (i>2)
				{
					line(this.curveArray[i].x, this.curveArray[i].y, this.curveArray[i-1].x, this.curveArray[i-1].y);
				}
			}
			
			//console.log(dist(vect.x,vect.y,this.curveArray[0].x,this.curveArray[0].y));
			//if(this.drawing == false || this.curveArray.length > 10 && abs(this.rotation%TWO_PI-(this.revolution+PI)%TWO_PI)<0.05 && dist(vect.x,vect.y,this.curveArray[0].x,this.curveArray[0].y) < 2.5)
			//{
			//	this.drawing = false;
			//	console.log("stop drawing!"+this.revolution);
			//}
		}
		if (showCircles == true)			// **** Draws the circle + red line ****
		{
			ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
			if (this.parentCircle != null)		
			{
				push();
				strokeWeight(4);
				stroke(255,50,50);
				line(this.pos.x +x, this.pos.y +y, this.pos.x, this.pos.y);
				pop();
			}
		}
		if( this.childCircle !== null)
		{
			this.childCircle.display();
		}
	}
	
	this.clear = function()
	{
		if (this.parentCircle != null)
		{
			this.curveArray.splice(0,self.curveArray.length);
		}
		if (this.childCircle != null)
		{
			this.childCircle.clear();
		}
	}
}