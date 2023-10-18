'use strict';

const tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player, timeStamps = [0, 30];

function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-holder', {
    height: '600',
    width: 'auto',
    videoId: '',
    playerVars: {
      'version': 3,
      'controls': 0,
      'start': 0,
      'end': 30,
      'autoplay': 1,
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(e) {
  e.target.playVideo();
  player.setVolume(20);
  setTimeout(updateDisplay.bind(this, e), 1000);
  loopVideo();
}

function loadVideo(videoId) {
  if (player) {
    player.loadVideoById(videoId);
    player.playVideo();
  }
}

function updateDisplay(e) {
  //vp.style.display = 'block';
}


function loopVideo() {
  setTimeout(loopVideo, 0);

  if (player.getCurrentTime() >= timeStamps[1]) {
    player.seekTo(timeStamps[0]);
  }
}

class Circulation {
	constructor(canvas, timer) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.timer = timer;
		this.timeRemaining = 0;
		this.startTime = new Date();
		this.COUNTDOWN =  timer; // 
		this.arc = 0;
		this.intervalId = null; // Store the interval ID
	}
	
	clearScreen() {
		this.ctx.beginPath();
		//this.ctx.fillStyle = 'rgb(0, 0, 0)';
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		//this.ctx.fill();
	}
	
	moveCircle() {
		var now = new Date();
		this.timeElapsed = (this.startTime - now) * -1;
		var percentageElapsed = this.timeElapsed / this.COUNTDOWN;
		
		if (percentageElapsed < 1) {
			this.arc = Math.PI * 2 - (Math.PI * 2 * percentageElapsed);
		}
	}
	
	drawCircle() {
		this.ctx.beginPath();
		this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.height / 3, 0, this.arc, false);
		this.ctx.lineWidth = 15;
		this.ctx.strokeStyle = 'rgb(255, 255, 255)';
		this.ctx.stroke();
	}
	
	updateText() {
		var now = new Date();
		var timeElapsed = (this.startTime - now) * -1;
		
		if (timeElapsed >= this.COUNTDOWN) {
			this.timeRemaining = '0:00';
			clearInterval(this.intervalId);
			} else {
			if (this.COUNTDOWN - timeElapsed < 5000) {
				this.timeRemaining = moment.utc(this.COUNTDOWN - timeElapsed).format('s.S');
				} else {
				this.timeRemaining = moment.utc(this.COUNTDOWN - timeElapsed).format('s');
			}
			
		}
	}
	
	drawText() {
		this.ctx.font = (this.canvas.height / 4) + 'px Arial';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillStyle = 'rgb(255, 255, 255)';
		this.ctx.fillText(this.timeRemaining, this.canvas.width / 2, this.canvas.height / 2);
	}
	
	render() {
		this.clearScreen();
		this.moveCircle();
		this.drawCircle();
		this.updateText();
		this.drawText();
	}
	
	
	startInterval(intervalTime) {
		this.intervalId = setInterval(() => {this.render();}, intervalTime);
	}
	
	stopInterval() {
		clearInterval(this.intervalId);
	}
}
