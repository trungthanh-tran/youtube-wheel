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

p5Wheel.onSelectItem = function(data, selectedKey) {
    selectedText = data[selectedKey] ? data[selectedKey].title || data[selectedKey] : '';
    let url = currentUrl + '/images/000.png';

    if (data[selectedKey] && typeof data[selectedKey].image === 'string') {
        url = currentUrl +'/images'+ data[selectedKey].image;
    }

    if (image.src !== url) {
        image.src = url;
    }
};

const tapmeButton = document.getElementById('item-image');
tapmeButton.addEventListener('click', function() {p5Wheel.guessIt();});

p5Wheel.mouseDragEnable();
p5Wheel.setData(dataSets['coin'], 0);