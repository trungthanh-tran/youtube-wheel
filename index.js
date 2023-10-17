
let currentDataSet = 'inventory',
    editedDataSets = {},
    itemsEditedDataSet = null
;
const
    isDebug = new URLSearchParams(document.location.search).get('debug'),
    editDialog = document.getElementById('dialog-edit'),
    presetManager = new PresetManager,
    itemsPresets = [
        new PresetGroup('Уровень 1'),
        new PresetItems("Голова", subSets.items["Уровень 1"]["Голова"]),
        new PresetItems("Тело", subSets.items["Уровень 1"]["Тело"]),
        new PresetItems("Оружие", subSets.items["Уровень 1"]["Оружие"]),
        new PresetItems("Ноги", subSets.items["Уровень 1"]["Ноги"]),
        new PresetItems("Аксессуар", subSets.items["Уровень 1"]["Аксессуар"]),
        new PresetGroup('Уровень 2'),
        new PresetItems("Голова", subSets.items["Уровень 2"]["Голова"]),
        new PresetItems("Тело", subSets.items["Уровень 2"]["Тело"]),
        new PresetItems("Оружие", subSets.items["Уровень 2"]["Оружие"]),
        new PresetItems("Ноги", subSets.items["Уровень 2"]["Ноги"]),
        new PresetItems("Аксессуар", subSets.items["Уровень 2"]["Аксессуар"]),
        new PresetGroup('Уровень 3'),
        new PresetItems("Голова", subSets.items["Уровень 3"]["Голова"]),
        new PresetItems("Тело", subSets.items["Уровень 3"]["Тело"]),
        new PresetItems("Оружие", subSets.items["Уровень 3"]["Оружие"]),
        new PresetItems("Ноги", subSets.items["Уровень 3"]["Ноги"]),
        new PresetItems("Аксессуар", subSets.items["Уровень 3"]["Аксессуар"]),
    ],
    optionClick = function (option, checked) {
        option = decodeURIComponent(option);
        editedDataSets[currentDataSet][option] = checked;
    },
    resetEditedDataSet = function (toState = true) {
        editedDataSets[currentDataSet] = Object.fromEntries(
            dataSets[currentDataSet]
                .map(v => v)
                .sort((a, b) => (a.title || a).localeCompare(b.title || b))
                .map(v => [v.title || v, toState])
        );
    },
    editedDataToArray = function () {
        let result = [];

        for (let [key, value] of Object.entries(editedDataSets[currentDataSet])) {
            if (value) {
                for (let i = 0; i < dataSets[currentDataSet].length; i++) {
                    if ((dataSets[currentDataSet][i].title || dataSets[currentDataSet][i]) === key) {
                        result.push(dataSets[currentDataSet][i])
                    }
                }
            }
        }

        return result;
    };

const p5Wheel = new p5(WheelSketch);

const image = document.querySelector('#item-image img');
let currentUrl = window.location.href;
currentUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));

const p5ImagePlayer = new p5(GifPlayer);

p5Wheel.onStartWheel = (durationSec) => {
    if (currentDataSet === 'meetings' || currentDataSet === 'custom' || currentDataSet === 'pvp') {
        p5ImagePlayer.onStartWheel(durationSec);
    }
};

let selectedText = '', lastSelectedText = '';


let deltas = [];
setInterval(() => {
    if (currentDataSet === 'meetings' || currentDataSet === 'custom' || currentDataSet === 'pvp') {

        let max = deltas.reduce(function(a, b) {
            return Math.max(a, b);
        }, 0);
        deltas = [];

    }
    else {
       
    }
}, 300);

p5Wheel.onMoveWheel = (delta) => {
    if (currentDataSet === 'meetings' || currentDataSet === 'custom' || currentDataSet === 'pvp') {
        deltas.push(Math.abs(delta));
    }
};

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
tapmeButton.addEventListener('click', function() {alert(p5Wheel.getSelectedKey())});


p5Wheel.mouseDragEnable();
p5Wheel.setData(dataSets['coin'], 0);
