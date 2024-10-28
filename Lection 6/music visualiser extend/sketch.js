let noiseStep;
let progress;

let isReady;
let sample;
let fft;
let rot;

function soundInit()
{
	isReady = true;
}

function preload() {
	soundFormats('mp3', 'wav');
	isReady = false;
	
	sample = loadSound('assets/audio.mp3', soundInit);
	sample.setVolume(0.5);
	noiseStep = 0.01;
	progress = 0;
	rot = 0;
}

function setup()
{
	createCanvas(1024, 1024);
	stroke(255);
	noFill();

	textAlign(CENTER);
	textSize(32);
	fft = new p5.FFT();
}

function noiseLine(energy)
{
	push();
	translate(width/2, height/2);
	noFill();
	stroke(0, 255, 100);
	strokeWeight(4);
	beginShape();
	for(let i = 0; i < 100; i++)
	{
		let x = map(noise(i * noiseStep + progress), 0, 1, -300, 300);
		let y = map(noise(i * noiseStep + progress + 200), 0, 1, -300, 300);

		vertex(x, y);
	}
	endShape();

	if (energy > 20)
		progress += 0.05;
	pop();

	/*
	beginShape();
	for (let i = 0; i < width; i++)
	{
		let tmp = map(noise(i * noiseStep + progress), 0, 1, -100, 100);
		vertex(i, height/2 + tmp);
		progress += 0.001;
	}
	endShape();
	*/
}

function rotatingBlocks(energy)
{
	if (energy > 200)
		rot += 0.01;

	let tmp = map(energy, 0, 255, 20, 100);

	push();
	rectMode(CENTER);
	translate(width/2, height/2);
	rotate(rot);
	fill(255, 100, 0);

	let incr = width / 9;

	for(let i = 0; i < 10; i++)
		rect(i * incr - width/2, 0, tmp, tmp);

	pop();
}

function draw()
{
	fft.analyze();

	let bass = fft.getEnergy("bass");
	let treble = fft.getEnergy("treble");

	background(0);

	rotatingBlocks(bass);
	console.log(treble);
	noiseLine(treble);
}

function mousePressed(){
    sample.loop();
}