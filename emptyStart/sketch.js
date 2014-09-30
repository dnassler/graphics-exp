
window.onresize = function() {
  checkOrientation();
};
var checkOrientation = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  var dw0 = displayWidth;
  var dh0 = displayHeight;
  var dw;
  var dh;
  if ( w > h ) {
    console.log('landscape');
    // due to bug displayWidth always shows the portrait width so double check the dw0/dh0
    if ( dw0 > dh0 ) {
      dw = dw0;
      dh = dh0;
    } else {
      dw = dh0;
      dh = dw0;
    }
  } else {
    console.log('portrait');
    if ( dw0 < dh0 ) {
      dw = dw0;
      dh = dh0;
    } else {
      dw = dh0;
      dh = dw0;
    }
  }
  console.log('correctedWidth='+dw+', correctedHeight='+dh+', w='+w+', h='+h+', displayWidth='+dw0+", displayHeight="+dh0+", window.innerWidth="+window.innerWidth+", window.innerHeight="+window.innerHeight);
  return {width:dw,height:dh};
};
var isFullscreen = false;

function setup() {
	isFullscreen = (typeof window.orientation !== 'undefined') ? true: fullscreen(); // if iphone/ipad/iOS fullscreen(true) doesn't work
  var displaySize = checkOrientation();
  createCanvas(displaySize.width, displaySize.height);
}

var mousePressed = touchStarted = function() {
  console.log("touch/mouse");
  if ( !isFullscreen ) {
    isFullscreen = true;
    try {
      fullscreen(isFullscreen);
    } catch ( ex1 ) {
    	console.log('error occurred:'+ex1);
    }
  }
};

function draw() {

  // put drawing code here
  background(0);

  if ( !isFullscreen ) {
    stroke(255);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("click to view fullscreen properly",width/2,height/2);
  }

}


// function setup() {
//   createCanvas(100, 100);
//   // var pg = createGraphics(width,height);
//   // pg.clear();
//   // pg.fill(0,0,255,255);
//   // pg.rect(0,0,width,10);
//   // img.mask(pg);
//   // image( img, 0, 0 );
//   //a = Tom().play( Rndf(80, 160), 1/2 )
// }

