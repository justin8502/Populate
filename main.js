var incycle = true;

var outerbound = 120;

var animateCir = function() {
	if(incycle) {
    $("#populationCirc").animate({
        width: outerbound,
        height: outerbound,
        top: '+= 100',
        left: '44%',
	}, 500); 
    $("#populationCirc").animate({
        width: 100,
        height: 100,
        top: '-= 100',
        left: '45%'
	}, 500);
	$("#populationText").fadeOut(500);
	$("#populationText").fadeIn(500);
	setTimeout(function() {animateCir() }, 5000);
	}
}

function outputUpdate(num) {
    document.querySelector('#output').value = num;
    document.getElementById('populationText').innerHTML = 'n=' + num;
    //outerbound = num + 10;
}

$(document).ready(function() {
	setTimeout(function() {animateCir() }, 5000);
    $("button").click(function(){
        incycle = !incycle;
    });

});
