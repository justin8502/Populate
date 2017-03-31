/* VARIABLES */
/* Variable to control if we want to animate */
var incycle = true;
/* Bound to go out to while animating */
var outerbound = 120;
/* Holds outerbound between population changes */
var prevbound = outerbound;
/* Amount we need to shift for a clean animation */
var tochange = 0;
/* Var to store our animation period */
var animationperiod = 500;
/* Var to store our animation cycle */
var animationcycle = 3000;
/* Var to count cycles */
var currcycle = 1;
/* Var to store amount of genders */
var gender = [0.50, 0.50];
/* Var to store amount of males in our population*/
var maleind = [];
/* Var to store amount of females in population */
var femaleind = [];
/* Var to store the death cutoff */
var todeath = 3;
/* Variable for scaling */
var scalefactor = 0;

/* CONSTANTS */
/* Constant to store the amount we pulsulate */
const animatebound = 20;

function Person (generation, gender, genotype) {
	this.generation = generation;
	this.gender = gender;
	this.genotype = genotype;
}

var init = function() {
	for(var i = 0; i < ((outerbound-animatebound)/2); i++){
		maleind.push(new Person(0, 1, 2));
	}
	for(var i = 0; i < ((outerbound-animatebound)/2); i++){
		femaleind.push(new Person(0, 0, 0));
	}
}

/* Function that animates the circle once, then runs a callback
 * on itself. Handles cases where the population has changed 
 * between calls.
 * Parameters: None
 * Return: function that animates the circle once.
 */
var animateCir = function() {
	/* the .animate() function goes from left bottom. The bottom
	 * alignment is remedied by flex, but the left alignment
	 * I must handle myself. 
	 */
	var offset = 10;
	/* If we are cycling, then animate */
	if(incycle) {
		/* If we run out of females or males, stop making children */
		var tomate = Math.min(maleind.length, femaleind.length);
		if(Math.min(maleind.length, femaleind.length) === femaleind.length) {
			calcGenders2(femaleind, maleind);
		} else {
			calcGenders2(maleind, femaleind);
		}
		/* Check if we need to change the size of the circle */
		if(prevbound != outerbound){
   	 	$("#populationCirc").animate({
        	width: prevbound,
        	height: prevbound,
        	left: '-=' + parseInt(offset),
			}, animationperiod); 
   	 	prevbound = outerbound;
		} else {
   	 	$("#populationCirc").animate({
        	width: outerbound,
        	height: outerbound,
        	left: '-=' + parseInt(offset),
			}, animationperiod); 
   	 	}
		/* Check if we need to change the size of the circle */
        if(parseInt(tochange) != 0) {
    		$("#populationCirc").animate({
        		width: outerbound - animatebound,
        		height: outerbound - animatebound,
        		left: '+=' + (parseInt(offset) + parseInt(tochange)),
				}, animationperiod);
        } else {
    		$("#populationCirc").animate({
        		width: outerbound - animatebound,
        		height: outerbound - animatebound,
        		left: '+=' + parseInt(offset),
				}, animationperiod);
        }
    /* Reset the change variable */
	tochange = 0;
	/* Fade in/Fade out the population numbers */
	$("#populationText").fadeOut(animationperiod, function () {
		if(outerbound-animatebound >= 40) {
    		document.getElementById('populationText').innerHTML = 'n=' + (outerbound - animatebound);
    	} else {
    		document.getElementById('populationText').innerHTML = '';
    	}
    	document.getElementById('popnumber').innerHTML = 'n = ' + (outerbound - animatebound);
    	currcycle += 1;
    	document.getElementById('gennumber').innerHTML = 'Generation ' + currcycle + ':';
    	document.getElementById('popgender').innerHTML = '&#9794;&#9792; = ' + 
    		((gender[0]*100).toFixed(2)) + '/' + ((gender[1]*100).toFixed(2));
    	document.getElementById('newgen').innerHTML = tomate*2 + ' Children Born';
	});
	$("#populationText").fadeIn(animationperiod);
	/* Callback */
	setTimeout(function() {animateCir() }, animationcycle);
	}
}

/* Function that assigns a child to its corresponding group(s)
 * Parameters: Person object
 * Return: function that assigns a person object according to attributes
 */
var assignchild = function(individual){
	if(individual.gender === 0) {
		femaleind.push(individual);
	} else{
		maleind.push(individual);
	}
}

/* Function that handles the gender of the next generation.
 * Parameters: two arrays representing male and female, in ascending order
 * Return: function that calculates the gender breakdown of the next gen.
 */
var calcGenders2 = function (smaller, larger) {
	var newchild;
	var bound = smaller.length;
	var i = 0;
	/* I don't like dealing with decimals. */
	for(var i = 0; i < bound; i++){
		var parent1 = smaller[Math.floor(Math.random() * smaller.length).toFixed(0)].genotype;
		var parent2 = larger[Math.floor(Math.random() * larger.length).toFixed(0)].genotype;
		var childgenotype;
		if(parent1 === 1 && parent2 === 1){
			var tempgenotype = Math.floor(4*Math.random()).toFixed(0);
			if(tempgenotype > 1 && tempgenotype < 2){
				childgenotype = 1;
			} else if (tempgenotype < 1){
				childgenotype = 0;
			} else {
				childgenotype = 2;
			}
		} else {
			childgenotype = Math.round((Math.random() * parent1 + Math.random() * parent2) / 2).toFixed(0);
		} 
		newchild = new Person(0, Math.round(Math.random()), childgenotype);
		assignchild(newchild);
	}
	tochange = (-(maleind.length+animatebound))/4;
    outerbound = (maleind.length+femaleind.length)+animatebound;
    gender[0] = (maleind.length)/(maleind.length + femaleind.length);
    gender[1] = (femaleind.length)/(maleind.length + femaleind.length);
}

/* Handles change of input for the slider controlling population
 * size.
 * Parameters: num that was recorded from the slider. 
 * Return: N/A
 */
function outputUpdate(num) {
    tochange = ((outerbound-animatebound)-parseInt(num))/8;
    document.querySelector('#output').value = num;
    outerbound = parseInt(num)+animatebound;
}

/* Handles change of input for the slider controlling population
 * scale.
 * Parameters: num that was recorded from the slider. 
 * Return: N/A
 */
function outputUpdateScale(num) {
    document.querySelector('#outputScale').value = parseInt(num);
}

/* Main function
 */
$(document).ready(function() {
	document.getElementById('popgender').innerHTML = '&#9794;&#9792; = ' + 
    	((gender[0]*100).toFixed(2)) + '/' + ((gender[1]*100).toFixed(2));
    init();
	setTimeout(function() {animateCir() }, animationcycle);
    $("button").click(function(){
        incycle = !incycle;
    });

});
