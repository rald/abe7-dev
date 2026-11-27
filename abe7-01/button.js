ButtonState = {
    UP: "UP",
    OVER: "OVER",
    DOWN: "DOWN",
    FLAG: "FLAG",
    OPEN: "OPEN",
};

Button = function(isPoop,x,y,w,h) {

    this.state=ButtonState.UP;
    this.isPressed = false;
    this.isClicked = false;

    this.isPoop=isPoop;

    this.n=0;
    
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
}

Button.sprites=null;

Button.prototype.draw=function(ctx) {
    switch(this.state) {
        case ButtonState.UP: 
            ctx.drawImage(Button.sprites.cell_up, this.x, this.y, this.w, this.h);
        break;
        case ButtonState.OVER: 
            ctx.drawImage(Button.sprites.cell_up, this.x, this.y, this.w, this.h);
        break;
        case ButtonState.DOWN: 
            ctx.drawImage(Button.sprites.cell_down, this.x, this.y, this.w, this.h);
        break;
        case ButtonState.FLAG: 
            ctx.drawImage(Button.sprites.flag, this.x, this.y, this.w, this.h);
        break;
        case ButtonState.OPEN:
            if(this.isPoop) {
                ctx.drawImage(Button.sprites.poop, this.x, this.y, this.w, this.h);
            } else {
                switch(this.n) {
                    case 0:
                        ctx.drawImage(Button.sprites.num0, this.x, this.y, this.w, this.h);
                    break;
                    case 1:
                        ctx.drawImage(Button.sprites.num1, this.x, this.y, this.w, this.h);
                    break;
                    case 2:
                        ctx.drawImage(Button.sprites.num2, this.x, this.y, this.w, this.h);
                    break;
                    case 3:
                        ctx.drawImage(Button.sprites.num3, this.x, this.y, this.w, this.h);
                    break;
                    case 4:
                        ctx.drawImage(Button.sprites.num4, this.x, this.y, this.w, this.h);
                    break;
                    case 5:
                        ctx.drawImage(Button.sprites.num5, this.x, this.y, this.w, this.h);
                    break;
                    case 6:
                        ctx.drawImage(Button.sprites.num6, this.x, this.y, this.w, this.h);
                    break;
                    case 7:
                        ctx.drawImage(Button.sprites.num7, this.x, this.y, this.w, this.h);
                    break;
                    case 8:
                        ctx.drawImage(Button.sprites.num8, this.x, this.y, this.w, this.h);
                    break;                    
                }
            }
        break;
    }
}

Button.prototype.handleEvents=function(pointer) {

    if(this.state==ButtonState.OPEN) return;

    var isInside = inrect(pointer.x, pointer.y, this.x, this.y, this.w, this.h);
    this.isClicked = false;

    if (pointer.isDown) {
        if (isInside && !this.isPressed && this.state !== ButtonState.DOWN) {
            this.isPressed = true;
        }
        if (this.isPressed && isInside) {
            this.state = ButtonState.DOWN;
        } else {
            this.state = isInside ? ButtonState.OVER : ButtonState.UP;
        }
    } else {
        if (this.isPressed && isInside) {
            this.isClicked = true;
        }
        this.isPressed = false;
        this.state = isInside ? ButtonState.OVER : ButtonState.UP;
    }

}
