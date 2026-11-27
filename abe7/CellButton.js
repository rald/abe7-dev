CellButtonState = {
    UP: "UP",
    OVER: "OVER",
    DOWN: "DOWN",
    FLAG: "FLAG",
    OPEN: "OPEN",
};

CellButton = function(isPoop,x,y,w,h) {

    this.state=CellButtonState.UP;
    this.isPressed = false;
    this.isClicked = false;

    this.isPoop=isPoop;

    this.n=0;
    
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
}

CellButton.sprites=null;

CellButton.prototype.draw=function(ctx) {
    switch(this.state) {
        case CellButtonState.UP: 
            ctx.drawImage(CellButton.sprites.cell_up, this.x, this.y, this.w, this.h);
        break;
        case CellButtonState.OVER: 
            ctx.drawImage(CellButton.sprites.cell_up, this.x, this.y, this.w, this.h);
        break;
        case CellButtonState.DOWN: 
            ctx.drawImage(CellButton.sprites.cell_down, this.x, this.y, this.w, this.h);
        break;
        case CellButtonState.FLAG: 
            ctx.drawImage(CellButton.sprites.flag, this.x, this.y, this.w, this.h);
        break;
        case CellButtonState.OPEN:
            if(this.isPoop) {
                ctx.drawImage(CellButton.sprites.poop, this.x, this.y, this.w, this.h);
            } else {
                switch(this.n) {
                    case 0:
                        ctx.drawImage(CellButton.sprites.num0, this.x, this.y, this.w, this.h);
                    break;
                    case 1:
                        ctx.drawImage(CellButton.sprites.num1, this.x, this.y, this.w, this.h);
                    break;
                    case 2:
                        ctx.drawImage(CellButton.sprites.num2, this.x, this.y, this.w, this.h);
                    break;
                    case 3:
                        ctx.drawImage(CellButton.sprites.num3, this.x, this.y, this.w, this.h);
                    break;
                    case 4:
                        ctx.drawImage(CellButton.sprites.num4, this.x, this.y, this.w, this.h);
                    break;
                    case 5:
                        ctx.drawImage(CellButton.sprites.num5, this.x, this.y, this.w, this.h);
                    break;
                    case 6:
                        ctx.drawImage(CellButton.sprites.num6, this.x, this.y, this.w, this.h);
                    break;
                    case 7:
                        ctx.drawImage(CellButton.sprites.num7, this.x, this.y, this.w, this.h);
                    break;
                    case 8:
                        ctx.drawImage(CellButton.sprites.num8, this.x, this.y, this.w, this.h);
                    break;                    
                }
            }
        break;
    }
}

CellButton.prototype.handleEvents=function(pointer) {

    if(this.state==CellButtonState.OPEN) return;

    var isInside = inrect(pointer.x, pointer.y, this.x, this.y, this.w, this.h);
    this.isClicked = false;

    if (pointer.isDown) {
        if (isInside && !this.isPressed && this.state !== CellButtonState.DOWN) {
            this.isPressed = true;
        }
        if (this.isPressed && isInside) {
            this.state = CellButtonState.DOWN;
        } else {
            this.state = isInside ? CellButtonState.OVER : CellButtonState.UP;
        }
    } else {
        if (this.isPressed && isInside) {
            this.isClicked = true;
        }
        this.isPressed = false;
        this.state = isInside ? CellButtonState.OVER : CellButtonState.UP;
    }

}
