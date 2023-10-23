'use strict';

let player, timeStamps = [0, 30];
let callback; 
function loadYoutubeIframe(_callback) {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  callback = _callback;
}

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
  callback.playRound();
  e.target.playVideo();
  player.setVolume(20);
  setTimeout(updateDisplay.bind(this, e), 1000);
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

