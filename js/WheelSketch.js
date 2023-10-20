function WheelSketch(_p5) {
    const radius = 203,
        diameter = radius * 2,
        itemsPerScreen = 7,
        height_str = diameter / itemsPerScreen,
        counterInitial = 0,
        centerX = 10,
        hasNonprintableChars = string => /[^\x00-\x7F\u0410-\u044FЁё]/.test(string),
        startAnimationHandler = function (startAnimation) {
            startAnimation();
        }
    ;
    let data = [],
        data_list = [],
        counter,
        counterDelta = 0,
        counterMax,
        circleTop,
        circleCenterY,
        animationsMap = new Map(),
        selectedKey,
        isCounterAnimation = false,
        counterPrevTickValue = 0,
        video,
        scaleFactor,
        fontRegular,
        mouseDragEnable = true,
        touchYPrev = 0,
        useDefaultFont = false,
        currentRound = 0
    ;

    _p5.setData = function (_data) {
        // console.log(_data);
        if (!_data.length) {
            _data = [''];
        }
        data = _data.map(v => (typeof v === "object" ? v : {title: v}));

        // If text contains unsupported by external Oswald-Regular characters
        useDefaultFont = hasNonprintableChars(data.map(v => v.title).join());

        counterMax = data.length * height_str;
        counter = counterInitial;
        _p5.triggerSelectItem();
    };

    _p5.setData = function (_data_list, index = 0) {
        data_list = _data_list;
        let _data = _data_list[index].data;
        if (!_data.length) {
          _data = [""];
        }
        data = _data.map((v) => (typeof v === "object" ? v : { title: v }));
        useDefaultFont = hasNonprintableChars(data.map((v) => v.title).join());
    
        counterMax = data.length * height_str;
        counter = counterInitial;
        _p5.triggerSelectItem();
    };

    /**
     * @param {Video} videos
     */
    _p5.setVideo = function (videos) {
        video = videos;
    };

    _p5.onAfterSetup = function() {};

    _p5.onSelectItem = function (items, selectedKey) {};
    _p5.triggerSelectItem = function () {
        _p5.onSelectItem(data, selectedKey);
    };

    _p5.preload = () => {
        fontRegular = _p5.loadFont('./fonts/Oswald-Regular.ttf');
    };

    _p5.onStartWheel = (durationSec) => {};
    _p5.onStopWheel = () => {};
    _p5.onMoveWheel = (delta) => {};

    _p5.setup = () => {
        counterMax = data.length * height_str;

        const canvas = _p5.createCanvas(800, 500);
        canvas.parent('canvas');

        // _p5.textSize(18);
        _p5.textSize(23);
        _p5.textFont(fontRegular);
        _p5.textLeading(24);
        // _p5.textLeading(18);
        _p5.fill(200);

        circleTop = (_p5.height - diameter) / 2 + _p5.textAscent() / 3;
        circleCenterY = circleTop + radius;
        counter = counterInitial;

        button = document.querySelector("#play-btn");
        button.addEventListener("click", function (event) {
          overlay = document.querySelector("#overlay-start");
          overlay.style.display = 'none';
          _p5.playRound();
          return false;
        });

        _p5.onAfterSetup();
    };

    function decreaseVolume(videoDurationSec) {
        const decreasingDuration = 2000;
        setTimeout(function () {
            animate(function (v) {
                video.setVolume(v);
            }, video.volume, 0, decreasingDuration, null, easeLinear);
        }, videoDurationSec * 1000 - decreasingDuration);
    }
    _p5.onNextRound = function () {
        var canv = document.getElementById("countdown-canvas");
        canv.style.display = "none";
    
        //leaderClass.renderLeaderShip();
    
        var overlay = document.createElement("div");
        overlay.id = "overlay";
        document.body.appendChild(overlay);
    
        // Create an SVG element
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "my-svg";
        svg.setAttribute("viewBox", "-500 -500 1000 1000");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("preserveAspectRatio", "xMidYMin slice");
    
        // Create the SVG content
        var svgContent = `
            <defs>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5" result="goo"></feColorMatrix>
                    <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
                </filter>
            </defs>
            <text x="0" y="-30vh" text-anchor="middle" font-size="40" font-family="Overpass Mono, monospace;" fill="white">Ready for the next round</text>
            <g filter="url(#goo)">
                <text x="0" y="10vh">3</text>
                <text x="0" y="10vh">2</text>
                <text x="0" y="10vh">1</text>
                <text x="0" y="10vh">GO</text>
            </g>
        `;
    
        // Set the HTML content of the SVG element
        svg.innerHTML = svgContent;
    
        // Append the SVG element to the body
        document.body.appendChild(svg);
    
        // Show the overlay
        overlay.style.display = "flex";
    
        currentRound = currentRound + 1;
        if (currentRound < data_list.length) {
            animateAndRemoveOverlay();
        } else {
          var leaderboard = document.getElementById("leaderboard");
          leaderboard.style.opacity = "1";
          leaderboard.style.zIndex= 999;
          leaderClass = new LeaderBoard();
          if (!leaderboard.classList.contains("disappear")) {
            leaderboard.classList.add("disappear");
          }
        }
    };
    _p5.playRound = () => {
        const videoContainer = document.getElementById("filter-shadow");
        if (!isCounterAnimation) {
          const durationSec = 30,
            totalRows = getTotalRowsForDurationAndSpeed(
              durationSec,
              Math.floor(Math.random() * (8 - 2)) + 2
            );
          _p5.onStartWheel(durationSec);
          if (player) {
            player.loadVideoById(data_list[currentRound].id);
            player.playVideo();
          }
          const countdownContainer = document.getElementById('countdown-canvas');
          countdownContainer.style.display = "block";

            // Create a loop to generate the countdown elements
            for (let i = 30; i >= 0; i--) {
                const countdownElement = document.createElement('div');
                countdownElement.className = 'n';
                countdownElement.textContent = i;
                countdownContainer.appendChild(countdownElement);
            }
          array_shuffle(data);
          _p5.triggerSelectItem();
    
          videoContainer.style.animation = `play-video ${durationSec}s`;
          const overlaystart = document.querySelector("#overlay-start");
          overlaystart.style.visibility = "hidden";
          animate(
            tickCounter,
            counter,
            counter + height_str * totalRows,
            durationSec * 1000,
            () => {
              // background.style.display = null;
              //button.elt.style.visibility = null;
              videoContainer.style.animation = null;
              animCounterStop();
              _p5.onNextRound();
              alignToRow(() => {
                _p5.onStopWheel();
              });
            },
            easeInOutSine
          );
        }
      };
      _p5.reloadData = function (index) {
        let _data = data_list[index].data;
        if (!_data.length) {
          _data = [""];
        }
        data = _data.map((v) => (typeof v === "object" ? v : { title: v }));
        useDefaultFont = hasNonprintableChars(data.map((v) => v.title).join());
    
        counterMax = data.length * height_str;
        counter = counterInitial;
        _p5.triggerSelectItem();
      };
    function getTotalRowsForDurationAndSpeed(videoDurationSec = 22, speedItemsPerSec = 3) {
        return speedItemsPerSec * videoDurationSec;
    }

    _p5.mouseDragEnable = (state = true) => {
        mouseDragEnable = state;
    };

    _p5.mouseDragged = (event) => {
        if (_p5.mouseX > _p5.width || _p5.mouseX < 0 || _p5.mouseY > _p5.height || _p5.mouseY < 0) {
            return;
        }
        if (isCounterAnimation) {
            return;
        }

        if (!mouseDragEnable) {
            return;
        }

        let delta = _p5.movedY * 4;
        // Для тач-девайсов эта переменная undefined, поэтому вручную считаем направление сдвига
        if (_p5.movedY === undefined) {
            let diff = _p5.touches[0].y - touchYPrev;
            delta = (diff < 0 ? -1 : (diff === 0 ? 0 : 1)) * 12;
            touchYPrev = _p5.touches[0].y;
        }

        incrementCounter(delta);

        return false;
    };

    _p5.draw = () => {
        _p5.clear();
        if (useDefaultFont) {
            _p5.textFont('Georgia');
            _p5.textAlign(_p5.LEFT, _p5.BOTTOM);
        }
        else {
            _p5.textFont(fontRegular);
        }

        animationsMap.forEach(startAnimationHandler);

        if (counterDelta > 0) {
            if (counter < counterMax) {
                if (!isCounterAnimation) {
                    incrementCounter(3);
                }
            }
            else {
                counter = counterInitial;
            }
        }
        else {
            if (counter < counterInitial) {
                counter = counterMax;
            }
        }

        let key, i;
        for (i = -data.length - 2; i < itemsPerScreen + 1; i++) {
            let {x, y} = vect(counter + height_str * i + radius, circleTop, circleTop + diameter, false);

            if (x < 10) {
                continue;
            }

            _p5.push();
            _p5.translate(centerX, circleCenterY);

            scaleFactor = _p5.map(x, centerX, centerX + radius, 1, 1.5, false);
            x = x * (2 - scaleFactor);
            y = y * (2 - scaleFactor);
            _p5.scale(scaleFactor);

            _p5.fill(255, Math.round(_p5.map(x + 10, centerX, centerX + radius, 0, 255, true)));

            key = data_key(data.length, i);

            if (y < _p5.textAscent() / 2
                && y > -_p5.textAscent()
            ) {
                _p5.fill(212, 160, 0);

                if (key !== selectedKey) {
                    selectedKey = key;

                    _p5.onSelectItem(data, selectedKey);
                }
            }

            _p5.text(data[key].title, x, y, 450);
            _p5.pop()
        }
    };

    function animateAndRemoveOverlay() {
        const overlay = document.getElementById('overlay'); // Replace 'overlay' with the actual ID of your overlay element
        const svg = document.getElementById('my-svg'); // Replace 'svg' with the actual ID of your SVG element
        const canv = document.getElementById('countdown-canvas'); // Replace 'canv' with the actual ID of your canvas element
      
        let startTimestamp;
      
        function step(timestamp) {
          if (!startTimestamp) {
            startTimestamp = timestamp;
          }
          const progress = timestamp - startTimestamp;
      
          // Check if 4 seconds (4000 ms) have passed
          if (progress < 4000) {
            // Continue the animation until 4 seconds have passed
            requestAnimationFrame(step);
          } else {
            // 4 seconds have passed, perform your actions
            overlay.style.display = "none";
            overlay.remove();
            svg.remove();
            canv.style.opacity = "1";
            _p5.reloadData(currentRound);
            _p5.playRound();
          }
        }
      
        requestAnimationFrame(step);
      }

    function vect(current, from, to, overflow = true) {
        const offset = -3, // выравниваем центральный элемент списка вертикально по центру
            overallDegrees = _p5.map(current + offset, from + offset, to, -90, 90, !overflow),
            v = p5.Vector.fromAngle(_p5.radians(overallDegrees), radius)
        ;

        // _p5.push();
        // _p5.translate(centerX, _p5.height / 2);
        // _p5.noFill();
        // _p5.stroke(255);
        // _p5.line(0, 0, radius, 0);
        // _p5.stroke(250);
        // _p5.line(0, 0, v.x, v.y);
        // _p5.pop();

        return v;
    }

    function incrementCounter(delta = 1) {
        delta = (_p5.deltaTime / 100 * delta);
        counterDelta = delta;
        counter += delta;

        _p5.onMoveWheel(delta);
    }

    function data_key(data_len, key) {
        if (!data_len) {
            return key;
        }

        if (key >= 0 && key < data_len) {
            return key;
        }

        if (key > 0) {
            return data_key(data_len, Math.abs(data_len - key));
        }

        return data_key(data_len, data_len + key);
    }

    function alignToRow(endCallback) {
        const half = height_str / 2;
        const rest = counter % height_str;
        let newValue = counter - rest;
        if (rest > half) {
            newValue = counter + height_str - rest;
        }
        animate(
            tickCounter,
            counter,
            newValue,
            1000,
            function () {
                animCounterStop();
                if (endCallback) {
                    endCallback();
                }
            },
            easeOutBack
        );
    }

    function tickCounter(v) {
        isCounterAnimation = true;

        if (!counterPrevTickValue) {
            counterPrevTickValue = counter;
        }
        counterDelta = v - counterPrevTickValue;
        counter += counterDelta;
        counterPrevTickValue = v;
    }

    function animCounterStop() {
        isCounterAnimation = false;
        counterDelta = 0;
        counterPrevTickValue = 0;

        // setTimeout(idle, 1000);
    }

    function animate(tickHook, startNum, endNum, durationMs, callback, easingEq) {
        easingEq = easingEq || easeOutExpo;
        const changeInNum = endNum - startNum,
            startTime = Date.now(),
            engine = function () {
                const now = Date.now(),
                    timeSpent = now - startTime,
                    timeNorm = timeSpent / durationMs,
                    completionNorm = easingEq(timeNorm),
                    newNum = startNum + completionNorm * changeInNum;

                if (timeSpent > durationMs) {
                    animationsMap.delete(`${startNum},${endNum},${durationMs}`);
                    if (callback) {
                        callback();
                    }
                }
                else {
                    tickHook(newNum);
                }
            }
        ;

        animationsMap.set(`${startNum},${endNum},${durationMs}`, engine);
    }
}