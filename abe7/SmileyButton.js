SmileyButtonState = {
    UP: "UP",
    OVER: "OVER",
    DOWN: "DOWN",
};

SmileyButton = function(x,y,w,h) {

    this.state=SmileyButtonState.UP;
    this.isPressed = false;
    this.isClicked = false;

    this.n=1;

    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
}

SmileyButton.sprites=null;

SmileyButton.prototype.draw=function(ctx) {
    switch(this.state) {
        case SmileyButtonState.UP: 
        case SmileyButtonState.OVER: 
            switch(this.n) {
                case 1:
                    ctx.drawImage(SmileyButton.sprites.smiley1, this.x, this.y, this.w, this.h);  
                break;
                case 2:
                    ctx.drawImage(SmileyButton.sprites.smiley2, this.x, this.y, this.w, this.h);  
                break;
                case 3:
                    ctx.drawImage(SmileyButton.sprites.smiley3, this.x, this.y, this.w, this.h);  
                break;
                case 4:
                    ctx.drawImage(SmileyButton.sprites.smiley4, this.x, this.y, this.w, this.h);  
                break;
            }

        break;
        case SmileyButtonState.DOWN: 
            ctx.drawImage(SmileyButton.sprites.smiley0, this.x, this.y, this.w, this.h);
        break;
    }
}

SmileyButton.prototype.handleEvents=function(pointer) {

    if(this.state==SmileyButtonState.OPEN) return;

    var isInside = inrect(pointer.x, pointer.y, this.x, this.y, this.w, this.h);
    this.isClicked = false;

    if (pointer.isDown) {
        if (isInside && !this.isPressed && this.state !== SmileyButtonState.DOWN) {
            this.isPressed = true;
        }
        if (this.isPressed && isInside) {
            this.state = SmileyButtonState.DOWN;
        } else {
            this.state = isInside ? SmileyButtonState.OVER : SmileyButtonState.UP;
        }
    } else {
        if (this.isPressed && isInside) {
            this.isClicked = true;
        }
        this.isPressed = false;
        this.state = isInside ? SmileyButtonState.OVER : SmileyButtonState.UP;
    }

}
