// Created by Om Kumar

let pos, vel;
let speed = 5;
let rad = 4;
let radSq = rad* rad;
let bar;

let bricks = [];

let magnet = true;
let gameOver = false;
function setup(){
    createCanvas(displayWidth - 16, displayHeight - 300);
    reset();
}
function reset(){
    magnet = true;
    gameOver = false;
    bricks.splice(0, bricks.length -1);
    vel = createVector(1,-1);
    vel.normalize();
    vel.mult(speed);
    
    bar = {
        cx : width /2,
        cy : height - 8,
        w : 70,
        h : 8,
    }
    
    pos = createVector(bar.cx + 20,bar.cy - bar.h /2 - rad);
    for(let y = 1; y < 27; y++){
        if(y > 3 && y < 20 && random(10) < 4){
            continue;
        }
        if(y == 20) continue;
        for(let x = 16; x <= width - 16; x+=24)  {   
            if(y > 1 && x > width/2 && x < width * 0.75) continue ;
            if(y > 1 && random(10) < 5) continue;
            bricks.push({
            x:x,
            y:y*12,
            col : randomColor()
            });
        }
    }
}
function randomColor(){
    return color(random255(), random255(), random255());
}
function random255(){
    return (floor(random(6)) + 3) * 32 -1;
}
function draw(){
    if(gameOver) return;
    rectMode(CORNER);
    clear();
    //fill('#880E4F');
    fill(32)
    stroke(255);
    rect(0,0, width, height, bar.h);
    fill(255);
    if(!magnet){
        vel.normalize();
       for(let i = 0; i < speed; i++){
           pos.add(vel);
       for(let i = bricks.length-1; i > -1; i--){
            let b = bricks[i];
            overlaps(b, pos, i);
        }
       }
    }
    
    ellipse(pos.x, pos.y, 2*rad, 2*rad);
    let lcx = bar.cx;
    bar.cx = constrain(bar.cx + (mouseX - pmouseX)*2, bar.w/2 + 4, width - bar.w/2 - 4);
    if(magnet){
        pos.x += bar.cx - lcx;
    }
    if(pos.x > width - rad || pos.x < rad){
        vel.x = -vel.x;
    }
    if(pos.y < rad){
        vel.y = abs(vel.y);
    } else
    if(pos.y > bar.cy - bar.h /2 - rad && pos.y < bar.cy && abs(pos.x - bar.cx) < bar.w /2){
        // vel.y = -abs(vel.y);
        let dx = pos.x - bar.cx;
        let rat = (dx * 2.0) / bar.w;
        let angle = acos(rat);
        vel.rotate(-vel.heading() - angle);
    }
    
    rectMode(CENTER);
    for(let b of bricks ){
        fill(b.col);
        rect(b.x, b.y, 24, 12);
    }
    fill(255);
    stroke(255);
    rect(bar.cx, bar.cy, bar.w, bar.h, bar.h);
    if(pos.y > height + 20*abs(vel.y)){
        rectMode(CORNER);
        noStroke();
        fill(0,200);
        rect(0,0,width, height, bar.h);
        fill(255);
        textSize(40);
        textAlign(CENTER);
        text("GAME OVER", width / 2, height / 2 - 20);
        textSize(16);
        text("Made by Shubham Goswami", width / 2, height/2 +20)
        textSize(14);
        text("Tap to play again", width/2, height - 50);
        gameOver = true;
    }
    if(magnet){
        textAlign(CENTER);
        textSize(14);
        fill(255, 100);
        noStroke();
        text("Tap to start",(bar.cx - width/2)*0.2+width/2, height - 100);
    }
    if(bricks.length == 0){
        rectMode(CORNER);
        noStroke();
        fill(0,200);
        rect(0,0,width, height, bar.h);
        fill(255);
        textSize(40);
        textAlign(CENTER);
        text("YOU WON", width / 2, height / 2 - 20);
        textSize(16);
        text("Made by Shubham Goswami", width / 2, height/2 +20)
        
        textSize(14);
        text("Tap to play again", width/2, height - 50);
        gameOver = true;
    }
}
let mpx, mpy;
function bounceFromCorner(x, y, p){
    print("bounce");
    let n = createVector(x, y);
    n.sub(p);
    vel.rotate(-vel.heading());
    vel.rotate(-n.heading());
    //vel.setMag(speed);
}
function overlaps(r, p, i){ // r = rect, p = ball & rad
    const dx = p.x - r.x;
    const dy = p.y - r.y;
    /*
    if(distSq(r.x + 12,r.y+6, p.x, p.y) < rad){
        bounceFromCorner(r.x + 12, r.y + 6);     
        bricks.splice(i, 1);
        return true;
        }else if(distSq(r.x + 12,r.y-6, p.x, p.y) < rad){
            bounceFromCorner(r.x + 12, r.y - 6);       
            bricks.splice(i, 1);
            return true;
        }else if(distSq(r.x - 12,r.y+6, p.x, p.y) < rad){
            bounceFromCorner(r.x - 12, r.y + 6);       
            bricks.splice(i, 1);
            return true;
        }else if(distSq(r.x - 12,r.y-6, p.x, p.y) < rad){
            bounceFromCorner(r.x - 12, r.y - 6);      
            bricks.splice(i, 1);
            return true;
        }else
    */
    if(abs(dx) < 12){
        if(dy < 6 + rad && dy > 6){
            bricks.splice(i, 1);
            vel.y = -vel.y;
            return true;
        }
        if(dy > -6 - rad && dy < -6){
            bricks.splice(i, 1);
            vel.y = -vel.y;
            return true;
        }
    }else
    if(abs(dy) < 6){ // collision may be L/R
        if(dx < 12 + rad && dx > 12){
            bricks.splice(i, 1);
            vel.x = -vel.x;
            return true;
        }
        if(dx > -12 - rad && dx < -12){
            bricks.splice(i, 1);
            vel.x = -vel.x;
            return true;
        }
    }
}
function distSq(x1,y1, x2, y2){
    return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}
function mousePressed(){
   mpx = mouseX;
   mpy = mouseY;
}

let skipTap = 1;

function mouseReleased(){
    if(skipTap > 0) {
        skipTap--;
        return;
    }
    if(gameOver || (magnet && abs(mpx - mouseX) < 2 && abs(mpy - mouseY) < 2)){
        if(gameOver){
            reset();
            skipTap = 2;
        }else{
            let dx = pos.x - bar.cx;
            let rat = (dx * 2.0) / bar.w;
            let angle = acos(rat);
            vel.rotate(-vel.heading() - angle);
            magnet = false;
        }
    }
}