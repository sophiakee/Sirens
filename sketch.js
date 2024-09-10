/*This is the fourth version of this app.*/

//Scenes: intro, instructions, game, game over
let scene = 0;
//Scoring: lives and score
var health = 5;
var score = 0;
//Objects with sprites: player, prey, predators
var jellySprite;
var preySprite;
var enemySprite;
var lifeSprite;
//Calling dynamic sprites
var logo;
//Sprite motion sequences
var jelly_sequence;
var prey_sequence;
var enemy_sequence;
var life_sequence;
//timer
//var startTimer;
var startMillis;
//sound
var sfx_alarm;
var sfx_damage;
var sfx_score;
var bgm;
//fun facts
var facts;
//var factArray=[0,1,2,3,4];
var factNo;

function preload() {
  //sound
  soundFormats("mp3", "ogg", "wav");
  bgm = loadSound("sfx/atolla.wav");

  //starting, instructions and ending fullscreen images
  startCard = loadImage("assets/open_card_image.png");
  logo = loadImage("assets/logo.gif");
  winCard = loadImage("assets/win_card_image.png");
  loseCard = loadImage("assets/lose_card_image.png");
  instCard1 = loadImage("assets/instructions1.png");
  instCard2 = loadImage("assets/instructions2.png");
  charaIntro = loadImage("assets/characters.png");

  //HP indicator
  lifeSpriteSheet = loadSpriteSheet("assets/lives_sheet.png", 84, 16, 5);
  life_sequence = loadAnimation(lifeSpriteSheet);

  //player sprite
  jellySpriteSheet = loadSpriteSheet("assets/jelly_sheet.png", 64, 64, 73);
  jelly_sequence = loadAnimation(jellySpriteSheet);
  //alarm sequence
  alarmSpriteSheet = loadSpriteSheet("assets/alarm_sheet.png", 64, 64, 19);
  alarm_sequence = loadAnimation(alarmSpriteSheet);

  //prey sprite
  preySpriteSheet = loadSpriteSheet("assets/prey_sheet.png", 32, 16, 16);
  prey_sequence = loadAnimation(preySpriteSheet);

  //enemy sprite
  enemySpriteSheet = loadSpriteSheet("assets/predator_sheet.png", 180, 72, 72);
  predator_sequence = loadAnimation(enemySpriteSheet);

  //fun facts
  facts = loadJSON("funfacts.json");
}

function setup() {
  sfx_alarm = loadSound("sfx/alarm.wav");
  sfx_damage = loadSound("sfx/damage.wav");
  sfx_score = loadSound("sfx/score.wav");
  createCanvas(960, 640);
  frameRate(60);

  //groups
  preys = new Group();
  enemies = new Group();

  //sprites

  //place lives sprite
  lifeSprite = createSprite(80, 40, 84, 16);
  lifeSprite.shapeColor = color(255, 0, 0);
  lifeSprite.addAnimation("hpdown", life_sequence);
  lifeSprite.animation.stop();

  //setup prey
  for (var i = 0; i < 10; i++) {
    var newPrey = createSprite(random(width), random(height), 32, 16);
    preys.add(newPrey);
    newPrey.addAnimation("preyswim", prey_sequence);
    newPrey.setSpeed(random(0, 4), random([0, 180]));
  }

  //setup predators
  for (var j = 0; j < 3; j++) {
    var newPredator = createSprite(random([0, width]), random(height), 144, 72);
    enemies.add(newPredator);
    newPredator.addAnimation("predatorswim", predator_sequence);
    newPredator.setSpeed(random(1, 4), random([0, 180]));
    newPredator.rotateToDirection = true;
  }

  //place jellyfish sprite
  jellySprite = createSprite(480, 320, 64, 64);
  jellySprite.shapeColor = color(227, 73, 70);
  jellySprite.addAnimation("swim", jelly_sequence);
  jellySprite.addAnimation("alarm", alarm_sequence);

  //text
  fill(255);
  strokeWeight(3);
  stroke(0);
  textStyle(BOLD);
  textFont("Courier New");
  textSize(24);
  textAlign(CENTER, CENTER);

  //images
  imageMode(CORNER);
  colorMode(HSB);
}

function draw() {
  noSmooth();
  //scene switch cases
  switch (scene) {
    case 0:
      scene0(); //title
      break;
    case 1:
      scene1(); //intro
      break;
    case 2:
      scene2(); //instructions 1
      break;
    case 3:
      scene3(); //instructions 2
      break;
    case 4:
      scene4(); //game
      break;
    case 5:
      scene5(); //win
      break;
    case 6:
      scene6(); //loss
      break;
    default:
  }

  //Scenes

  function scene0() {
    if (factNo == null) {
      factNo = floor(random(0, 4.999));
    }
    //intro scene
    image(startCard, 0, 0);
    text("Double-click to continue...", 960 / 2, 640 * 0.9);
    textSize(16);
    text(facts[factNo].knowledge, 960 / 2, 640 / 1.7);
    image(logo, 130, 10);
  }
  function scene1() {
    image(charaIntro, 0, 0);
    text("Atolla Jellyfish", 140, 290);
    text("Siphonophore", 480, 290);
    text("Krill", 820, 290);
    text("Double-click to continue...", 960 / 2, 640 * 0.9);
    textSize(16);
    text(
      "Six species of jellyfish\nalso known as crown\njellyfish due to their crown-\nlike bells.They dwell in\nthe twilight zone,\npreferring depths of\naround 1,000-4,000 meters.\nAtolla are bioluminescent,\nand give off flashes of\nblue light to attract prey or\nstartle predators,giving them\nthe nickname 'alarm jelly'.",
      145,
      440
    );
    text(
      "Colonies of several\nparts called zooids that\neach perform distinct\ntasks to keep the colony\ngoing, such as movement,\nreproduction, digestion and\ncatching prey. Similarly to\njellyfish, their tentacles\nsting and snare their prey.",
      480,
      410
    );
    text(
      "Tiny phytoplankton-\neating, shrimp-like\ncreatures who are nearly\nat the bottom of the food\nchain. What they lack in\nsize they make up for in\nnumber and environmental\n impact, taking carbon\nfrom the atmosphere\nand depositing it at the\nbottom of the sea.",
      820,
      430
    );
  }
  function scene2() {
    //instructions scene 1
    image(instCard1, 0, 0);
    text("You are the Atolla Jellyfish", 960 / 2, 640 * 0.1);
    text("Use the arrow keys\nto move around", 960 / 4, 640 * 0.4);
    text("To pick up food!", 960 / 1.5, 640 * 0.7);
    text("Double-click to continue...", 960 / 2, 640 * 0.9);
  }
  function scene3() {
    //instructions scene 2
    image(instCard2, 0, 0);
    text(
      "Try to avoid the chains\nof siphonophores,\nor else it's game over!",
      960 / 4,
      640 * 0.3
    );
    text("And make it to the\nsurface by nightfall!", 960 / 1.5, 640 * 0.6);
    text("Double-click to play!", 960 / 2, 640 * 0.9);
    //because score and health would sometimes not properly reset upon restart
    score = 0;
    health = 5;
    lifeSprite.animation.rewind();
  }
  function scene4() {
    var startTimer = 60000 + startMillis - millis();
    var from = color(
      212,
      97 - (60 - startTimer / 1000 / 2),
      8 + (60 - startTimer / 1000) * 0.5
    );
    var to = color(
      248,
      97 - (60 - startTimer / 1000 / 2),
      1 + (60 - startTimer / 1000) * 0.5
    );
    background(
      248,
      97 - (60 - startTimer / 1000 / 2),
      8 + (60 - startTimer / 1000) * 0.5
    );
    setGradient(from, to);
    if (startTimer <= 0) {
      scene = 5;
    }

    //console.log(8+(60-(startTimer/1000))*0.5);
    //main scene
    //Make sprites visible
    drawSprites();
    //place prey

    //Generates prey on the screen. As specified in setup(), there will be 10 of them.
    for (var i = 0; i < preys.length; i++) {
      var prey = preys[i];

      //Stopping strangers from going offscreen
      //If they try to go offscreen their movement trajectory will change to put them back onscreen.
      if (prey.position.x > width) {
        preys.splice(i, 1);
      }
      if (prey.position.x < 0) {
        preys.splice(i, 1);
      }

      if (preys.length < 10) {
        var newPrey = createSprite(random(width), random(height), 32, 16);
        newPrey.addAnimation("preyswim", prey_sequence);
        preys.add(newPrey);
        let preyAngle = random([0, 180]);
        newPrey.setSpeed(random(0, 4), preyAngle);
        newPrey.mirrorX(preyAngle / -90 + 1);
      }
    }


   for (var j = 0; j < 3; j++) {
      var enemy = enemies[j];

     if (startTimer > 58000) {
       enemies.length = 0;
     }
      //Stopping strangers from going offscreen
      //If they try to go offscreen their movement trajectory will change to put them back onscreen.

      if (enemy.position.x > width) {
        enemies.splice(j, 1);
      }
      if (enemy.position.x < 0) {
        enemies.splice(j, 1);
      }
      if (enemies.length < 3) {
        var newPredator = createSprite(
          random([0, width]),
          random(height),
          72,
          180
        );
        newPredator.addAnimation("predatorswim", predator_sequence);
        newPredator.setSpeed(random(1, 4), random([0, 180]));
        newPredator.rotateToDirection = true;
        enemies.add(newPredator);
      }
    }

    //Gameplay Functions:
    //Gain points by eating prey
    function eat() {
      sfx_score.play();
      sfx_alarm.stop();
      score++;
      if ((jellySprite.animation = "alarm")) {
        jellySprite.changeAnimation("swim");
      }
      this.remove();
    }

    //Lose a life when colliding with an enemy
    function death() {
      this.remove();
      sfx_damage.play();
      health--;
      lifeSprite.animation.nextFrame();
      jellySprite.changeAnimation("alarm");
      if (sfx_alarm.isPlaying() == false) {
        sfx_alarm.loop();
      }

      if (health == 0) {
        scene = 6;
      }
    }

    //Collision info
    preys.overlap(jellySprite, eat);
    enemies.bounce(jellySprite, death);
    enemies.collide(enemies);

    //showing the score on the screen
    fill(0, 0, 100);
    stroke(0, 0, 0);
    text("SCORE: " + score, 860, 40);
    text("TIME:" + int(startTimer / 1000), 400, 40);
  }
  function scene5() {
    //game won scene
    if (sfx_alarm.isPlaying() == true) {
      sfx_alarm.stop();
    }
    image(winCard, 0, 0);
    text("Score: " + score, 960 / 2, 640 * 0.95);
    text("Double-click to play again!", 960 / 2, 640 * 0.9);
  }

  function scene6() {
    //game over scene
    if (sfx_alarm.isPlaying() == true) {
      sfx_alarm.stop();
    }
    image(loseCard, 0, 0);
    text("Score: " + score, 960 / 2, 640 * 0.95);
    text("Double-click to try again!", 960 / 2, 640 * 0.9);
  }
}

//controls
function doubleClicked() {
  if (scene == 0) {
    scene++;
    bgm.loop();
  } else if (scene <= 3 && scene >= 1) {
    scene++;
    startMillis = millis();
  } else if (scene >= 5) {
    score = 0;
    health = 5;
    scene = 2;
    jellySprite.changeAnimation("swim");
  }
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    jellySprite.setSpeed(2.5, 0);
    jellySprite.rotation = 45;
  } else if (keyCode == DOWN_ARROW) {
    jellySprite.setSpeed(2.5, 90);
    jellySprite.rotation = 180;
  } else if (keyCode == LEFT_ARROW) {
    jellySprite.setSpeed(2.5, 180);
    jellySprite.rotation = 315;
  } else if (keyCode == UP_ARROW) {
    jellySprite.setSpeed(2.5, 270);
    jellySprite.rotation = 0;
  }
  //jellySprite.animation.play();
  return false;
}

function keyReleased() {
  jellySprite.setSpeed(0, 0);
  jellySprite.rotation = 0;
}

function setGradient(c1, c2) {
  // noprotect
  //noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}
