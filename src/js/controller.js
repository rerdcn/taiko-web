function Controller(selectedSong, songData){
    
    var _this = this;
	var _backgroundURL = "/songs/"+selectedSong.folder+"/bg.png";
	
	var _songParser = new ParseSong(songData); //get file content
	var _songData = _songParser.getData();
	
    var _game = new Game(this, selectedSong, _songData);
    var _view = new View(this, _backgroundURL);
    var _keyboard = new Keyboard(this);
    var _mainLoop;
    var _pauseMenu = false;
    
    this.run = function(){
		
		_this.loadUIEvents();
        _game.run();
		_view.run();
		_this.startMainLoop();
    }
	
	this.loadUIEvents = function(){
		$("#song-selection-butt").click(function(){
			_this.songSelection();
		});
		$("#restart-butt").click(function(){
			_this.restartSong();
		});
	}
    
    this.startMainLoop = function(){
        
        var started=false;
        _mainLoop = setInterval(function(){
            
            var ms = _game.getEllapsedTime().ms;
            if(ms<0){ //before starting game, offseting the circles
                _game.updateTime();
				_view.refresh();
            }
            else if(ms>=0 && !started){ //when music starts
                assets.sounds["main-music"].play();
                started=true;
            }
            
            if(started){ //Game start here
                if(!_game.isPaused()){
                    _game.update();
					_view.refresh();
                    _keyboard.checkGameKeys();
                }
                _keyboard.checkMenuKeys();
            }
            
        }, 20);
        
    }
	
	this.getDistanceForCircle = function(){
		return _view.getDistanceForCircle();
	}
    
    this.togglePauseMenu = function(){
        _this.togglePause();
        _view.togglePauseMenu();
    }
    
    this.displayResults = function(){
        clearInterval(_mainLoop);
        var scoresheet = new Scoresheet(_this, _this.getGlobalScore());
        scoresheet.run();
    }

    this.displayScore = function(score, notPlayed){
        _view.displayScore(score, notPlayed);
    }
    
    this.fadeOutOver = function(){
        _game.fadeOutOver();
        _this.displayResults();
    }
    
    this.getCurrentTimingPoint = function(){
        return _game.getCurrentTimingPoint();
    }
    
    this.songSelection = function(){
		$("#main-music").remove();
		$("#music-bg").remove();
        clearInterval(_mainLoop);
        new SongSelect();
    }
    
    this.restartSong = function(){
		_game.pauseSound("main-music", true);
		clearInterval(_mainLoop);
		//songData.circles.forEach(function(circle){
		$("#screen").load("/src/views/game.html", function(){
			var taikoGame = new Controller(selectedSong, songData);
			taikoGame.run();
		});
    }
    
    this.playSound = function(soundID){
        _game.playSound(soundID);
    }
    
    this.pauseSound = function(soundID, stop){
        _game.pauseSound(soundID, stop);
    }
    
    this.initTiming = function(){
        _game.initTiming();
    }
    
    this.setHitcircleSpeed = function(speed){
        _view.setHitcircleSpeed(speed);
    }
    
    this.getHitcircleSpeed = function(){
        return _game.getHitcircleSpeed();
    }
    
    this.toggleMainMusic = function(){
        _game.toggleMainMusic();
    }
    
    this.togglePause = function(){
        _game.togglePause();
    }
    
    this.isPaused = function(){
        return _game.isPaused();
    }
    
    this.getKeys = function(){
        return _keyboard.getKeys();
    }
    
    this.getSongData = function(){
        return _game.getSongData();
    }
    
    this.getEllapsedTime = function(){
        return _game.getEllapsedTime();
    }
    
    this.getCircles = function(){
        return _game.getCircles();
    }
    
    this.getCurrentCircle = function(){
        return _game.getCurrentCircle();
    }
    
    this.updateCurrentCircle = function(){
        _game.updateCurrentCircle();
    }
    
    this.isWaitingForKeyup = function(key, type){
        return _keyboard.isWaitingForKeyup(key, type);
    }
    
    this.waitForKeyup = function(key, type){
        _keyboard.waitForKeyup(key, type);
    }
    
    this.updateCombo = function(score){
        _game.updateCombo(score);
    }
    
    this.getCombo = function(){
        return _game.getCombo();
    }
    
    this.getGlobalScore = function(){
        return _game.getGlobalScore();
    }
    
    this.updateGlobalScore = function(score){
        _game.updateGlobalScore(score);
    }
    
}