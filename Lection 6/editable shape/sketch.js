let editButton;
let finishButton;

let editMode = false;
let currentShape = [];

let canvas;

function setup()
{
	canvas = createCanvas(800, 800);
	background(200);
	noFill();
	loadPixels();
	editButton = createButton('Edit Shape');
	finishButton = createButton('Finish Shape');

	editButton.mousePressed(() => {
		if(editMode)
		{
			editMode = false;
			editButton.html("Edit Shape");
		}
		else
		{
			editMode = true;
			editButton.html('Add Vertices');
		}
	});

	finishButton.mousePressed(() => {
		editMode = false;
		draw();
		loadPixels();
		currentShape = [];
	});
}

function draw()
{
	updatePixels();
	if (mouseIsPressed && mousePressOnCanvas(canvas))
	{
		if(!editMode)
		{
			currentShape.push({
				x: mouseX,
				y: mouseY
			});
		}
		else
		{
			for(let i = 0; i < currentShape.length; i++)
			if (dist(currentShape[i].x, currentShape[i].y, mouseX, mouseY) < 15)
			{
				currentShape[i].x = mouseX;
				currentShape[i].y = mouseY;
			}
		}
	}

	beginShape();
	for(let i = 0; i < currentShape.length; i++)
	{
		vertex(currentShape[i].x, currentShape[i].y);
		if(editMode)
		{
			fill('red');
			ellipse(currentShape[i].x, currentShape[i].y, 10, 10);
		}
	}
	endShape();

}

function mousePressOnCanvas(canvas){
	if ((mouseX > canvas.elt.offsetLeft &&
		 mouseX < canvas.elt.offsetLeft + canvas.width) &&
	    (mouseY > canvas.elt.offsetTop && 
	 	 mouseY < canvas.elt.offsetTop + canvas.height)
	   )
	   return true;
	else return false;
		
}