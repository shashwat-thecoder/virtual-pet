class Dog{
    constructor(){}

    changeBg(img){
        bg = img;
    }

    update(state){
        database.ref('/').set({
            gameState : gameState
        })
    }

    alive(min, max, val, messg){
        if(val > max || val < min ){
            gameState = 1;
            msg = messg;
        }
    }

    constraint(min, max, val){
        let returnVal = val;
        val < min ? returnVal = min : val > max ? returnVal = max : 0;
        return returnVal;
    }

    blinking(min, max, index){
        let val = properties[index];

        val <= min || val >= max ? fill(255) : fill('#99b34d');
        stroke(4)
        rect(300, 480 + index*40, 205, 40)
    }

    feed(){
        if(stock > 0){
            writePosition(hunger - 3, happy + 10, health + 2, stock - 1, money, frameCheck.main)
            dogIndex = 1;
            frameCheck.eat = 0;
            temporary.third = true;
            instances++;
        }

        temporary.first = true;
      
        if(stock <= 0){
            this.msg("No more bottles, buy it!");
        }
    }

    play(){
        if(frameCheck.play > 500){
            writePosition(hunger + 1, happy + 30, health - random([0, 0, 1, 2, 2, 2, 3]), stock, money, frameCheck.main)

            frameCheck.play = 0;
            frameCheck.eat = 0;
      
            temporary.first = true;
            temporary.second = true;

            bg = garden;
            running = true;

          } else{
            this.msg("Let the puppy get his energy back!");
          }
    }

    reset(){
        writePosition(0, 100, 10, 10, 1000, 0);
        //Hunger, Happy, Health, Stock, Money, Time
        bg = house
        gameState = -1;
    }

    msg(txt){
        warning = txt;
        frameCheck.msg = 0;
    }
    
}