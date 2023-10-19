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
      'loading': 'lazy',
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