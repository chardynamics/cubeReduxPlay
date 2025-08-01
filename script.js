//new Q5();

var stage = 2;
var window = {
	currentWidth: 1366,
	beforeResWidth: 0,
	beforeResHeight: 0,
	chromebookToCurrentScale: 3
}

var introVar = {
	cubeRotate: 0,
	tankY: 800,
	tankRotate: 0,
	turretRotate: 0,
	bulletX: 454,
	textCover: 0,
	bulletTransparency: 0,
	soundTransparency: 0,
}
var pulse = {
	var: 200,
	rate: 5,
}

var fade = {
	intro: 255,
	out: 0
}

var cube;

var commsHeight;
var commsWidth;
var center = {
    x: 0,
    y: 0
};
var scaleResolution;
var translateCenter = {
    x: 0,
    y: 0
};

//Dev resolutions, windowHeight = ~959, windowWidth= ~1800
function windowResized() {
	//Keep a consistent aspect ratio of 16:9, aWindowWidth is the actual width of the canvas
	aWindowWidth = Math.floor(windowHeight * (16/9));

	//Center constants
	center.x = aWindowWidth/2;
	center.y = windowHeight/2;

	//Half of the difference of the Chromebook res to native, in order to port over Chromebook-screen designed code
	translateCenter.x = Math.abs((aWindowWidth - 1366))/4;
	translateCenter.y = Math.abs((windowHeight - 768))/4;
	scaleResolution = windowHeight/853;

	//"Communications" text coords
	commsHeight = center.y + ((center.y)/2);
	commsWidth = center.x;

	resizeCanvas(aWindowWidth, windowHeight);
}

/*
f = false background
j = jump pad
l = lava
1 = first teleport
2 = second teleport
w = done
*/
var levels = [
    [
    "-                    -",
    "-                    -",
    "-                    -",
    "-           1     w  -",
    "--  2       -        -",
    "-   -                -",
    "-                    -",
    "-                    -",
    "-                    -",
    "-    w     w     w  j-",
    "- --eeeeeeeeeeeeeee---",
    "- --------------------",
    "-                    -",
    "-                    -",
    "-j                   -",
    "---lwwwlwwwlwwwlwww- -",
    "-------------------- -",
    "-                    -",
    "-p                  j-",
    "----------------------"],
    [
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "----------------------"],
];
function setup() {
	createCanvas(windowWidth, windowHeight);
	var canvas = document.querySelector("canvas");
	canvas.style.margin = 'auto';
	document.getElementById("script-holder").appendChild(canvas);
    windowResized();
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	angleMode(DEGREES);
	textStyle(BOLD);
    ellipseMode(CENTER);
    colorMode(RGB, 255, SRGB);
	noStroke();

    world.gravity.y = 25;
    allSprites.autoDraw = false;
    allSprites.autoUpdate = false;
    world.autoStep = false;
    spriteInit();
}

var floorTiles, waterTiles, enemiesTiles, lavaTiles, teleport1Tiles, teleport2Tiles, trampolineTiles, startTiles, winTiles;
var gorundSensor;
function spriteInit() {
    floorTiles = new Group();
    floorTiles.color = 'black';
	floorTiles.w = 50;
	floorTiles.h = 50;
    floorTiles.drag = 0;
	floorTiles.tile = '-';
    floorTiles.collider = "static";

    waterTiles = new Group();
    waterTiles.color = color(0, pulse.var, 255, 180);
	waterTiles.w = 50;
	waterTiles.h = 50;
    waterTiles.drag = 1;
	waterTiles.tile = 'w';
    waterTiles.collider = "static";

    enemiesTiles = new Group();
	enemiesTiles.w = 50;
	enemiesTiles.h = 50;
    enemiesTiles.drag = 1;
	enemiesTiles.tile = 'e';
    enemiesTiles.collider = "static";
    enemiesTiles.color = color(0, 0, 0, 0);

    lavaTiles = new Group();
	lavaTiles.w = 50;
	lavaTiles.h = 50;
    lavaTiles.drag = 1;
	lavaTiles.tile = 'l';
    lavaTiles.collider = "static";
    lavaTiles.color = 'orange';

    teleport1Tiles = new Group();
	teleport1Tiles.w = 50;
	teleport1Tiles.h = 50;
    teleport1Tiles.drag = 1;
	teleport1Tiles.tile = '1';
    teleport1Tiles.collider = "static";
    teleport1Tiles.color = 'yellow';

    teleport2Tiles = new Group();
	teleport2Tiles.w = 50;
	teleport2Tiles.h = 50;
    teleport2Tiles.drag = 1;
	teleport2Tiles.tile = '2';
    teleport2Tiles.collider = "static";
    teleport2Tiles.color = 'yellow';

    trampolineTiles = new Group();
	trampolineTiles.w = 50;
	trampolineTiles.h = 50;
    trampolineTiles.layer = 1;
    trampolineTiles.drag = 1;
	trampolineTiles.tile = 'j';
    trampolineTiles.collider = "static";
    trampolineTiles.color = 'yellow';

    startTiles = new Group();
	startTiles.w = 50;
	startTiles.h = 50;
    startTiles.drag = 1;
	startTiles.tile = 'p';
    startTiles.collider = "static";
    startTiles.color = color(0, 0, 0, 0);

    winTiles = new Group();
	winTiles.w = 50;
	winTiles.h = 50;
    winTiles.drag = 2;
	winTiles.tile = 'f';

    cube = new Sprite(center.x - (levels[0][0].length * floorTiles.w)/2 + 50, center.y + (levels[0][levels[0].length-1].length * floorTiles.h)/2 - 200);
    cube.w = 45;
    cube.h = 45;
    cube.layer = 100;
    cube.rotationLock = true;
    cube.friction = 0.05;
    cube.drag = 1;
	cube.draw = () => {
		rect(0, 0, cube.w, cube.h, 15);
	}

    cube.overlaps(waterTiles);
    cube.overlaps(trampolineTiles);
    cube.overlaps(startTiles);

    //Jump collision detector implemented from
    //https://openprocessing.org/sketch/1869796
    groundSensor = new Sprite(cube.x, cube.y + 22.5, 40, 45, 'n');
	groundSensor.visible = false;
	//groundSensor.mass = 0.01;

    let j = new GlueJoint(cube, groundSensor);
	j.visible = false;

    tutorialGroup = new Tiles(
        levels[0],
        center.x - (levels[0][0].length * floorTiles.w)/2, center.y - (levels[0][levels[0].length-1].length * floorTiles.h)/2,
        floorTiles.w, floorTiles.h,
    );
}

function pulseMath() {
	pulse.var -= pulse.rate;
	if(pulse.var<125){pulse.rate = -1;}
	if(pulse.var>225){pulse.rate = 1;}
}

function intro() {
	introVar.cubeRotate += 5;
	if (introVar.tankY > 682.5) {
		introVar.tankY -= 1.25;
	}
	if ((introVar.tankY == 682.5) && (introVar.tankRotate < 25)) {
		introVar.tankRotate += 1;
		introVar.turretRotate = introVar.tankRotate;
	}
	if (introVar.tankRotate == 25 && introVar.turretRotate < 90) {
		introVar.turretRotate += 1;
	}
	if (introVar.turretRotate == 90) {
		if (introVar.bulletX <= 1525) {
			introVar.bulletX += 8;
		}
		if ((introVar.bulletX >= 497)) {
			introVar.bulletTransparency = 255;
			introVar.soundTransparency = 50;
		}
	}
	if ((introVar.bulletX >= 536)) {
		introVar.textCover += 8;
	}
	if ((introVar.bulletX >= 1525) && (fade.out < 255)) {
		fade.out += 2.5;
	}
	
	background(0);
	push();
	translate(translateCenter.x, translateCenter.y);
	scale(scaleResolution);
	//Logo texts
	fill(255, 255, 255);
	textSize(725);
	text("DP", 625, 347.5);
	textSize(75);
	text("roductions", 1010, 550.5);
	//Cube
	push();
	translate(150, 675);
	rotate(introVar.cubeRotate);
	fill(-pulse.var, pulse.var, pulse.var + 100);
	rect(0, 0, 125, 125, 15);
	pop();
	textSize(75);
	text("X", 150, 680);

	//Tank & turret
	push();
	translate(400, introVar.tankY);
	fill(50, 0, 0);
	push();
	scale(3);
	rect(-12,0,5,35,5);
	rect(12,0,5,35,5);
	fill(0, 120, 0);
	rect(0,0,20,40,5);
	pop();
	pop();
	push();
	translate(400, introVar.tankY);
	rotate(introVar.turretRotate);
	fill(0, 100, 0);
	push();
	scale(3);
	rect(0,0,15,15,5);
	rect(0,-20,5,25,0);
	pop();
	pop();
	//...and more text & bullet
	textSize(125);
	text("...and more", 900, 700);
	rectMode(CORNER);
	fill(0);
	rect(570, 625, introVar.textCover, 122);
	push();
	translate(introVar.bulletX, 662.5);
	fill(100, 100, 100, introVar.soundTransparency);
	triangle(-7.5, 45, 40, 17.5, -7.5, -9);
	fill(158, 60, 14, introVar.bulletTransparency);
	triangle(2, 27.5, 45, 17.5, 2, 10);
	pop();
	rectMode(CENTER);
	pop();
	
	fadeOut();

	fill(0, 0, 0, fade.out);
	rect(center.x, center.y, aWindowWidth, windowHeight);
	
	if (fade.out >= 255) {
		fade.intro = 255;
		stage = 2;
	}
}

function fadeOut() {
	// Fade in the screen, or moreso fade out of the previous screen
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(center.x, center.y, aWindowWidth, windowHeight);
		fade.intro -= 2.5;
	}
}

function menu() {
    background(255);
    if (groundSensor.overlapping(floorTiles) || groundSensor.overlapping(waterTiles) || groundSensor.overlapping(trampolineTiles) || groundSensor.overlapping(enemiesTiles) || groundSensor.overlapping(teleport1Tiles) || groundSensor.overlapping(teleport2Tiles) || groundSensor.overlapping(startTiles)) {
        if (kb.pressing("w")) { 
            cube.vel.y = -20;
            /*
            cube.bearing = -90;
            cube.applyForce(1000);
            */
        }
    }

    if (cube.collides(lavaTiles)) {
        cube.x = center.x - (levels[0][0].length * floorTiles.w)/2 + 50;
        cube.y = center.y + (levels[0][levels[0].length-1].length * floorTiles.h)/2 - 200;
    }
    if (kb.pressing("a")) {
        cube.vel.x = -10;
        /*
        cube.bearing = 180;
		cube.applyForce(132.5);
        */
    }
    if (kb.pressing("d")) {
        cube.vel.x = 10;
        /*
        cube.bearing = 0;
		cube.applyForce(132.5);
        */
    }

    if (groundSensor.overlapping(waterTiles)) {
        cube.drag = 40;
    } else {
        cube.drag = 0.01;
    }

    if (cube.overlapping(trampolineTiles)) {
        cube.vel.y = -25;
    }
    allSprites.update();
    allSprites.draw();
    world.step();
}

function tutorial() {
    background(255);
    allSprites.update();
    allSprites.draw();
    world.step();
}

function debug() {
	fill(255, 0, 0);
	textSize(25);
	text(getFPS(), mouseX + 40, mouseY + 5)
	text(translateCenter.y, mouseX + 40, mouseY + 35)
}

function update() {
    pulseMath();
	//clear();
	if (stage == 1) {
    	intro();
	} else if (stage == 2) {
		menu();
	}
    debug();
}

function drawFrame() {
	camera.x = cube.x;
	camera.y = cube.y;
}

window.addEventListener('resize', function() {
    windowResized();
});