const p5Wheel = new p5(WheelSketch);

p5Wheel.onAfterSetup = function () {
};



p5Wheel.onStartWheel = (durationSec) => {
};

p5Wheel.onStopWheel = () => {};

let deltas = [];

p5Wheel.onSelectItem = function(data, selectedKey) {
    selectedText = data[selectedKey] ? data[selectedKey].title || data[selectedKey] : '';
};


p5Wheel.mouseDragEnable();
p5Wheel.setData(dataSets['coin'], 0);