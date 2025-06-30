//new Q5();

var stage = 1;
var window = {
	currentWidth: 1366,
	beforeResWidth: 0,
	beforeResHeight: 0,
	chromebookToCurrentScale: 3
}

var introVar = {
	cubeRotate: 0,
	tankY: 300,
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

//Dev resolutions, windowHeight = ~959, windowWidth= ~1800
function windowResized() {
	window.currentWidth = Math.floor(windowHeight * (16/9));
	window.beforeResWidth = window.currentWidth;
	window.beforeResHeight = windowHeight;
	//resizeCanvas(1366, 768);
	resizeCanvas(window.currentWidth, windowHeight);
	window.chromebookToCurrentScale = window.currentWidth/1792;
	//window.chromebookToCurrentScale = 768/959;
}

function setup() {
	createCanvas(windowWidth, windowHeight);
    windowResized();
	var canvas = document.querySelector("canvas");
	canvas.style.margin = 'auto';
	document.getElementById("script-holder").appendChild(canvas);
	rectMode(CENTER);
	angleMode(DEGREES);
	textStyle(BOLD);
    ellipseMode(CENTER);
    colorMode(RGB, 255, SRGB);
	noStroke();

    /*
	world.gravity.y = 10;
	cube = new Sprite(100, 100);
	cube.draw = () => {
		push();
		rect(0, 0, 75, 75, 15);
		pop();
	}
    */
}

function pulseMath() {
	pulse.var -= pulse.rate;
	if(pulse.var<125){pulse.rate = -1;}
	if(pulse.var>225){pulse.rate = 1;}
}

function debug() {
	fill(255, 0, 0);
	textSize(25);
	text(window.chromebookToCurrentScale, mouseX + 40, mouseY + 5)
	text(windowHeight, mouseX + 40, mouseY + 35)
}

function intro() {
	//clear();
    pulseMath();
	introVar.cubeRotate += 5;
	
	if (introVar.tankY > (210 * chromebookToCurrentScale)) {
		introVar.tankY -= 1;
	}
	if ((introVar.tankY < (210 * chromebookToCurrentScale)) && (introVar.tankRotate < 25)) {
		introVar.tankRotate += 1;
		introVar.turretRotate = introVar.tankRotate;
	}
	if (introVar.tankRotate == 25 && introVar.turretRotate < 90) {
		introVar.turretRotate += 1;
	}
	if (introVar.turretRotate == 90) {
		if (introVar.bulletX <= 2000) {
			introVar.bulletX += 8;
		}
		if ((introVar.bulletX >= 497)) {
			introVar.bulletTransparency = 255;
			introVar.soundTransparency = 50;
		}
	}
	if ((introVar.bulletX >= 500)) {
		introVar.textCover += 8;
	}
	if ((introVar.bulletX >= 1525) && (fade.out < 255)) {
		fade.out += 2.5;
	}
	
	background(0, 0, 0);
	push();
    translate(-400 * window.chromebookToCurrentScale, 2 * window.chromebookToCurrentScale)
	fill(255, 255, 255);
	textSize(800 * window.chromebookToCurrentScale); //I'm just using this as a general scale/ratio factor, although it only works with appropriate ratios
	text("DP", 695 * window.chromebookToCurrentScale, 650 * window.chromebookToCurrentScale);
	textSize(75);
	text("roductions", 1470 * window.chromebookToCurrentScale, 650 * window.chromebookToCurrentScale);
    pop();
	resetMatrix();

	push();
	rect(0, 0, 0, 0);
	translate(175 * window.chromebookToCurrentScale, 825 * window.chromebookToCurrentScale);
	rotate(introVar.cubeRotate);
	fill(-pulse.var, pulse.var, pulse.var + 100);
	rect(0, 0, 150 * window.chromebookToCurrentScale, 150 * window.chromebookToCurrentScale, 15 * window.chromebookToCurrentScale);
	pop();
	resetMatrix();

	push();
	textSize(100 * window.chromebookToCurrentScale);
	textAlign(CENTER, MIDDLE);
	fill(255, 255, 255);
	text("X", 175 * window.chromebookToCurrentScale, 825 * window.chromebookToCurrentScale);
	pop();
	resetMatrix();

	push();
	textSize(125 * window.chromebookToCurrentScale);
	fill(255, 255, 255);
	//text("...and more", 900 * window.chromebookToCurrentScale, 850 * window.chromebookToCurrentScale);
	text("...and more", 1000 * window.chromebookToCurrentScale, 900 * window.chromebookToCurrentScale);
	rectMode(CORNER);
	fill(0);
	//rect(1445, 670, bullet.textCover, 122);
	rect(585 * window.chromebookToCurrentScale, 785 * window.chromebookToCurrentScale, introVar.textCover * window.chromebookToCurrentScale, 122 * window.chromebookToCurrentScale);
	resetMatrix();
	pop();
	
	push();
	translate(introVar.bulletX, 775);
	fill(100, 100, 100, introVar.soundTransparency);
	triangle(-7.5, 45, 40, 17.5, -7.5, -9);
	fill(158, 60, 14, introVar.bulletTransparency);
	triangle(2, 27.5, 45, 17.5, 2, 10);
	resetMatrix();
	pop();

	rectMode(CENTER);
	push();
	scale(4);
	translate(110, introVar.tankY);
	//fill(255, 0, 0);
	rect(-12,0,5,35,5);
	rect(12,0,5,35,5);
	//fill(0, 120, 0);
	rect(0,0,20,40,5);
	rotate(introVar.turretRotate);
	//fill(0, 100, 0);
	rect(0,0,15,15,5);
	rect(0,-20,5,25,0);
	resetMatrix();
	pop();
	
	if (fade.intro > 0) {
		fill(0, 0, 0, fade.intro);
		rect(window.currentWidth/2, windowHeight/2, window.currentWidth, windowHeight);
		fade.intro -= 2.5;
	}

	fill(0, 0, 0, fade.out);
	rect(window.currentWidth/2, windowHeight/2, window.currentWidth, windowHeight);
	
	if (fade.out >= 255) {
		fade.intro = 255;
		stage = 2;
	}
}

function menu() {

}

function update() {
	clear();
	if (stage == 1) {
    	intro();
	} else if (stage == 2) {
		//menu();
	}
    debug();
}

window.addEventListener('resize', function() {
    windowResized();
});