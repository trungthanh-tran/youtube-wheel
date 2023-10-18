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



class MorphingText {
	constructor(number) {
	  this.elts = {
		text1: document.getElementById("text1"),
		text2: document.getElementById("text2")
	  };
  
	  this.current = number +1;
	  this.morphTime = 0.75;
	  this.cooldownTime = 0.25;
	  this.time = new Date();
	  this.morph = 0;
	  this.cooldown = this.cooldownTime;
	}
  
	doMorph() {
	  this.morph -= this.cooldown;
	  this.cooldown = 0;
  
	  let fraction = this.morph / this.morphTime;
  
	  if (fraction > 1) {
		this.cooldown = this.cooldownTime;
		fraction = 1;
	  }
  
	  this.setMorph(fraction);
	}
  
	setMorph(fraction) {
	  this.elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	  this.elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  
	  fraction = 1 - fraction;
	  this.elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	  this.elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

	  this.elts.text1.textContent = this.current;
	  this.elts.text2.textContent = this.current - 1;
	}
  
	doCooldown() {
	  this.morph = 0;
  
	  this.elts.text2.style.filter = "";
	  this.elts.text2.style.opacity = "100%";
  
	  this.elts.text1.style.filter = "";
	  this.elts.text1.style.opacity = "0%";
	}
  
	animate() {
	  requestAnimationFrame(() => this.animate());
  
	  let newTime = new Date();
	  let shouldIncrementIndex = this.cooldown > 0;
	  let dt = (newTime - this.time) / 1000;
	  this.time = newTime;
  
	  this.cooldown -= dt;
  
	  if (this.cooldown <= 0) {
		if (shouldIncrementIndex) {
		  this.current--;
		}
		if (this.current < 1) {
		  return;
		}
		this.doMorph();
	  } else {
		this.doCooldown();
	  }
	}
  }