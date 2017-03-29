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
var animationcycle = 5000;

/* CONSTANTS */
/* Constant to store the amount we pulsulate */
const animatebound = 20;

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
    	document.getElementById('populationText').innerHTML = 'n=' + (outerbound - animatebound);
	});
	$("#populationText").fadeIn(animationperiod);

	/* Callback */
	setTimeout(function() {animateCir() }, animationcycle);
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
    //document.getElementById('populationText').innerHTML = 'n=' + num;
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
	setTimeout(function() {animateCir() }, animationcycle);
    $("button").click(function(){
        incycle = !incycle;
    });

});
