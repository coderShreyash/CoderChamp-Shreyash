function preload(){

// Load All Sounds
 bg=loadImage("bg.jpg");
 IronManImg=loadImage("Iron.png");
 stoneI=loadImage("stone.png");
 diamondI=loadImage("diamond.png");
 spikeI=loadImage("thief.png");
 reImg=loadImage("rest.png");
 startImg = loadImage("start.png");
 boosterImg = loadImage("booster.png");
 shieldImg = loadImage("shield.png");
 shiel = loadImage("sh.png");
}

var click = new Audio("click.mp3");
var backlin = new Audio("music.mp3");
var coin = new Audio("coin.mp3");
var rob = new Audio("rob.mp3");
var wind = new Audio("boost.mp3")

function setup(){
     
    //Create the canvas
    createCanvas(1200,600);

    //Create Background
    back=createSprite(600,300,1200,600);
    back.addImage(bg);

    //Gamestate
    gameState="wait";
  
    
    booste = false;
    shielden = false;

    //Create Start Button
    start = createSprite(600,250,200,50);
    start.addImage(startImg);
    start.scale=0.7;

    //Create Restart Button
    restart = createSprite(600,250,200,50);
    restart.addImage(reImg);
    restart.scale=0.675;
    restart.visible=false;

    //Create Iron Man and Adjust Image
    IronMan=createSprite(random(300,700),450,80,200);
    IronMan.addImage(IronManImg);
    IronMan.scale=0.25;
    IronMan.setCollider("rectangle",20,0,250,850);

     //Create Shield
     shieldon = createSprite(IronMan.x,IronMan.y,200,50);
     shieldon.addImage(shiel);
     shieldon.scale=0.675;
     shieldon.visible=false;
    
    //Creating Groups
    stones=new Group();
    spikes=new Group();
    diamonds=new Group();
    boosters=new Group();
    shields=new Group();

    //Create all edges
    edges=createEdgeSprites();

    //Initializing Score to 0 
    Score=100;

}

function draw(){

//Make background and draw all Sprites
background(0);
drawSprites();

//Display Scores with all styles
textSize(40);
strokeWeight(2.5);
stroke("crimson") 
fill("whitesmoke")
text("Diamonds 💎💎💎: "+Score,700,60); 
text("Boost  : "+booste,15,60); 
text("Shield : "+shielden,355,60); 

//Making Shield
shieldon.x=IronMan.x;
shieldon.y=IronMan.y;

//Starting The Game 
if(gameState === "wait"){
    if(mousePressedOver(start)){
        gameState="play";
        backlin.volume=0.1;
        backlin.play();
        start.visible = false;
        click.play();
    }
}
    if(gameState==="play")
{
    if(booste===false){
back.velocityY=5+(0.0045*frameCount);
    }
  else if(booste===true){
    back.velocityY=6+(0.0125*frameCount);
    setTimeout(function(){booste=false},8500)
    }  
if(shielden===true){
    shieldon.visible=true;
    setTimeout(function(){shielden=false;shieldon.visible=false;},15000)
}
//Make Scrollable background from top to bottom
if(back.y>1000){
    back.y=400;
}

//Original Speed
if(booste===false){
//Make Iron Man Move up Using up arrow
if(keyDown("up")){
    IronMan.velocityY=-10;
}

//Make Iron Man Move left Using left arrow
if(keyDown("left")){
    IronMan.velocityX=-6;
    IronMan.velocityY=0;
}

//Make Iron Man Move right Using right arrow
if(keyDown("right")){
    IronMan.velocityX=6;
    IronMan.velocityY=0;
}
}
//Speed While Booster Is On
else if (booste=true){
    if(keyDown("up")){
        IronMan.velocityY=-20;
    }
    
    //Make Iron Man Move left Using left arrow
    if(keyDown("left")){
        IronMan.velocityX=-12;
        IronMan.velocityY=0;
    }
    
    //Make Iron Man Move right Using right arrow
    if(keyDown("right")){
        IronMan.velocityX=12;
        IronMan.velocityY=0;
    }
}
//Make Iron Man Bounce off edges and Give Gravity
IronMan.bounceOff(edges)
IronMan.velocityY+=0.275;

//Colliding Iron Man With Stones(Whole of the Stone Group)
for(var s=0;s<stones.length;s++){
    currentStone=stones[s];
    currentStone.collide(IronMan);  
    }

//Check For Collecting Diamonds
for(var d=0;d<diamonds.length;d++){
    currentDiamond=diamonds[d];
    if(IronMan.isTouching(currentDiamond)){
    Score+=Math.round(random(50,100));
    currentDiamond.destroy();
    coin.play();
    }
}

//Check For Spikes Colliding With Iron Man
for(var p=0;p<spikes.length;p++){
    currentSpike=spikes[p];
    if(IronMan.isTouching(currentSpike)&&shielden==false){
    Score-=Math.round(random(50,100));
    rob.play();
    currentSpike.destroy();
    }
    //If Shield Is On Then, Don't Do Damage 
    else if(IronMan.isTouching(currentSpike)&&shielden==true){
        currentSpike.destroy();
    }
}
//Check If Booster Is Touched
for(var b=0;b<boosters.length;b++){
    curbos=boosters[b];
    if(IronMan.isTouching(curbos)){ 
    booste = true; 
    wind.play();
    curbos.destroy(); 
    }
}

//Check If Shield Is Touched
for(var h=0;h<shields.length;h++){
    curse=shields[h];
    if(IronMan.isTouching(curse)){ 
    shielden = true; 
    curse.destroy(); 
    }
}

//Generate Stones And Add Them To Stones Group
if(frameCount%60==0){
    stone=createSprite(random(100,1100),-100,150,30);
    stone.addImage(stoneI);
    stone.lifetime=200;
    stone.scale=0.1;
    stone.velocityY=back.velocityY;
    stones.add(stone);
}

//Generate Diamonds And Add Them To Diamonds Group
if(frameCount%80==0){
    diamond=createSprite(random(250,800),-100,50,50);
    diamond.addImage(diamondI);
    diamond.lifetime=200;
    diamond.scale=0.25;
    diamond.velocityY=back.velocityY;
    diamonds.add(diamond);
}
 
//Generate Spikes And Add Them To Stones Group
if(frameCount%50==0){
    spike=createSprite(random(150,1100),-100,100,100);
    spike.addImage(spikeI);
    spike.lifetime=200;
    spike.scale=0.175;
    spike.velocityY=back.velocityY;
    spikes.add(spike);
}

//Generate Booster and add them to Booster's Group
if(frameCount%1200==0){
    boost=createSprite(random(150,1100),-100,100,100);
    boost.addImage(boosterImg);
    boost.lifetime=200;
    boost.scale=0.275;
    boost.velocityY=back.velocityY-2;
    boosters.add(boost);
}

//Generate Shields And Add Them to Sheild's Group
if(frameCount%800==0){
    shield=createSprite(random(150,1100),-100,100,100);
    shield.addImage(shieldImg);
    shield.lifetime=200;
    shield.scale=0.45;
    shield.velocityY=back.velocityY-2;
    shields.add(shield);
}

//End The Game 
if(Score<0){
    gameState="end";
    }
}

//Do This When Game Ends
else if(gameState==="end"){
back.velocityY=0;
booste=false;

//Making Everything Stop
spikes.setLifetimeEach(-1);
diamonds.setLifetimeEach(-1);
stones.setLifetimeEach(-1);
boosters.setLifetimeEach(-1);
spikes.setVelocityYEach(0);
boosters.setVelocityYEach(0);
diamonds.setVelocityYEach(0);
stones.setVelocityYEach(0);
IronMan.velocityY=0;
IronMan.velocityX=0;
textSize(50)
text("So Sad To Tell, You Lost 😥😥😥",275,200);
restart.visible=true;
IronMan.x=580;
IronMan.y=420;

//Restart When Mouse Is Pressed Over It
if(mousePressedOver(restart)){
    restart.visible=false;
    diamonds.destroyEach();
    spikes.destroyEach();
    stones.destroyEach();
    boosters.destroyEach();
    gameState="play";
    frameCount=0;
    Score=100;
    click.play();
  }
}
}