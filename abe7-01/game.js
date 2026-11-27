GameState = {
    LOAD: "LOAD",
    INIT: "INIT",
    PLAY: "PLAY",
    STOP: "STOP",
    OVER: "OVER",
};

Game = function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = canvas.getContext("2d");

    this.assetsToLoad = [
        { id: 'num0', type: 'image', src: "assets/0.png" },
        { id: 'num1', type: 'image', src: "assets/1.png" },
        { id: 'num2', type: 'image', src: "assets/2.png" },
        { id: 'num3', type: 'image', src: "assets/3.png" },
        { id: 'num4', type: 'image', src: "assets/4.png" },
        { id: 'num5', type: 'image', src: "assets/5.png" },
        { id: 'num6', type: 'image', src: "assets/6.png" },
        { id: 'num7', type: 'image', src: "assets/7.png" },
        { id: 'num8', type: 'image', src: "assets/8.png" },
        { id: 'flag', type: 'image', src: "assets/flag.png" },
        { id: 'poop', type: 'image', src: "assets/poop.png" },
        { id: 'cell_up', type: 'image', src: "assets/cell_up.png" },
        { id: 'cell_down', type: 'image', src: "assets/cell_down.png" },
    ];

    this.currentTime = 0;

    this.score = 0;

    this.state = GameState.LOAD;
    this.handler = new PointerHandler(canvas);

    this.preloadCompleteTime = null;
    this.loadedAssets = {};
    this.itemsLoaded = 0;
    this.totalItems = this.assetsToLoad.length;
    this.currentProgress = 0;
    this.targetProgress = 0;

    this.timeTickInterval=null;

    this.buttons=null;        

    this.boxW=10;
    this.boxH=10;
    this.numPoops=10;
    this.boxLeft=0
    
};

Game.prototype.drawProgressBar = function(percent) {
    Graphics.clrscr(this.ctx, palette[0]);

    var barWidth = 180;
    var barHeight = 16;
    var x = (canvas.width - barWidth) / 2;
    var y = (canvas.height - barHeight) / 2;

    this.ctx.strokeStyle = palette[1];
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, barWidth, barHeight);

    this.ctx.fillStyle = palette[5];
    this.ctx.fillRect(x + 2, y + 2, (barWidth - 4) * percent, barHeight - 4);
};

Game.prototype.onItemLoaded = function(id, assetData) {
    this.loadedAssets[id] = assetData;
    this.itemsLoaded++;
    this.targetProgress = this.itemsLoaded / this.totalItems;
};

Game.prototype.loadTextAsset = function(item) {
    var self = this; // Save reference to Game instance
    var xhr = new XMLHttpRequest();
    xhr.open('GET', item.src, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
                self.onItemLoaded(item.id, xhr.responseText);
            } else {
                console.warn('Missing text file (using fallback): ' + item.src);
                self.onItemLoaded(item.id, null);
            }
        }
    };
    xhr.send();
};

Game.prototype.loadImageAsset = function(item) {
    var self = this; // Save reference to Game instance
    var img = new Image();
    img.onload = function() {
        self.onItemLoaded(item.id, img);
    };
    img.onerror = function() {
        console.warn('Missing image file (using fallback): ' + item.src);
        self.onItemLoaded(item.id, null);
    };
    img.src = item.src;
};

Game.prototype.loadFontAsset = function(item) {
    var self = this; // Save reference to Game instance
    var fontFace = new FontFace(item.family || item.id, 'url(' + item.src + ')');

    fontFace.load().then(function(loadedFace) {
        document.fonts.add(loadedFace);
        self.onItemLoaded(item.id, loadedFace);
    }).catch(function(err) {
        console.warn('Missing or invalid font file (using fallback): ' + item.src, err);
        self.onItemLoaded(item.id, null);
    });
};

Game.prototype.preload = function() {
    this.state = GameState.LOAD;
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.preloadCompleteTime = null;

    if (this.assetsToLoad.length === 0) {
        this.targetProgress = 1.0;
        this.itemsLoaded = 0;
        this.totalItems = 1;
        this.onItemLoaded('dummy', true);
        return;
    }

    for (var i = 0; i < this.assetsToLoad.length; i++) {
        var item = this.assetsToLoad[i];
        if (item.type === 'text') {
            this.loadTextAsset(item);
        } else if (item.type === 'image') {
            this.loadImageAsset(item);
        } else if (item.type === 'font') {
            this.loadFontAsset(item);
        }
    }
};

Game.prototype.timeTick = function() {
    if (this.state === GameState.PLAY) {
        this.currentTime++;
    }
};

Game.prototype.doPreload = function() {
    var diff = this.targetProgress - this.currentProgress;
    this.currentProgress += diff * 0.15;

    if (this.itemsLoaded >= this.totalItems && (this.targetProgress - this.currentProgress < 0.01 || this.currentProgress > 0.99)) {
        this.currentProgress = 1.0;
    }

    this.drawProgressBar(this.currentProgress);

    if (this.currentProgress === 1.0) {
        var now = performance.now();
        if (!this.preloadCompleteTime) {
            this.preloadCompleteTime = now;
        }

        var delayMs = 300;
        if (now - this.preloadCompleteTime >= delayMs) {

            Button.sprites={
                num0: this.loadedAssets.num0,
                num1: this.loadedAssets.num1,
                num2: this.loadedAssets.num2,
                num3: this.loadedAssets.num3,
                num4: this.loadedAssets.num4,
                num5: this.loadedAssets.num5,
                num6: this.loadedAssets.num6,
                num7: this.loadedAssets.num7,
                num8: this.loadedAssets.num8,
                flag: this.loadedAssets.flag,
                poop: this.loadedAssets.poop,
                cell_up: this.loadedAssets.cell_up,
                cell_down: this.loadedAssets.cell_down,
            };

            this.state = GameState.INIT;
        }
    }
}

Game.prototype.doInit = function() {

    var total = this.boxW * this.boxH;
    var poops = [];

    for (var i = 0; i < total; i++) {
        poops.push(i < this.numPoops);
    }

    for (var i = poops.length - 1; i > 0; i--) {
        var j = rnd(i + 1);
        var tmp = poops[i];
        poops[i] = poops[j];
        poops[j] = tmp;
    }

    this.boxLeft=total-this.numPoops;

    this.buttons = [];
    for (var j = 0; j < this.boxH; j++) {
        this.buttons.push([]);
        for (var i = 0; i < this.boxW; i++) {
            var k=j*this.boxW+i;
            this.buttons[j].push(new Button(poops[k], i * 32, j * 32, 32, 32));
        }
    }

    this.state=GameState.PLAY;
}

Game.prototype.openCell = function(y,x) {
    if(x<0 || x>=this.boxW || y<0 || y>=this.boxH) return;
    if(this.buttons[y][x].state==ButtonState.OPEN) return;

    this.buttons[y][x].state=ButtonState.OPEN;
    this.boxLeft--;

    var n=0;
    for(var j=-1; j<=1; j++) {
        for(var i=-1; i<=1; i++) {
            if(i==0 && j==0) continue;
            if(x+i<0 || x+i>=this.boxW || y+j<0 || y+j>=this.boxH) continue;
            if(this.buttons[y+j][x+i].isPoop) n++;
        }
    }

    this.buttons[y][x].n=n;

    if(n!=0) return;

    for(var j=-1; j<=1; j++) {
        for(var i=-1; i<=1; i++) {
            if(i==0 && j==0) continue;
            if(x+i<0 || x+i>=this.boxW || y+j<0 || y+j>=this.boxH) continue;
            if(this.buttons[y+j][x+i].state==ButtonState.OPEN) continue;
            this.openCell(y+j,x+i);
        }
    }

}

Game.prototype.doPlay = function() {
    Graphics.clrscr(this.ctx, palette[10]);

    for (var j = 0; j < this.boxH; j++) {
        for (var i = 0; i < this.boxW; i++) {

            this.buttons[j][i].handleEvents(pointer);
            this.buttons[j][i].draw(this.ctx);

            if(this.buttons[j][i].isClicked && this.buttons[j][i].state!=ButtonState.OPEN) {
                if(this.buttons[j][i].isPoop) {

                    for(var j=0;j<this.boxH;j++) {
                        for(var i=0;i<this.boxW;i++) {
                            if(this.buttons[j][i].isPoop) {
                                this.buttons[j][i].state=ButtonState.OPEN;
                            }
                        }
                    }

                    this.state=GameState.OVER;    
                                        
                } else {
                    this.openCell(j,i);
                    if(this.boxLeft==0) {
                        this.state=GameState.STOP;    
                    }
                }
            }            
        }
    }
}

Game.prototype.doStop = function() {
    Graphics.clrscr(this.ctx,palette[10]);    
    for (var j = 0; j < this.boxH; j++) {
        for (var i = 0; i < this.boxW; i++) {
            this.buttons[j][i].draw(this.ctx);
        }
    }
}

Game.prototype.doOver = function() {
    Graphics.clrscr(this.ctx,palette[10]);    
    for (var j = 0; j < this.boxH; j++) {
        for (var i = 0; i < this.boxW; i++) {
            this.buttons[j][i].draw(this.ctx);
        }
    }
}

Game.prototype.draw = function() {
    var self = this;
    switch (this.state) {
        case GameState.LOAD:
            this.doPreload();
            break;
        case GameState.INIT:
            this.doInit();
            break;
        case GameState.PLAY:
            this.doPlay();
            break;
        case GameState.PLAY:
            this.doPlay();
            break;
        case GameState.OVER:
            this.doOver();
            break;
        default:
            break;
    }
    window.requestAnimationFrame(function() {self.draw();});
};

Game.prototype.setup = function() {
    var self = this;

    this.canvas.width = 320;
    this.canvas.height = 320;

    this.timeTickInterval = setInterval(function() {
        self.timeTick();
    }, 1000);

    this.preload();

    window.requestAnimationFrame(function(){self.draw();});
};

window.onload = function() {
    window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    var game = new Game("canvas");
    game.setup();
};
