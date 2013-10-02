setInterval(function(){
  setTimeout(toggleEyes,100);
  setTimeout(toggleEyes,200);
  setTimeout(toggleEyes,300);
  setTimeout(toggleEyes,400);
}, 4000);

function toggleEyes () {
  $('.nodebot .eye').toggleClass('blink');
}