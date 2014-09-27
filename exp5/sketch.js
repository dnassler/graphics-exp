
// var img;
var doorOpen;
var doorClose;

var doorSlideOpen1;
var doorSlideClose1;

var doorSounds = [];
var doorSoundsByType = {};

var doorMgr;

var DOOR_WIDTH = 100;
var DOOR_HEIGHT = 100;

function preload() {

  doorOpen = loadSound("216874__castironcarousel__open-then-close-squeaky-door-Mono-open1.mp3");
  doorClose = loadSound("216874__castironcarousel__open-then-close-squeaky-door-Mono-close1.mp3");

  doorSlideOpen1 = loadSound("Sep_25_2014-010-slideopen1.mp3");
  doorSlideClose1 = loadSound("Sep_25_2014-010-slideclose1.mp3");

}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  console.log("displayWidth="+displayWidth+", displayHeight="+displayHeight+", windowWidth="+windowWidth+", windowHeight="+windowHeight+", window.innerWidth="+window.innerWidth+", window.innerHeight="+window.innerHeight+", width="+width+", height="+height);

  DOOR_WIDTH = min(width/10,100);
  DOOR_HEIGHT = DOOR_WIDTH;

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

  // create a map to door sounds by doorType (i.e. horizontal/vertical)
  for (var i=0; i<doorSounds.length; i++) {
    var doorSound = doorSounds[i];
    var doorType = doorSound.doorType;
    if ( !doorSoundsByType[doorType] ) {
      doorSoundsByType[doorType] = [];
    }
    doorSoundsByType[doorType].push( doorSound );
  }

  doorMgr = new DoorMgr();

  // doorOpen.play();
  // window.setTimeout( function(){
  //   doorClose.play();
  // }, 5000 );

  // doorSlideOpen1.play();
  // window.setTimeout( function(){
  //   doorSlideClose1.play();
  // }, 5000 );

  scene0();
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
    console.log("a new door has finished opening: id="+door.doorId+", x="+door.x+", y="+door.y);
    window.setTimeout(function() {
      console.log("about to close door:"+door.doorId);
      door.close();
    }, 5000);
  });
}

function scene0() {
  scene1();
}

function scene1() {
  var d1 = doorMgr.openNewDoor();
  var d2 = doorMgr.openNewDoor();
  if ( random(2) < 1 ) {
    window.setTimeout(function() {
      var d3 = doorMgr.openNewDoor(
        function() {
          window.setTimeout(function() {
            var d4 = doorMgr.openNewDoor( function() {
              window.setTimeout(function() {d3.close();},random(1000));
              window.setTimeout(function() {d4.close();},random(1000));
            } );
          },random(1000));
        }, 'vertical'
      );
      var d5 = doorMgr.openNewDoor(
        function() {
          window.setTimeout(function() {
            var d6 = doorMgr.openNewDoor( function() {
              window.setTimeout(function() {d5.close();},random(1000));
              window.setTimeout(function() {d6.close();},random(1000));
            });
          },random(1000));
        }, 'vertical'
      );
    }, random(0,4000) );
  }
  window.setTimeout( function() {
    d1.close();
    d2.close( scene1done );
  }, 5000);
}
function scene1done() {
  var r = random(5);
  if ( r < 1 ) {
    scene1();
  } else if ( r < 2 ) {
    scene2();
  } else if ( r < 3 ){
    scene3();
  } else if ( r < 4 ){
    scene4();
  } else {
    scene5();
  }
}

function scene2() {
  var d1 = doorMgr.openNewDoor( function(door) {
    window.setTimeout( function() {
      door.close( scene2done );
    },random(2000));
  });
}
function scene2done() {
  var r = random(10);
  if ( r < 1 ) {
    scene3();
  } else if ( r < 2 ) {
    scene4();
  } else {
    scene1();
  }
}

function scene3() {
  var numDoors = random(5,10);
  var dArr = [];
  for ( var i=0; i<numDoors; i++ ) {
    var d = doorMgr.openNewDoor();
    if ( d ) {
      dArr.push( d );
    }
  }
  window.setTimeout( function() {
    for ( var i=0; i<numDoors; i++ ) {
      var d = dArr[i];
      (function(door){
        window.setTimeout( function() {
          door.close();
        }, random(1000,5000) );
      })(d);
    }
  }, 3000);
  // TODO: improve the transition to scene3 by keeping track of when the last door closes (which is random but max 5000ms)
  window.setTimeout( function() {
    scene3done();
  }, random(5000,9000));
}
function scene3done() {
  var r = random(5);
  if ( r < 1 ) {
    scene4();
  } else if ( r < 2 ) {
    scene5();
  } else if ( r < 3 ){
    scene2();
  } else {
    scene1();
  }
}

function scene4() {
  var d1,d2,d3,d4,d5;
  d1 = doorMgr.openNewDoor(function() {
    d2 = doorMgr.openNewDoor(function() {
      d3 = doorMgr.openNewDoor(function() {
        d4 = doorMgr.openNewDoor(function() {
          d5 = doorMgr.openNewDoor(
            function() {

              if ( random(2) < 1 ) {
                d1.close( function() {
                  d2.close( function() {
                    d3.close( function() {
                      d4.close( function() {
                        window.setTimeout(function(){
                          d5.close( function() {
                            scene4done();
                          });
                        }, random(1000));
                      });
                    });
                  });
                });
              } else {
                d1.close();
                d2.close( function() {
                  d3.close();
                  d4.close();
                  d5.close( function() {
                    scene4done();
                  });
                });

              }

            }
          );
        });
      });
    });
  });
}
function scene4done() {
  if ( random(2) < 1 ) {
    scene1();
  } else {
    scene5();
  }
}
function scene5() {
  // do something different
  var numDoors = floor(random(10,20)); // TODO: this value MIGHT not match the final number of doors added to dArr (if the doors don't all fit for example)
  var scene5variantCode = floor(random(2));
  var openCount = 0;
  var closedCount = 0;
  var lastOpenTurnCount = 0;
  //var closeTimeRandom = random(2)<1 ? true:false;
  var dArr = [];
  for ( var i=0; i<numDoors; i++ ) {
    window.setTimeout(function() {
      var keepAlive = floor(random(2,5));
      var d = doorMgr.openNewDoor( scene5doorOpenEvent
        // function() {
        //   openCount += 1;
        //   window.setTimeout(function() {
        //     d.close( scene5doorCloseEvent
        //       // function() {
        //       //   // check if everything is done
        //       //   closedCount += 1;
        //       //   if ( closedCount == numDoors && openCount == closedCount ) {
        //       //     scene5done();
        //       //   }
        //       // }
        //     );
        //   } , random(2000,4000));
        // }
        ,'vertical',keepAlive);
      if ( d ) {
        dArr.push( d );
      }
    }, random(3000));
  }

  var scene5doorOpenEvent = function ( door ) {

    openCount += 1;

    if ( scene5variantCode == 1 && door.keepAlive <= 1) {

      // this door is open but the next time it closes, it will be dead
      // so do not set a timeout to close it and instead wait until the
      // scene done signal occurs
      lastOpenTurnCount += 1;
      if ( lastOpenTurnCount == numDoors ) {
        window.setTimeout(function() {
          for (var i=0; i<numDoors; i++) {
            var d = dArr[i];
            if ( i == numDoors-1 ) {
              d.close( function() {
                scene5done();
              });
            } else {
              d.close();
            }
          }
        }, random(5000,10000));

      }

    } else {

      window.setTimeout( function() {
        door.close( function() {

          closedCount += 1;

          // check if everything is done
          if ( door.keepAlive ) {
            door.keepAlive -= 1;
            if ( door.keepAlive < 0 ) {
              door.keepAlive = 0;
            } else if ( door.keepAlive > 0 ) {
              // reopen in random time
              openCount -= 1;
              closedCount -= 1;
              window.setTimeout(function(){
                door.open( scene5doorOpenEvent
                  // function() {
                  // openCount += 1;
                  // window.setTimeout(function(){
                  //   door.close( scene5doorCloseEvent );
                  // }, random(2000,4000));
                  // }
                  );
              }, random(500,4000));
            }
          }

          console.log("numDoors = "+numDoors+", openCount = "+openCount+", closedCount = "+closedCount);
          if ( closedCount == numDoors && openCount == closedCount ) {
            console.log("******* all closed *******");
            scene5done();
          }

        });
      }, random(500,4000));

    }


  }

  // window.setTimeout( function() {
  //   for ( var i=0; i<numDoors; i++ ) {
  //     var d = dArr[i];
  //     (function(door){
  //       window.setTimeout( function() {
  //         door.close();
  //       }, random(1000) );
  //     })(d);
  //   }
  // }, random(3000));

  // window.setTimeout( function() {
  //   scene5done();
  // }, random(5000,9000));

}


function scene5done() {
  var r = random(4);
  if ( r < 1 ) {
    scene1();
  } else if ( r < 2 ) {
    scene2();
  } else if ( r < 3 ){
    scene3();
  } else {
    scene4();
  }
}

function DoorMgr() {

  this.doorsActive = {};

  this.lastDoorId = -1;

}

DoorMgr.prototype = {
  findEmptySpace: function(doorSpaceReq) {
    var rx = null;
    var ry = null;
    var maxLoops = 1000;
    var loopCount = 0;
    while ( !rx || !this.isSpaceEmpty( rx, ry, doorSpaceReq ) ) {
      rx = random(width/100, width*0.9);
      ry = random(height/100, height*0.9);
      loopCount += 1;
      if ( loopCount > maxLoops ) break; // give up looking for empty space and just use whatever
    }
    if ( loopCount > maxLoops ) {
      console.log("maxloops!!!!");
      return {noEmptySpace:true};
    }
    return {x:rx,y:ry};
  },
  isSpaceEmpty: function( rx, ry, doorSpaceReq ) {
    var doorIdKeys = Object.keys(this.doorsActive);
    for (var i=0; i<doorIdKeys.length; i++) {
      var doorId = doorIdKeys[i];
      var door = this.doorsActive[doorId];
      if ( dist(rx,ry,door.x,door.y) < 1.5* max(doorSpaceReq.width,doorSpaceReq.height,door.doorWidth,door.doorHeight) ) {
        return false;
      }
    }
    return true;
  },
  getNextDoorId: function() {
    this.lastDoorId += 1;
    return this.lastDoorId;
  },
  openNewDoor: function( doorOpenedCallback, doorType, keepAlive ) {
    var emptySpaceXY = this.findEmptySpace({width:DOOR_WIDTH,height:DOOR_HEIGHT});
    if ( emptySpaceXY.noEmptySpace ) {
      // no room for a new door
      return false;
    }
    var door = new Door(doorType);
    door.doorId = this.getNextDoorId();
    door.keepAlive = keepAlive;
    door.setPos( emptySpaceXY.x, emptySpaceXY.y );
    this.doorsActive[door.doorId] = door;
    door.open( doorOpenedCallback );
    return door;
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
      if ( door.isClosed() && !door.keepAlive ) {
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

function Door( doorType ) {

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

  var pickDoorSound = function(doorType) {
    var doorSoundsArr;
    if ( !doorType ) {
      doorSoundsArr = doorSounds; //all door sounds
    } else {
      doorSoundsArr = doorSoundsByType[doorType];
    }
    var rndIndex = floor(random(doorSoundsArr.length));
    var doorSound = doorSoundsArr[rndIndex];
    return doorSound;
  };
  this.doorSound = pickDoorSound(doorType);

  this.doorWidth = DOOR_WIDTH; //random(100,100);
  this.doorHeight = DOOR_HEIGHT; //random(100,200);

  this.openingDuration = this.doorSound.open.duration * 1000 * 0.8;
  this.closingDuration = this.doorSound.close.duration * 1000 * 0.8;

  this.STATE_OPEN = 'open';
  this.STATE_CLOSED = 'closed';
  this.STATE_OPENING = 'opening';
  this.STATE_CLOSING = 'closing';

  this.doorOpenedCallback = null;
  this.doorClosedCallback = null;
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
    if ( this.doorClosedCallback ) {
      this.doorClosedCallback( this );
    }
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
  close: function( doorClosedCallbackIn ) {
    if ( !this.isOpen() ) {
      return;
    }
    if ( doorClosedCallbackIn ) {
      this.doorClosedCallback = doorClosedCallbackIn;
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
