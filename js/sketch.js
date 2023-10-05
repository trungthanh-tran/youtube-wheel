const vp = document.querySelector('.video-container'),
  tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player, timeStamps = [0, 9.9];

function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    videoId: 'AN3UmL1Lvao',
    playerVars: {
      'version': 3,
      'controls': 0,
      'start': 0,
      'end': 10,
      'modestbranding': 1,
      'autoplay': 1,
      'controls': 1,
      'playsinline': 1
    },
    events: {
      //'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(e) {
  e.target.playVideo();
  e.target.setVolume(20);
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
  vp.style.display = 'block';
}


function loopVideo() {
  // console.log(player.getCurrentTime());
  setTimeout(loopVideo, 0);

  if (player.getCurrentTime() >= timeStamps[1]) {
    player.seekTo(timeStamps[0]);
  }
}
