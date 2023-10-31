const p5Wheel = new p5(WheelSketch);

p5Wheel.onAfterSetup = function () {
};
const image = document.querySelector('#item-image img');
let currentUrl = window.location.href;
currentUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
p5Wheel.onStartWheel = (durationSec) => {
};

p5Wheel.onStopWheel = () => {};

let deltas = [];

p5Wheel.onSelectItem = function(theme_images, selectedKey) {
    let url = theme_images[Math.floor(Math.random()*theme_images.length)];
    if (url && image.src !== url) {
        image.src = url;
    }
};

const tapmeButton = document.getElementById('item-image');
tapmeButton.addEventListener('click', function() {p5Wheel.guessIt();});

p5Wheel.mouseDragEnable();