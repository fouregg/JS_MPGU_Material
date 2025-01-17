let music;

let output = []; // mass wave. Wave = {x, y}
let startX; // position X for start line
let startY; // position Y for start draw group lines
let endY; // position Y for end draw group lines
let spectrumWidth; // width lines
let speed = 1; // speed for movement line on Y
let fft; // libary for visualisation music

function preload(){
    music = loadSound('assets/parsRadio_loop.mp3');
}


function setup(){
   createCanvas(800, 800);
    startX = width / 5;
    endY = height / 5;
    startY = height - endY;
    spectrumWidth = (width / 5) * 3;
    fft = new p5.FFT();
}


function draw(){
    background(0);
    stroke(255);
    strokeWeight(2);
    // change 45 on smallest for more common line, and biggest for little common line
    if(frameCount % 45 == 0) 
        addWave();
    
    // iteration all lines
    for (let i = 0; i < output.length; i++)
    {
        // take one line
        let tmp = output[i];
        noFill();
        // start draw by vertex
        beginShape();
        for(let j = 0; j < tmp.length; j++)
        {
            // add speed for all vertex on y
            tmp[j].y -= speed;
            vertex(tmp[j].x, tmp[j].y);
        }
        endShape();
        // delete 1 wave if wave go away from screen
        if(tmp[0].y < endY)
            output.splice(i, 1);
    }
}


function addWave(){
    let tmp = fft.waveform();
    let small_scale = 3, bigScale = 40;
    let wape_output = [];
    let x, y;
    // iteration all bins(1024)
    for(let i = 0; i < tmp.length; i++)
    {
        if (i % 20 == 0) // take every 20 bin
        {
            x = map(i, 0, 1024, startX, startX + spectrumWidth);
            if(i < 1024 * 1/4 || i > 1024 * 3/4) // don't wanna chage a lot begins and end line 
                y = map(tmp[i], -1, 1, -small_scale, small_scale); // use smallest change
            else
                y = map(tmp[i], -1, 1, -bigScale, bigScale); // user biggest change
            wape_output.push({x: x, y: startY + y}); // add line for output
        }
    }
    output.push(wape_output);
}


function mousePressed(){
    music.loop();
}