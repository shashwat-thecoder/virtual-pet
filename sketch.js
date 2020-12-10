//Create variables here
var database, hypnos;
var dogs = [];
var current;
var bg, house, garden, bottle;
var health, food, happy, stock, money;
var group;
var state;
var msg, warning;
var start, start1;
var temp, temp2, temp3;
var col1;
var name, nameInput;

var happy_war, health_war, hunger_war, stock_war, money_war;

function preload(){
  //load images here
  house = loadImage("images/house.png")
  garden = loadImage("images/garden.jpg")
  bottle = loadImage("images/Milk.png")
  money = loadImage("images/cash.png")

  dogs[0] = loadImage("images/dogImg.png")
  dogs[1] = loadImage("images/dogImg1.png")
}

function setup() {
    happy_war= health_war= hunger_war= stock_war= money_war = '#99b34d';
    rectMode(CENTER)
    database = firebase.database();
    hypnos = database.ref('/');
    hypnos.on('value', readPosition)

    createCanvas(800, 700);
    col1 = 255;
    food, happy, health, money = 0;
    stock = 10;
    bg = 0;
    current = 0;
    state = 0;
    start = 0;
    start1 = 0;

    createSpan('Name: ')
    nameInput = createInput("Tom")
  }


function draw() {  
  if(frameCount % 500 == 0){
    if(random(1) > 0.2){
      money += random([5000, 200, 50, 50, 50, 50, 50, 50, 10, 10])
    }
  }
  name = nameInput.value()
  if(mouseX < 790 && mouseX > 650 && mouseY < 690 && mouseY > 660){
    col1 = "yellow"
  } else{
    col1 = 255;
  }
  start++;
  start1++
  bg == 1 ? background(garden) : background(house)

  fill(col1)
  stroke(0)
  strokeWeight(5)
  rect(width - 90, height - 27, 140, 30); // 800, 700
  noStroke()
  textSize(15)
  textAlign(CENTER)
  fill(0)
  text("Buy Milk", width - 90, height - 27)

  if(state == 0){

    textAlign(CENTER, CENTER);
    textSize(20)
    fill(255)
    rectMode(CENTER)
    rect(width/2, 85, width, 130)
    fill(0)
    text("Press UP_ARROW to feed", width/2, 40)
    text("Press LEFT_ARROW to play with him", width/2, 70)
    text("Change his name from the top left", width/2, 100)
    text("Feeding him increases health, and playing with him can get him hurt.", width/2, 130)

    if(temp < 100){
      fill(255)
      text(warning, 220, height - 30)
      temp++
    }


    image(dogs[current], width/2, height/2 + 50, 250, 250)

    for(var i = 1; i<=stock; i++){
      image(bottle, 50*i + 20*i - 50, 150, 150, 150)
    }

    stroke(8)
    fill("#99b34d")
    rect(300, 500, 200, 250)


    fill("#800000")
    stroke(8)
    line(300, 375, 300, 625)
    noStroke()
    // text("Health : " + health, 300, 400)
    // text("Happiness : " + happy, 300, 450)
    // text("Hunger : " + food, 300, 500)
    // text("Money : " + money, 300, 550)
    textAlign(CENTER)
    textSize(15) //62.5

    rectMode(CENTER);

    text("Name", 250, 400)
    text(name, 350, 400)
    stroke(8)
    line(200, 420, 400, 420)
    noStroke()
    
    fill(health_war)
    rect(300, 440, 195, 35)
    fill('#800000')
    text("Health", 250, 440)
    text(health, 350, 440)
    stroke(8)
    line(200, 460, 400, 460)
    noStroke()

    fill(happy_war)
    rect(300, 480, 195, 35)
    fill('#800000')
    text("Happiness", 250, 480)
    text(happy, 350, 480)
    stroke(8)
    line(200, 500, 400, 500)
    noStroke()

    fill(hunger_war)
    rect(300, 520, 195, 35)
    fill('#800000')
    text("Hunger", 250, 520)
    text(food, 350, 520)
    stroke(8)
    line(200, 540, 400, 540)
    noStroke()

    fill(stock_war)
    rect(300, 560, 195, 35)
    fill('#800000')
    text("Stock", 250, 560)
    text(stock, 350, 560)
    stroke(8)
    line(200, 580, 400, 580)
    noStroke()

    fill(money_war)
    rect(300, 603, 195, 40)
    fill('#800000')
    text("Money", 250, 600)
    text(money, 350, 600)
    stroke(8)
    noStroke()

    fill("#800000")
    stroke(8)
    line(300, 375, 300, 625)
    noStroke()



    if(frameCount % 250 == 0){
      writePosition(food + 1, happy - random([10, 10, 10, 10, 20, 5, 5]), health, stock, money)
    }

    if(temp2 && start > 100){
      current = 0;
      temp2 = false;
    }

    if(start1 > 100 && temp3){
      bg = 0;
      temp3 = false;
    }

    if(food < 0 ){
      writePosition(0, happy, health, stock,  money)
    }
    if(happy > 150 ){
      writePosition(food, 150, health,stock, money)
    }
    if(health > 10 ){
      writePosition(food, happy, 10, stock, money)
    }
    if(stock < 0 ){
      writePosition(food, happy, health, 0, money)
    }
    if(stock > 10 ){
      writePosition(food, happy, health, 10, money)
    }
    if(money < 0 ){
      writePosition(food, happy, health, stock, 0)
    }

    if(stock <= 0 ){
      fill(255)
      text("Refill Stock", 580, 675)
    }

    if(health <= 3){
      if(frameCount % 20 == 0){
         health_war = 255;
      }
      if(frameCount % 41 == 0){
        health_war = '#99b34d';
      }
    } else if(health > 3){
      stock_war = '#99b34d';
    }

    if(happy <= 30){
      if(frameCount % 20 == 0){
         happy_war = 255;
      }
      if(frameCount % 41 == 0){
        happy_war = '#99b34d';
      }
    }else if(happy > 30){
      stock_war = '#99b34d';
    }

    if(food >= 7){
      if(frameCount % 20 == 0){
         hunger_war = 255;
      }
      if(frameCount % 41 == 0){
        hunger_war = '#99b34d';
      }
    }else if(food < 7){
      stock_war = '#99b34d';
    }

    if(stock <= 3){
      if(frameCount % 20 == 0){
         stock_war = 255;
      }
      if(frameCount % 41 == 0){
        stock_war = '#99b34d';
      }
    } else if(stock > 3){
      stock_war = '#99b34d';
    }
    

    if(food > 10 ){
      state = 1;
      msg = "Your puppy got too hungry :-("
    }
    if(happy <= 0){
      state = 1;
      msg = "Your puppy was too sad and ran away :-("
    }
    if(health < 0 ){
      state = 1;
      msg = "Your puppy got bled too much :-("
    }
  } else if(state == 1){
    textAlign(CENTER, CENTER);
    rectMode(CENTER, CENTER);
    textSize(40)
    rect(width/2, height/2, width, 100)
    fill(255)
    text(msg, width/2, height/2 - 20);
    text("PRESS SPACE TO RESTART", width/2, height/2 + 20)
  }
}


function sleep(milliseconds) 
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

function readPosition(data){
  group = data.val();
  food = group['Food'];
  happy = group['Fun'];
  health = group['Health'];
  stock = group['Stock'];
  money = group['Money'];
}

function writePosition(a, b, c, d, e){
  database.ref('/').set({
    'Food' : a,
    'Fun' : b,
    'Health' : c,
    'Money' : e,
    'Stock' : d,
})
}

function keyPressed(){
  if(keyCode == 32){
    writePosition(0, 100, 10, 10, 1000)
    state = 0;
  }

  if(keyCode == 38){
    if(start > 250){
      if(stock > 0){
        writePosition(food - 3, happy, health + 2, stock - 1, money)
        current = 1;
        start = 0;
      }

      temp2 = true;
    } else{
      warning = "Wait for the food to digest!"
      temp = 0
    }

    if(stock <= 0){
      warning = "No more bottles, buy it!"
      temp = 0;
    }

  }

  if(keyCode == 37){
    if(start1 > 500){
      writePosition(food + 2, happy + 30, health - random([0, 1, 1, 2, 2, 2, 3]), stock, money)
      current = 1;
      start = 0;
      start1 = 0;

      temp2 = true;
      temp3 = true;
      bg = 1;
    } else{
      warning = "Let the puppy get his energy back!"
      temp = 0
    }
  }
}

function mousePressed(){
  if(mouseX < 790 && mouseX > 650 && mouseY < 690 && mouseY > 660 && stock < 10){
    if(money <= 160 && money > 79){
      writePosition(food, happy, health, stock + 1, money - 80)
    } else if(money < 80){
      warning = "Not enough money, minimum required is 80!";
      temp = 0
    } else{
      writePosition(food, happy, health, stock + 1, money - random([100, 130, 80, 160]))
    }
  } else if(stock > 9 && mouseX < 790 && mouseX > 650 && mouseY < 690 && mouseY > 660){
    warning = "Too many bottles, use some to get more!";
    temp = 0
  }
}

// width - 150, height - 40, 140, 30
// 800, 700