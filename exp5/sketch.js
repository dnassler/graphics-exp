
// var img;
var doorOpen;
var doorClose;

var doorSlideOpen1;
var doorSlideClose1;

var doorSounds = [];

var doorMgr;

function preload() {

  doorOpen = loadSound("216874__castironcarousel__open-then-close-squeaky-door-Mono-open1.mp3");
  doorClose = loadSound("216874__castironcarousel__open-then-close-squeaky-door-Mono-close1.mp3");

  doorSlideOpen1 = loadSound("Sep_25_2014-010-slideopen1.mp3");
  doorSlideClose1 = loadSound("Sep_25_2014-010-slideclose1.mp3");

}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  // var pg = createGraphics(width,height);
  // pg.clear();
  // pg.fill(0,0,255,255);
  // pg.rect(0,0,width,10);
  // img.mask(pg);
  // image( img, 0, 0 );
  // noLoop();

  //a = Tom().play( Rndf(80, 160), 1/2 );
  //a.fx.add(Delay());

  //rectMode(CENTER);

  var reverb = new p5.Reverb();
  reverb.process( doorOpen );
  reverb.process( doorClose );
  reverb.process( doorSlideOpen1 );
  reverb.process( doorSlideClose1 );

  doorOpen.setVolume(5);
  doorOpen.rate(.5);
  doorClose.setVolume(5);
  doorClose.rate(.5);
  var doorOpenDur = doorOpen.duration() / .5;
  var doorCloseDur = doorClose.duration() / .5;

  doorSlideOpen1.setVolume(5);
  doorSlideOpen1.rate(.75);
  doorSlideClose1.setVolume(5);
  doorSlideClose1.rate(.75);
  var doorSlideOpen1Dur = doorSlideOpen1.duration() / .75;
  var doorSlideClose1Dur = doorSlideClose1.duration() / .75;

  doorSounds.push({
    doorType: 'horizontal',
    open: {file:doorOpen,duration:doorOpenDur},
    close: {file:doorClose,duration:doorCloseDur}
    });
  doorSounds.push({
    doorType: 'vertical',
    open: {file:doorSlideOpen1,duration:doorSlideOpen1Dur},
    close: {file:doorSlideClose1,duration:doorSlideClose1Dur}
    });

  doorMgr = new DoorMgr();

  // doorOpen.play();
  // window.setTimeout( function(){
  //   doorClose.play();
  // }, 5000 );

  // doorSlideOpen1.play();
  // window.setTimeout( function(){
  //   doorSlideClose1.play();
  // }, 5000 );

}

function draw() {
  background(255);

  doorMgr.update();
  doorMgr.draw();

  // var doors = getActiveDoors();
  // for ( var i=0; i<doors.length; i++ ) {
  //
  // }
  // if ( isOpeningDoor ) {
  //   rect()
  // }
}


function mousePressed() {
  //toggleDoor();
  doorMgr.openNewDoor( function( door ) {
    console.log("a new door has finished opening: id="+door.doorId);
    window.setTimeout(function() {
      console.log("about to close door:");
      console.log("doorId = "+door.doorId);
      door.close();
    }, 5000);
  });
}

function DoorMgr() {

  this.doorsActive = {};

  this.lastDoorId = -1;

}

DoorMgr.prototype = {
  findEmptySpace: function(door) {
    var rx = null;
    var ry = null;
    var maxLoops = 100;
    var loopCount = 0;
    while ( !rx || !this.isSpaceEmpty( rx, ry, door ) ) {
      rx = random(width/10, width*0.9);
      ry = random(height/10, height*0.9);
      loopCount += 1;
      if ( loopCount > maxLoops ) break; // give up looking for empty space and just use whatever
    }
    if ( loopCount > maxLoops ) {
      console.log("maxloops!!!!");
    }
    return {x:rx,y:ry};
  },
  isSpaceEmpty: function( rx, ry, doorIn ) {
    var doorIdKeys = Object.keys(this.doorsActive);
    for (var i=0; i<doorIdKeys.length; i++) {
      var doorId = doorIdKeys[i];
      var door = this.doorsActive[doorId];
      if ( dist(rx,ry,door.x,door.y) < 1.5* max(doorIn.doorWidth,doorIn.doorHeight,door.doorWidth,door.doorHeight) ) {
        return false;
      }
    }
    return true;
  },
  getNextDoorId: function() {
    this.lastDoorId += 1;
    return this.lastDoorId;
  },
  openNewDoor: function( doorOpenedCallback ) {
    var door = new Door();
    door.doorId = this.getNextDoorId();
    var emptySpaceXY = this.findEmptySpace(door);
    door.setPos( emptySpaceXY.x, emptySpaceXY.y );
    this.doorsActive[door.doorId] = door;
    door.open( doorOpenedCallback );
  },
  closeDoorById: function( doorId ) {
    var door = this.getDoorById( doorId );
    if ( door ) {
      door.close();
    }
  },
  getRandomOpenDoor: function() {
    return this.getRandomDoor(true);
  },
  getRandomClosedDoor: function() {
    return this.getRandomDoor(false);
  },
  getRandomDoor: function( onlyOpen ) {
    var doorIdKeysToPickFrom = [];
    var doorIdKeys = Object.keys(this.doorsActive);
    for (var i=0; i<doorIdKeys.length; i++) {
      var doorId = doorIdKeys[i];
      var door = this.doorsActive[doorId];
      if ( onlyOpen && door.isOpen() ) {
        doorIdKeysToPickFrom.push( doorId );
      } else if ( door.isClosed() ) {
        doorIdKeysToPickFrom.push( doorId );
      }
    }
    if ( doorIdKeysToPickFrom.length == 0 ) {
      return undefined;
    }
    var randomKeyIndex = floor(random(doorIdKeysToPickFrom.length));
    var randomKey = doorIdKeysToPickFrom[randomKeyIndex];
    var randomDoor = this.doorsActive[randomKey];
    return randomDoor;
  },
  getDoorById: function( doorId ) {
    var door = this.doorsActive[doorId];
    return door;
  },
  closeAllDoors: function() {
    for (var i=0; i<this.doorsActive.length; i++) {
      var door = this.doorsActive[i];
      if ( door.isOpen() || door.isOpening() ) {
        door.close();
      }
    }
  },
  removeClosedDoor: function( door ) {
    if ( !door.isClosed() ) {
      return;
    }
    delete this.doorsActive[door.doorId];
  },
  update: function() {
    var doorIdKeys = Object.keys(this.doorsActive);
    for (var i=0; i<doorIdKeys.length; i++) {
      var doorId = doorIdKeys[i];
      var door = this.doorsActive[doorId];
      door.update();
      if ( door.isClosed() ) {
        this.removeClosedDoor( door );
      }
    }
  },
  draw: function() {
    var doorIdKeys = Object.keys(this.doorsActive);
    for (var i=0; i<doorIdKeys.length; i++) {
      var doorId = doorIdKeys[i];
      var door = this.doorsActive[doorId];
      door.draw();
    }
  }

};

function Door() {

  this.doorId = -1;
  this.state = 'closed';
  this.x = 0;
  this.y = 0;

  this.openStartTime = 0;
  this.closeStartTime = 0;

  // if ( !this.x ) {
  //   resetXPos();
  // }
  // if ( !this.y ) {
  //   resetYPos();
  // }
  //
  // var resetXPos = function() {
  //   this.x = random(width/10,width*0.9);
  // };
  // var resetYPos = function() {
  //   this.y = random(height/10,height*0.9);
  // };
  // var resetPosition = function() {
  //   resetXPos();
  //   resetYPos();
  // };

  // this.isOpen = false;
  // this.isOpening = false;
  // this.isClosing = false;
  // this.isClosed = true;

  var pickDoorSound = function() {
    var rndIndex = floor(random(doorSounds.length));
    var doorSound = doorSounds[rndIndex];
    return doorSound;
  };
  this.doorSound = pickDoorSound();

  this.doorWidth = 100; //random(100,100);
  this.doorHeight = 100; //random(100,200);

  this.openingDuration = this.doorSound.open.duration * 1000 * 0.8;
  this.closingDuration = this.doorSound.close.duration * 1000 * 0.8;

  this.STATE_OPEN = 'open';
  this.STATE_CLOSED = 'closed';
  this.STATE_OPENING = 'opening';
  this.STATE_CLOSING = 'closing';

  this.doorOpenedCallback = null;
}

Door.prototype = {
  setPos: function( xIn, yIn ) {
    this.x = xIn;
    this.y = yIn;
  },

  setStateToOpen: function() {
    this.state = this.STATE_OPEN;
    if ( this.doorOpenedCallback ) {
      this.doorOpenedCallback( this );
    }
  },
  setStateToClosed: function() {
    this.state = this.STATE_CLOSED;
  },
  setStateToOpening: function() {
    this.state = this.STATE_OPENING;
  },
  setStateToClosing: function() {
    this.state = this.STATE_CLOSING;
  },

  isOpen: function() {
    if ( this.state === this.STATE_OPEN ) {
      return true;
    }
    return false;
  },
  isClosed: function() {
    if ( this.state === this.STATE_CLOSED ) {
      return true;
    }
    return false;
  },
  isOpening: function() {
    return (this.state === this.STATE_OPENING);
  },
  isClosing: function() {
    return (this.state === this.STATE_CLOSING);
  },
  open: function( doorOpenedCallbackIn ) {
    if ( !this.isClosed() ) {
      return;
    }
    if ( doorOpenedCallbackIn ) {
      this.doorOpenedCallback = doorOpenedCallbackIn;
    }
    this.setStateToOpening();
    this.openStartTime = millis();
    this.doorSound.open.file.play();
  },
  close: function() {
    if ( !this.isOpen() ) {
      return;
    }
    this.setStateToClosing();
    this.closeStartTime = millis(); // maybe modify this if close() was called while door was opening
    this.doorSound.close.file.play();
  },
  fractionOpen: function() {
    var openingTimeDelta = millis() - this.openStartTime;
    var frac = openingTimeDelta / this.openingDuration;
    if ( frac > 1 ) {
      frac = 1;
    }
    return frac;
  },
  fractionClosed: function() {
    var closingTimeDelta = millis() - this.closeStartTime;
    var frac = closingTimeDelta / this.closingDuration;
    if ( frac > 1 ) {
      frac = 1;
    }
    return frac;
  },
  update: function() {
    // update state
    if ( this.isOpening() ) {
      if ( this.fractionOpen() >= 1 ) {
        this.setStateToOpen();
      }
    } else if ( this.isClosing() ) {
      if ( this.fractionClosed() >= 1 ) {
        this.setStateToClosed();
      }
    }
  },
  draw: function() {
    if ( this.isClosed() ) {
      // draw should not be called when it is closed but if it is then do nothing
      return;
    }

    var dw = this.doorWidth;
    var dh = this.doorHeight;

    if ( this.isOpening() ) {

      if ( this.doorSound.doorType === 'vertical' ) {

        dh = Math.easeInOutCubic( this.fractionOpen(), 0, this.doorHeight, 1 );

      } else if ( this.doorSound.doorType === 'horizontal' ) {

        dw = Math.easeInOutCubic( this.fractionOpen(), 0, this.doorWidth, 1 );

      }

    } else if ( this.isClosing() ) {

      if ( this.doorSound.doorType === 'vertical' ) {

        dh = Math.easeOutCubic( this.fractionClosed(), this.doorHeight, -this.doorHeight, 1 );

      } else if ( this.doorSound.doorType === 'horizontal' ) {

        dw = Math.easeOutCubic( this.fractionClosed(), this.doorWidth, -this.doorWidth, 1 );

      }

    }

    rectMode(CORNER);
    noStroke();
    fill(0);
    rect(this.x, this.y, dw, dh);

    // if ( this.doorSound.doorType === 'vertical' ) {
    //   rectMode(CORNER);
    //   //var h = Math.easeInOutCubic( millis() - this.openStartTime, 0, this.doorHeight, this.openingDuration );
    //   //rect(this.x,this.y,this.doorWidth, this.doorHeight * fractionOpen);
    // } else if ( this.doorSound.doorType === 'horizontal' ) {
    //   rectMode(CORNER);
    //   rect(this.x,this.y,this.doorWidth * fractionOpen, this.doorHeight);
    // }

  }
};

//----

// var doorIsOpen = false;
// var doorSound;
//
// function toggleDoor() {
//   if ( !doorIsOpen ) {
//     openDoor();
//   } else {
//     closeDoor();
//   }
// }
//
// // function pickDoorSound() {
// //   var rndIndex = floor(random(doorSounds.length));
// //   var doorSound = doorSounds[rndIndex];
// //   return doorSound;
// // }
// function openDoor() {
//   doorSound = pickDoorSound();
//   doorIsOpen = true;
//   doorSound.open.play();
// }
// function closeDoor() {
//   doorIsOpen = false;
//   doorSound.close.play();
// }

// t = current time
// b = start value
// c = change in value
// d = duration
Math.easeInOutCubic = function (t, b, c, d) {
	//var t = tin / (d/2);
  t /= d/2;
  // if ( t>.8 ) {
  //   console.log("t="+t+", c/2*t*t*t="+c/2*t*t*t);
  // }
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};

Math.easeOutCubic = function (t, b, c, d) {
	t /= d;
	t--;
	return c*(t*t*t + 1) + b;
};
