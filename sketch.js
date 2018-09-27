var canvas;
var canvasZone;
var optionsZone;
var bigRadius = 144;

var circleNumber = 3; //Number of circles

var bgColor;
var drawingColor;

var showCircles = true;
var drawnBackgroundJustOnce = false;

function setup()
{
	//bgColor = color(0);
	bgColor = color("#5A58EE");
	drawingColor = color(255);
	canvasZone = select("#canvasZone");
	optionsZone = select("#optionsZone");
	canvas = createCanvas(windowWidth-300,1000);
	canvas.parent(canvasZone);
	circle = new Circle(width/2, height/2, bigRadius, 0, null, 0);
}

function draw()
{
	if (showCircles == true)
	{
		background(bgColor);
	}
	else if(drawnBackgroundJustOnce == false)
	{
		background(bgColor);
		drawnBackgroundJustOnce = true;
	}
	noFill();
	stroke(drawingColor);
	ellipseMode(RADIUS);
	circle.move();
	circle.display();
}

function keyPressed()
{
	if (String.fromCharCode(keyCode) == " ")
	{
		circle.clear();
	}
}

function windowResized()
{
	canvas.size(windowWidth-300,1000);
	circle.update();
}