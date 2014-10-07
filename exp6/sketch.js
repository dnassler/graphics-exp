
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
  //var nFrames = 240;
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
    // for (var i=0; i<nCols; i++) {
    //   for (var j=0; j<nRows; j++) {
    //     var frameIndex = (i+j*nCols) * frameDelay;
    //     drawFrameAtIndexToGrid(frameIndex,i,j);
    //   }
    // }
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
          if ( row >= nRows || col < 0 ) {
            maxCol += 1;
          }
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

function SourceImage(sizeIn) {
  var size = sizeIn;
  var g = createGraphics(size,size);
  this.getImage = function() {
    return g;
  }

  var rotate = function(angle,x,y) {
    return {x:x*cos(angle)-y*sin(angle),y:x*sin(angle)+y*cos(angle)};
  };

  var fromColor = color(random(255),random(255),random(255), 100);
  var toColor = color(random(255),random(255),random(255), 100);
  // var colorInfoArr = [];
  // for ( var i=0; i<5; i++ ) {
  //   colorInfoArr.push(
  //     {fromColor: color(random(255),random(255),random(255), 100),
  //       toColor: color(random(255),random(255),random(255), 100)});
  // }
  // var currentColorInfoIndex = 0;
  // var changeColorIndexAt = 0;
  // var changeColorIndexInterval = 20000;

  var shapeColor; // = color(50,55,100);
  var currentColorValueOnScale = 0;
  //var nextColorValueOnScale = 1;

  var shapeSize = random(10,size*0.5);
  var nextShapeSize = random(10,size*0.5);

  var angle = PI;
  var fromAngle = angle;
  var nextAngle = random(-TWO_PI,TWO_PI);
  var nextAngleChangeStart = millis();
  var nextAngleChangeDur = 5000;

  var x=random(size);
  var y=random(size);

  var vx=0;
  var vy=0;
  var nextVx=random(-2,2);
  var nextVy=random(-2,2);
  var changeVelocity = function() {
    nextVx = random(-1,1);
    nextVy = random(-1,1);
    //shapeColor = color(random(255),random(255),random(255));

    fromColor = toColor;
    toColor = color(random(255),random(255),random(255));
    currentColorValueOnScale = 0;

    //nextColorValueOnScale = random(1);
    nextShapeSize = random(size/10,size*3);
    //shapeSize = shapeSize + (nextShapeSize-shapeSize)/10;
    nextAngle = random(-PI,PI);
  };
  var changeVelAt = 0;
  var changeVelocityInterval = 5000;

  var minX = -size/2;
  var maxX = size*1.5;
  var minY = -size/2;
  var maxY = size*1.5;

  this.update = function() {
    
    vx += (nextVx - vx)/240;
    vy += (nextVy - vy)/240;

    shapeSize += (nextShapeSize-shapeSize)/240;
    //dh = Math.easeInOutCubic( this.fractionClosed(), this.doorHeight, -this.doorHeight, 1 );

    angle = millis() > nextAngleChangeStart + nextAngleChangeDur ? angle : Math.easeInCubic( millis()-nextAngleChangeStart, fromAngle, nextAngle, nextAngleChangeDur );


    //angle += (nextAngle-angle)/240;
    //var fromColor = colorInfoArr[currentColorInfoIndex].fromColor;
    //var toColor = colorInfoArr[currentColorInfoIndex].toColor;
    currentColorValueOnScale += (1 - currentColorValueOnScale)/60;
    shapeColor = lerpColor(fromColor,toColor,currentColorValueOnScale);

    x += vx;
    y += vy;
    if ( x < minX || x > maxX ) {
      vx = -vx;
      x = x<minX ? 0 : maxX;
    }
    if ( y < minY || y > maxY ) {
      vy = -vy;
      y = y<minY ? 0 : maxY;
    }
    if ( millis() > changeVelAt ) {
      changeVelocity();
      changeVelAt = millis() + changeVelocityInterval;

      nextAngleChangeStart = millis();
      fromAngle = angle;
    }
    // if ( millis() > changeColorIndexAt ) {
    //   currentColorInfoIndex += 1;
    //   if ( currentColorInfoIndex >= colorInfoArr.length ) {
    //     currentColorInfoIndex = 0;
    //   }
    //   changeColorIndexAt = millis() + changeColorIndexInterval;
    // }

    drawGraphics();
  };

  var drawGraphics = function() {
    g.background(0);
    g.rectMode(CENTER);
    g.ellipseMode(CENTER);
    g.fill(shapeColor);
    g.noStroke();
    //g.rect(x,y,shapeSize,shapeSize);
    //g.ellipse(x,y,shapeSize,shapeSize);
    //g.translate(x,y);
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

    g.triangle(px0,py0, px1,py1, px2,py2);
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

