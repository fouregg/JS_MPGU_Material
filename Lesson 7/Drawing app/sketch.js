let previousMouseX;
let previousMouseY;

let canvas;
let selectArea;
/**
 * selectMode - 0 Start
 * selectMode - 1 Press select area
 * selectMode - 2 press cut(pixels copied and cleared from canvas)
 */
let selectMode;
let editMode;

let selectButton;
let clearButton;
let editButton;

let currentShape = [];

let selectedPixels;
function setup()
{
	canvas = createCanvas(800, 800);
	background(200);
	noFill();
	stroke(0);

	selectMode = 0;
	editMode = 0;
	selectArea = {x: 0, y: 0, w: 100, h: 100};
	selectButton = createButton('Select area');
	clearButton = createButton('Clear');
	editButton = createButton('Create Shape');

	selectButton.mousePressed(() =>{
		switch (selectMode)
		{
			case 0:
				selectMode += 1;
				selectButton.html('cut');

				//store current frame
				loadPixels();
				break;
			case 1:
				selectMode += 1;
				selectButton.html('endPaste');

				// refresh screen
				updatePixels();

				//store pixels in variable
				selectedPixels = get(selectArea.x, selectArea.y, selectArea.w, selectArea.h);

				//clear area what we cut
				fill(200);
				noStroke();
				rect(selectArea.x, selectArea.y, selectArea.w, selectArea.h);
				break;
			case 2:
				selectMode = 0;
				loadPixels();
				// clear data mouse pressed for currect build line
				previousMouseX = -1; previousMouseY = -1;
				selectArea = {x: 0, y: 0, w: 100, h:100};
				selectButton.html('select area');
				break;
		}
	});

	clearButton.mousePressed(() =>{
		background(200);
		previousMouseX = -1; previousMouseY = -1;
	});

	editButton.mousePressed(() => {
		switch (editMode)
		{
			case 0:
				editMode = 1;
				editButton.html("Edit Vertices");
				break;
			case 1:
				editMode = 2;
				editButton.html("Finish Shape");
				break;
			case 2:
				editMode = 0;
				editButton.html('Create Shape');
				loadPixels();
				draw();
				currentShape = [];
				break;
		}
	});
}

function draw()
{
	// logic for draw	
	if(mouseIsPressed && editMode == 0)
	{
		// if we not init this variable start init
		switch (selectMode)
		{
			case 0:
				// check build line only on canvas
				if (mousePressOnCanvas(canvas))
				{
					if(previousMouseX == -1)
					{
						previousMouseX = mouseX;
						previousMouseY = mouseY;
					}
					else
					{
						loadPixels();
						stroke(0);
						noFill();
						line(previousMouseX, previousMouseY, mouseX, mouseY);
						previousMouseX = mouseX;
						previousMouseY = mouseY;
					}
				}
				break;
			case 1:
				updatePixels();
				noStroke();
				fill(255, 0, 0, 100);
				rect(selectArea.x, selectArea.y, selectArea.w, selectArea.h);
		}
	}
	
	// logic for shape
	if (editMode > 0)
	{
		updatePixels();
		if (mouseIsPressed && mousePressOnCanvas(canvas) && editMode == 2)
		{
			loadPixels();
			for(let i = 0; i < currentShape.length; i++)
			{
				if (dist(currentShape[i].x, currentShape[i].y, mouseX, mouseY) < 15)
				{
					currentShape[i].x = mouseX;
					currentShape[i].y = mouseY;
				}
			}
		}
		beginShape();
		loadPixels();
		for(let i = 0; i < currentShape.length; i++)
		{
			vertex(currentShape[i].x, currentShape[i].y);
			if(editMode == 2)
			{
				fill('red');
				ellipse(currentShape[i].x, currentShape[i].y, 10, 10);
			}
		}
		endShape();	
	}
}

function mousePressed()
{
	switch(selectMode)
	{
		case 1:
			selectArea.x = mouseX;
			selectArea.y = mouseY;
			break;
		case 2:
			image(selectedPixels, mouseX, mouseY);
			break;
	}
}

function mouseDragged()
{
	if (selectMode == 1)
	{
		let width = mouseX - selectArea.x;
		let height = mouseY - selectArea.y;

		selectArea.w = width;
		selectArea.h = height;
	}
}

function mouseReleased()
{
	if (mousePressOnCanvas(canvas) && editMode == 1)
	{
		currentShape.push({
			x: mouseX,
			y: mouseY
		});
	}
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