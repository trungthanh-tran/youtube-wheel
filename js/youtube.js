'use strict';

let player, timeStamps = [0, 30];
let callback; 
function loadYoutubeIframe(id) {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  callback = id;
}

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
  var preloader = document.getElementById("preloader");
  preloader.classList.add("loaded");
  if (player) {
    player.cueVideoById(callback, 0, 30);
    //player.playVideo();
  }
  setTimeout(function() {
    // Apply the "fadeOut" effect
    preloader.style.transition = "opacity 0.5s"; // Define a transition for fading
    preloader.style.opacity = 0; // Set opacity to 0 for fading
  
    // Optionally, hide the element when the fade-out is complete
    preloader.addEventListener("transitionend", function() {
      preloader.style.display = "none";
    });
  }, 800);
  //callback.playRound();
  //e.target.playVideo();
  //player.setVolume(20);
}

function loadVideo(videoId) {
  if (player) {
    player.cueVideoById(videoId, 0, 30);
    //player.playVideo();
  }
}

function updateDisplay(e) {
  //vp.style.display = 'block';
}

