
let currentDataSet = 'inventory',
    editedDataSets = {},
    itemsEditedDataSet = null
;
const
    isDebug = new URLSearchParams(document.location.search).get('debug'),
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
    },
    radioClickHandler = function () {
        currentDataSet = this.value;

        if (currentDataSet === 'custom') {
            p5Wheel.mouseDragEnable(false);
            customDialog.style.display = 'block';
            editButton.className = 'hide';

            return;
        }
        else if (currentDataSet === 'items') {
            if (this.getAttribute('data-show-edit-dialog')) {
                editDialog.style.display = 'block';
                p5Wheel.mouseDragEnable(false);
            }

            // if (itemsEditedDataSet) {
            //     editedDataSets[currentDataSet] = itemsEditedDataSet;
            // }
            // else {
                resetEditedDataSet(false);
            // }

            editHeader.textContent = this.nextElementSibling.innerText;
            editPresets.innerHTML = '';
            editOptions.innerHTML = '';
            itemsPresets.forEach((preset, i) => {
                editPresets.append(preset.getDOMNode(currentDataSet, i));
                // preset.renderOptions(editedDataSets[currentDataSet], false);
            });

            // this.parentElement.append(editButton);
            // editButton.className = '';

            return;
        }

        customDialog.style.display = 'none';
        p5Wheel.mouseDragEnable();

        if (presetManager.hasPreset(currentDataSet)) {
            if (!editedDataSets[currentDataSet]) {
                editPresets.innerHTML = '';
                editPresets.append(...presetManager.getNodes(currentDataSet));
            }

            p5Wheel.setData(editedDataToArray());

            editHeader.textContent = this.nextElementSibling.innerText;

            if (this.getAttribute('data-show-edit-dialog')) {
                editButton.dispatchEvent(new Event('click'));
            }
            else {
                this.parentElement.append(editButton);
                editButton.className = '';
            }
        }
        else {
            p5Wheel.setData(dataSets[currentDataSet]);
            editButton.className = 'hide';
        }
    }
;


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
    // if (dataSets[currentDataSet]) {
    //     const imageIndex = dataSets[currentDataSet].indexOf(data[selectedKey]);
    //     if (imageIndex !== -1) {
    //         url = getImageURI(imageIndex);
    //     }
    // }

    if (data[selectedKey] && typeof data[selectedKey].image === 'string') {
        url = currentUrl +'/images'+ data[selectedKey].image;
    }

    if (image.src !== url) {
        image.src = url;
    }
};


p5Wheel.mouseDragEnable();
p5Wheel.setData(dataSets['coin'], 0);