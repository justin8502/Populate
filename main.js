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
/* Var to store genotypes in population */
var genotypes = [0, 0, 0];
/* Var to store the death cutoff */
var todeath = 3;
/* Variable for scaling */
var scalefactor = 1;
/* Variable to shift left */
var absleft = 650;

/* CONSTANTS */
/* Constant to store the amount we pulsulate */
const animatebound = 20;
/* Constant to store the limit before we resize */
const scalelimit = 400;

function Person (generation, gender, genotype) {
	this.generation = generation;
	this.gender = gender;
	this.genotype = genotype;
}

var init = function() {
	/* Initialize males. Initial are mostly heterozygotes with
	 * some homozygous dominant mixed in. */
	for(var i = 0; i < ((outerbound-animatebound)/2); i++){
		if(i%3 === 0){
			maleind.push(new Person(0, 1, 2));
			genotypes[2]++;			
		} else {
			maleind.push(new Person(0, 1, 1));
			genotypes[1]++;
		}
	}
	/* Initialize females. All females are homozygous recessive */
	for(var i = 0; i < ((outerbound-animatebound)/2); i++){
		femaleind.push(new Person(0, 0, 0));
		genotypes[0]++;
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
		var endstring = $('#intervaldisplay').text().length-1;
		animationcycle = parseInt($('#intervaldisplay').text().substring(0 , endstring)) * 1000;
		//animationperiod = $('#');
		calcDeath();
		if((outerbound/scalefactor) > scalelimit){
			scalefactor = scalefactor * 5;
		}
		/* If we run out of females or males, stop making children */
		var tomate = Math.min(maleind.length, femaleind.length);
		if(Math.min(maleind.length, femaleind.length) === femaleind.length) {
			calcGenders(femaleind, maleind);
		} else {
			calcGenders(maleind, femaleind);
		}
		/* Check if we need to change the size of the circle */
		if(prevbound != (outerbound/scalefactor)){
   	 	$("#populationCirc").animate({
        	width: prevbound,
        	height: prevbound,
        	left: '-=' + parseInt(offset),
			}, animationperiod); 
   	 		prevbound = outerbound/scalefactor;
		} else {
   	 	$("#populationCirc").animate({
        	width: (outerbound/scalefactor),
        	height: (outerbound/scalefactor),
        	left: '-=' + parseInt(offset),
			}, animationperiod); 
   	 	}
   	 	var x = (outerbound/scalefactor) - animatebound;
		/* Check if we need to change the size of the circle */
        if(parseInt(tochange) != 0) {
    		$("#populationCirc").animate({
        		width: (outerbound/scalefactor) - animatebound,
        		height: (outerbound/scalefactor) - animatebound,
        		left: ((absleft - parseInt(x))/2),
				}, animationperiod);
        } else {
    		$("#populationCirc").animate({
        		width: (outerbound/scalefactor) - animatebound,
        		height: (outerbound/scalefactor) - animatebound,
        		left: '+=' + parseInt(offset),
				}, animationperiod);
        }
    /* Reset the change variable */
	tochange = 0;
	/* Fade in/Fade out the population numbers */
	$("#populationText").fadeOut(animationperiod, function () {
		/* Technical Information */
    	document.getElementById('currscaling').innerHTML = 'Current Scaling: 1:' + scalefactor;

		/* Generation Information */
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
    	var q = (Math.sqrt(genotypes[0]/(genotypes[0]+genotypes[1]+genotypes[2]))).toFixed(2);
    	document.getElementById('pfreq').innerHTML = 'p = ' + (1-q).toFixed(2);
    	document.getElementById('qfreq').innerHTML = 'q = ' + q;
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
	/* Update the genotypes array */
	genotypes[individual.genotype]++;
}

/* Function that handles the gender of the next generation.
 * Parameters: two arrays representing male and female, in ascending order
 * Return: function that calculates the gender breakdown of the next gen.
 */
var calcGenders = function (smaller, larger) {
	var newchild;
	var bound = smaller.length;
	var i = 0;
	/* I don't like dealing with decimals. */
	for(var i = 0; i < bound; i++){
		var parent1 = smaller[Math.floor(Math.random() * smaller.length)].genotype;
		var parent2 = larger[Math.floor(Math.random() * larger.length)].genotype;
		var childgenotype;
		if(parent1 === 1 && parent2 === 1){
			var tempgenotype = Math.floor(4*Math.random());
			if(tempgenotype > 1 && tempgenotype < 2){
				childgenotype = 1;
			} else if (tempgenotype < 1){
				childgenotype = 0;
			} else {
				childgenotype = 2;
			}
		} else {
			/* Heterozygotes have a 50/50 chance of passing on
			 * dominant/recessive alleles */
			if(parent1 === 1) {
				parent1 = Math.round(Math.random());
			} else if (parent2 === 1){
				parent2 = Math.round(Math.random());
			}
			childgenotype = Math.round((parent1 + parent2) / 2);
		} 
		newchild = new Person(0, Math.round(Math.random()), childgenotype);
		assignchild(newchild);
	}
	tochange = (-(maleind.length+animatebound))/(4*scalefactor);
    outerbound = (maleind.length+femaleind.length)+animatebound;
    gender[0] = (maleind.length)/(maleind.length + femaleind.length);
    gender[1] = (femaleind.length)/(maleind.length + femaleind.length);
}

/* Function that handles the death of the next generation.
 * Parameters: N/A
 * Return: function that calculates the number of individuals to kill off
 */
var calcDeath = function() {
	for(var i = 0; i < maleind.length; i++){
		if(maleind[i].generation === todeath){
			genotypes[maleind[i].genotype]--;
			maleind.splice(i ,1);
			i--;
		} else {
			maleind[i].generation++;
		}
	}
	for(var i = 0; i < femaleind.length; i++){
		if(femaleind[i].generation === 3){
			genotypes[femaleind[i].genotype]--;
			femaleind.splice(i ,1);
			i--;
		} else {
			femaleind[i].generation++;
		}
	}
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

/* Handles the validation of inputs in text boxes.
 * Parameters: N/A
 * Return: True if valids are legitimate, false otherwise
 */
function validNewGeneration() {
   	if(isNaN(document.getElementById('newn').value) || !document.getElementById('newn').value){
       	alert("Invalid inputs.");
       	return false;
    } else if (isNaN(document.getElementById('newp').value) || isNaN(document.getElementById('newq').value)) {
       	alert("Invalid inputs.");
       	return false;
    } else if ((+(document.getElementById('newp').value) + +(document.getElementById('newq').value)) != 1){
       	alert("Allele frequencies don't match up!");
       	return false;
    }
    return true;
}

function calcNewGen(n, p, q) {
	maleind.splice(0, maleind.length);
	femaleind.splice(0, femaleind.length);
}

/* Main function
 */
$(document).ready(function() {
	$('.add').click(function () {
    	document.getElementById('intervaldisplay').innerHTML = ((animationcycle/1000) + 1) + 's';
		animationcycle = animationcycle + 1000;
	});
	$('.sub').click(function () {
		if(animationcycle === 1000){
			alert("You can't do that!");
		} else {
    		document.getElementById('intervaldisplay').innerHTML = ((animationcycle/1000) - 1) + 's';
			animationcycle = animationcycle - 1000;
		}
	});
	$('.createnew').click(function(){
        if(!validNewGeneration()){
        
        } else {
        	incycle = !incycle;
       		setTimeout(function() {animateCir() }, animationcycle);
       }
    });
	document.getElementById('popgender').innerHTML = '&#9794;&#9792; = ' + 
    	((gender[0]*100).toFixed(2)) + '/' + ((gender[1]*100).toFixed(2));
    init();
	setTimeout(function() {animateCir() }, animationcycle);
    $('.togglerun').click(function(){
    	$(this).html(incycle ? 'Resume':'Pause');
        incycle = !incycle;
       	setTimeout(function() {animateCir() }, animationcycle);
    });
});