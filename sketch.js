
var database, hypnos;
var bg, house, garden, bottle, moneyImg, washroom, bedroom;
var health = 0, hunger = 0, happy = 0, stock = 0, money = 0;
var name = "", nameInput;
var dog = [], dogIndex = 0;
var execute;
var frameCheck = {eat : 0, play : 0, msg : 0, running : 0, main : 0}
var temporary = {first : false, second : false, third : true}
var warning = "", msg = "";
var onButton = false;
var onButton2 = false;
var gameState = -1;
var warnings = [false, false, false, false, false]
var properties = [0, 0, 0, 0, 0];
var running = false;
var instances = 0;

function preload(){

  house = loadImage("images/house.png");
  garden = loadImage("images/garden.jpg");
  washroom = loadImage("images/Washroom.png");
  bedroom = loadImage('images/Bedroom.png');

  bottle = loadImage("images/Milk.png");

  dog[0] = loadImage("images/Dog.png");
  dog[1] = loadImage("images/Happy.png");
  dog[2] = loadImage("images/running.png");
  dog[3] = loadImage("images/runningLeft.png");
  dog[4] = loadImage("images/deadDog.png");
}

function setup() {
  createCanvas(800, 790).position((screen.width - width)/ 2, 0);

  //Update Database
  database = firebase.database();
  hypnos = database.ref('/');
  hypnos.on('value', readPosition);

  bg = house;

  //Name Input
  createSpan('Name: ');
  nameInput = createInput("Tom");

  //Create main
  execute = new Dog();
}

function draw() {
  
  name = nameInput.value();

  properties[0] = health;
  properties[1] = happy;
  properties[2] = hunger;
  properties[3] = stock;
  properties[4] = money;

  onButton = mouseX < 780 && mouseX > 640 && mouseY < 778 && mouseY > 748;
  onButton2 = mouseX < 620 && mouseX > 480 && mouseY < 778 && mouseY > 748;

  // width - 250, height - 27, 140, 30

  frameCheck.eat++;
  frameCheck.play++;
  frameCheck.msg++;

  rectMode(CENTER, CENTER);
  textAlign(CENTER, CENTER);
  noStroke();

  background(bg);

  if(gameState == -1){
    if(frameCount > 100){
      fill(0);
      textSize(40);
      rect(width/2, height/2 - 5, width, 100);

      fill(255);
      text(msg, width/2, height/2 - 30);
      text("PRESS SPACE TO START", width/2, height/2);

      if(keyIsDown(32)){
        gameState = 0;
      }
    } else{
      fill(0);
      rect(width/2, height/2, width, height);
    }

  } else if(gameState == 0){

    //Change values frameCount
    if(frameCount % 400 == 0){
      if(random(1) > 0.3){
        writePosition(hunger, happy - random([0, 0, 0, 10, 10, 10, 10, 20, 5, 5]), health, stock, money + random([5000, 200, 50, 50, 50, 50, 50, 50, 10, 10]), frameCheck.main)
      }
    }

    if(frameCount % 200 == 0){
      if(random(1) > 0.2){
        writePosition(hunger + random([1, 1, 1, 1, 2]), happy, health, stock, money, frameCheck.main)
      }
    }

    if(frameCount % 600 == 0 && temporary.third){
      writePosition(hunger, happy, health, stock, money, frameCheck.main + 1)
    }

    if(instances > 4){
      writePosition(hunger, happy, health, stock, money, 0)
      instances = 0;
    }

    //Change BG and Dog
    if(temporary.first && frameCheck.eat > 100){
      dogIndex = 0;
      temporary.first = false;
    }

    if(temporary.second && frameCheck.play > 100){
      bg = house;
      temporary.second = false;
    }

    if(frameCheck.main == 1){
      execute.changeBg(bedroom)
    } else if(frameCheck.main == 2){
      execute.changeBg(washroom)
    } else if(frameCheck.main == 3){
      execute.changeBg(house)
    } else{
      execute.changeBg(house)
      writePosition(hunger, happy, health, money, stock, 0)
      instances = 0;
      temporary.third = false;
    }

    //Check if alive
    execute.alive(-5, 10, hunger, "Your puppy got too hungry :-(");
    execute.alive(1, 2000, happy, "Your puppy was too sad and ran away :-(");
    execute.alive(0, 100, health, "Your puppy got bled too much :-(");



    //Instructions
    let instructions = ["Press UP_ARROW to feed", "Press LEFT_ARROW to play with him",
    "Press ENTER to reset values", "Change his name from the top left", "Feeding him increases health, and playing with him can get him hurt."]

    textSize(20)
    fill(0)
    rect(width/2, height/7 - 5, width, height/5);
    for(var i in instructions){
      fill(255)
      text(instructions[i], width/2, i*30 + 50)
    }

    //Additional Text
    if(frameCheck.msg < 100){
      fill(255)
      text(warning, 220, height - 30)
    }

    //Display Bottles
    if(bg == house){
      for(var i = 0; i<stock; i++){
        image(bottle, (width/10)*i - 40, height/4, width/5, width/5)
      }
    }

    if(running){
      if(frameCheck.running < 50){
        image(dog[dogIndex], width/2 - frameCheck.running*10, height/2 + 50, 250, 250)
        frameCheck.running++;
      } else if(frameCheck.running < 100){
        image(dog[dogIndex - 1], ((frameCheck.running - 50)* 10) - 90, height/2 + 50, 250, 250)
        frameCheck.running++;
      }
      else{
        running = false;
      }
    } else{
      frameCheck.running = 0;
    }
    //Display Dog
    (!running && bg == house)? image(dog[dogIndex], width/2, height/2 + 50, 250, 250) : 0

    //Giving warning
    execute.blinking(4, 200, 0)
    execute.blinking(40, 400, 1)
    execute.blinking(-4, 7, 2)
    execute.blinking(4, 200, 3)
    execute.blinking(201, 100000, 4)
    fill('#99b34d')
    rect(300, 433, 205, 55)

    //Table
    strokeWeight(4)
    stroke(0)
    textSize(15)

    fill('#99b34d');
    // rect(300, 535, 205, 250)
    line(310, 410, 310, 660)

    let table_lt = ["Name", "Health", "Happiness", "Hunger", "Stock", "Money"] // Easy to iterate
    let table_rt = [name, health, happy, hunger, stock, money]

    for(var i = 0; i < table_lt.length; i++){
      noStroke()
      fill('#800000')
      text(table_lt[i], 250, 440 + i*40) // Numbers achieved through trial error, no math
      text(table_rt[i], 360, 440 + i*40)

      stroke(0)
      strokeWeight(4)
      line(200, 460 + i*40, 400, 460 + i*40)
    }


    //Buy Button

      //Buy Stock
    onButton ? fill(255, 255, 0) : fill(255)
    stroke(0)
    strokeWeight(5)
    rect(width - 90, height - 27, 140, 30);

    noStroke()
    textSize(15)
    fill(0)
    text("Buy Milk", width - 90, height - 27)
  
      // Feed
    onButton2 ? fill(255, 255, 0) : fill(255)
    stroke(0)
    strokeWeight(5)
    rect(width - 250, height - 27, 140, 30);

    noStroke()
    textSize(15)
    fill(0)
    text("Feed the dog", width - 250, height - 27)

    //Checking Constraints

    let vals = [execute.constraint(0, Infinity, hunger), execute.constraint(-Infinity, 150, happy), execute.constraint(-Infinity, 10, health), execute.constraint(0, 10, stock), execute.constraint(0, Infinity, money)]
    writePosition(vals[0], vals[1], vals[2], vals[3], vals[4], frameCheck.main)
    

  } else if(gameState == 1){
    fill(0)
    textSize(40)
    rect(width/2, height/2 - 5, width, 100)

    fill(255)
    text(msg, width/2, height/2 - 30);
    text("PRESS SPACE TO RESTART", width/2, height/2 + 20)
  }

}

function mousePressed(){
  if(onButton){
    if(stock < 10){
      if(80 <= money < 160){
        writePosition(hunger, happy, health, stock + 1, money - 80, frameCheck.main)
      } else if(money < 80){
        execute.msg("Not enough money, minimum required is 80!");
      } else{
        writePosition(hunger, happy, health, stock + 1, money - random([100, 130, 80, 160]), frameCheck.main)
      }
    } else if(stock >= 10){
      execute.msg("Too many bottles, use some to get more!");
    }
  }

  if(onButton2){
    if(frameCheck.main == 0){
      execute.feed()
    } else if(frameCheck.main !== 0){
      execute.msg("Not time to eat :(");
    }
  }
}

function keyPressed(){
  keyCode == 13? execute.reset() : keyCode == 37 ? execute.play() : 0
}


function readPosition(data){
  group = data.val();
  console.log(group)
  console.log(money)
  hunger = group['Food'];
  happy = group['Fun'];
  health = group['Health'];
  stock = group['Stock'];
  money = group['Money'];
  frameCheck.main = group['Time'];
}

async function sleep(milliseconds) 
{
  var start = new Date().getTime();
 	for (var i = 0; i < 1e7; i++) 
 	{
    	if ((new Date().getTime() - start) > milliseconds)
    	{
      		break;
      }
  	}
}

function writePosition(a, b, c, d, e, f){
  database.ref('/').set({
    'Food' : a,
    'Fun' : b,
    'Health' : c,
    'Stock' : d,
    'Money' : e,
    'Time' : f
  })
}