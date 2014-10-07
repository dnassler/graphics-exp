
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
  //isFullscreen = (typeof window.orientation !== 'undefined') ? true: fullscreen(); // if iphone/ipad/iOS fullscreen(true) doesn't work
	isFullscreen = (window.orientation !== undefined) ? true: fullscreen(); // if iphone/ipad/iOS fullscreen(true) doesn't work
  var displaySize = checkOrientation();
  createCanvas(displaySize.width, displaySize.height);

  angleMode(RADIANS);

  ImgMgr.instance = new ImgMgr();

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
    return;
  }

  // if ( ImgMgr.instance.drawMode == 'triangle' ) {
  //   ImgMgr.instance.drawMode = 'lines';
  // } else {
  //   ImgMgr.instance.drawMode = 'triangle';
  // }
};

function draw() {

  // put drawing code here
  background(0);

  if ( !isFullscreen ) {
    stroke(0);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("click to view fullscreen properly",window.innerWidth/2,window.innerHeight/2);
  }

  ImgMgr.instance.update();
  ImgMgr.instance.draw();

}

function ImgMgr() {

  this.drawMode = 'triangle';

  var iBufSize;
  if ( width > height ) {
    iBufSize = width/8;
  } else {
    iBufSize = height/8;
  }
  iBufSize = floor( iBufSize );

  var gridSize = iBufSize;
  var nCols = floor(width/gridSize);
  var nRows = floor(height/gridSize);
  var xoff = floor((width - nCols*gridSize)/2);
  var yoff = floor((height - nRows*gridSize)/2);
  var numImgInGrid = nCols * nRows;
  var frameDelay = 5;
  var nFrames = numImgInGrid * frameDelay;
  
  var iBufArr = [];
  
  for ( i=0; i<nFrames; i++ ) {
    iBufArr.push( createImage(gridSize,gridSize) );
  }

  var getGridSize = function() {
    return gridSize;
  };

  var colRowToXY = function( col, row ) {
    var x = xoff + col*gridSize;
    var y = yoff + row*gridSize;
    return {x:x,y:y};
  };

  var drawIntoBuf = function(srcImg) {
    var imgFrame = iBufArr.shift();
    imgFrame.copy( srcImg, 0, 0, srcImg.width, srcImg.height, 0, 0, imgFrame.width, imgFrame.height );
    iBufArr.push( imgFrame );
  };

  var drawFrameAtIndexToGrid = function( i, col, row ) {
    var xy = colRowToXY(col,row);
    var imgFrame = iBufArr[i];
    image( imgFrame, xy.x, xy.y );
  };

  this.drawFramesToGrid = function() {
    var col = 0;
    var row = 0;
    var maxCol = 0;
    var maxRow = 0;
    var counter = 0;
    for (var i=0; i<nCols; i++) {
      for (var j=0; j<nRows; j++) {
        var frameIndex = nFrames-1 - counter * frameDelay;
        drawFrameAtIndexToGrid(frameIndex,col,row);
        counter += 1;
        col -= 1;
        row += 1;
        if ( row >= nRows || col < 0 ) {
          maxCol += 1;
          if ( maxCol >= nCols ) {
            maxCol = nCols-1;
            maxRow += 1;
          }
          row = maxRow;
          col = maxCol;
        }
      }
    }
  };

  var sourceImage1 = new SourceImage(gridSize);
  this.createNextFrame = function() {
    sourceImage1.update();
    drawIntoBuf( sourceImage1.getImage() );
  }

};
ImgMgr.prototype.update = function(srcImg) {
  this.createNextFrame();
};
ImgMgr.prototype.draw = function() {
  this.drawFramesToGrid();
};

// ===

function SourceImage(sizeIn) {

  var size = sizeIn;
  var g = createGraphics(size,size);
  this.getImage = function() {
    return g;
  }

  var rotate = function(angle,x,y) {
    return {x:x*cos(angle)-y*sin(angle),y:x*sin(angle)+y*cos(angle)};
  };

  var fromColor = color(random(255),random(255),random(255), 255);
  var toColor = color(random(255),random(255),random(255), 255);

  var shapeColor;
  var currentColorValueOnScale = 0;

  var shapeSize = random(10,size*0.5);
  var nextShapeSize = random(10,size*0.5);

  var angle = PI;
  var fromAngle = angle;
  var nextAngle = random(-TWO_PI,TWO_PI);
  var nextTriangleAttrStart = millis();
  var nextTriangleAttrDur = 5000;

  var fromX = random(size);
  var fromY = random(size);
  var toX = random(size);
  var toY = random(size);
  var x = fromX;
  var y = fromY;

  var minX = -size/2;
  var maxX = size*1.5;
  var minY = -size/2;
  var maxY = size*1.5;

  var changeTriangleAttrs = function() {

    fromX = toX;
    fromY = toY;
    toX = random(minX,maxX);
    toY = random(minY,maxY);

    fromColor = toColor;
    toColor = color(random(255),random(255),random(255),100);
    currentColorValueOnScale = 0;

    nextShapeSize = random(size/5,size*3);
    nextAngle = random(-PI,PI);

  };

  this.update = function() {
    
    shapeSize += (nextShapeSize-shapeSize)/240;

    if ( millis() <= nextTriangleAttrStart + nextTriangleAttrDur ){
      angle = Math.easeInCubic( millis()-nextTriangleAttrStart, fromAngle, nextAngle, nextTriangleAttrDur );
      x = Math.easeInOutCubic( millis()-nextTriangleAttrStart, fromX, toX-fromX, nextTriangleAttrDur);
      y = Math.easeInOutCubic( millis()-nextTriangleAttrStart, fromY, toY-fromY, nextTriangleAttrDur);
    }

    currentColorValueOnScale += (1 - currentColorValueOnScale)/60;
    shapeColor = lerpColor(fromColor,toColor,currentColorValueOnScale);
    
    if ( millis() > nextTriangleAttrStart + nextTriangleAttrDur ) {
      changeTriangleAttrs();

      nextTriangleAttrStart = millis();
      fromAngle = angle;
    }

    drawGraphics();
  };

  var drawGraphics = function() {
    g.background(0);
    //g.clear();
    g.rectMode(CENTER);
    g.ellipseMode(CENTER);
    g.fill(shapeColor);
    g.noStroke();
    //g.rect(x,y,shapeSize,shapeSize);
    //g.ellipse(x,y,shapeSize,shapeSize);
    var sx0 = 0;
    var sy0 = -shapeSize/2;
    var sx1 = shapeSize/2;
    var sy1 = shapeSize/2;
    var sx2 = -shapeSize/2;
    var sy2 = shapeSize/2;

    var r = rotate(angle,sx0,sy0);
    var px0 = r.x + x;
    var py0 = r.y + y;
    r = rotate(angle,sx1,sy1);
    var px1 = r.x + x;
    var py1 = r.y + y;
    r = rotate(angle,sx2,sy2);
    var px2 = r.x + x;
    var py2 = r.y + y;

    if ( !ImgMgr.instance.drawMode || ImgMgr.instance.drawMode == 'triangle' ) {
      g.triangle(px0,py0, px1,py1, px2,py2);
    } else {
      g.rect(px0,0,shapeSize,g.height*2);
      g.rect(px1,0,shapeSize,g.height*2);
      g.rect(px2,0,shapeSize,g.height*2);
    }

  };

}


Math.easeInOutCubic = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t + b;
  t -= 2;
  return c/2*(t*t*t + 2) + b;
};
Math.easeInCubic = function (t, b, c, d) {
  t /= d;
  return c*t*t*t + b;
};
