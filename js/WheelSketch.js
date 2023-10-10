function WheelSketch(_p5) {
  const radius = 203,
    diameter = radius * 2,
    itemsPerScreen = 7,
    height_str = diameter / itemsPerScreen,
    counterInitial = 0,
    centerX = 10,
    hasNonprintableChars = (string) =>
      /[^\x00-\x7F\u0410-\u044FЁё]/.test(string),
    startAnimationHandler = function (startAnimation) {
      startAnimation();
    },
    fpsCounter = new FPSCounter(700, 450, 100, 50, _p5);
  let button;
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
    scaleFactor,
    fontRegular,
    mouseDragEnable = true,
    touchYPrev = 0,
    useDefaultFont = false,
    currentRound = 0;
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

  _p5.getSelectedKey = function () {
    return data[selectedKey].title;
  };
  _p5.onAfterSetup = function () {};
  _p5.onNextRound = function () {
    var canv = document.getElementById("countdown-canvas");
    var leaderboard = document.getElementById("leaderboard");
    canv.style.opacity = "0";
    leaderboard.style.opacity = "1";
    leaderClass = new LeaderBoard();
    if (!leaderboard.classList.contains("disappear")) {
      leaderboard.classList.add("disappear");
    }
    leaderClass.renderLeaderShip();
    currentRound = currentRound + 1;
    if (currentRound < data_list.length) {
      setTimeout(function () {
        canv.style.opacity = "1";
        _p5.reloadData(currentRound);
        _p5.playRound();
        leaderClass.clearLeaderboard();
      }, 2000);
    }
  };

  _p5.onSelectItem = function (items, selectedKey) {};
  _p5.triggerSelectItem = function () {
    _p5.onSelectItem(data, selectedKey);
  };

  _p5.preload = () => {
    fontRegular = _p5.loadFont("./fonts/Oswald-Regular.ttf");
    // fontRegular = _p5.loadFont('./fonts/Clickuper/Clickuper.ttf');
  };

  _p5.onStartWheel = (durationSec) => {};
  _p5.onStopWheel = () => {};
  _p5.onMoveWheel = (delta) => {};
  _p5.playRound = () => {
    const background = document.querySelector(".image-grid"),
      videoContainer = document.getElementById("filter-shadow");
    if (!isCounterAnimation) {
      const durationSec = 30,
        totalRows = getTotalRowsForDurationAndSpeed(durationSec, Math.floor(Math.random() * (6 - 2) ) + 2);
      _p5.onStartWheel(durationSec);
      if (player) {
        player.loadVideoById(data_list[currentRound].id);
        player.playVideo();
      }
      var canv = document.getElementById("countdown-canvas");
      const circulation = new Circulation(canv, 30000);
      circulation.startInterval(100);
      const vp = document.querySelector(".video-container");
      vp.style.display = "block";

      array_shuffle(data);
      _p5.triggerSelectItem();

      videoContainer.style.animation = `play-video ${durationSec}s`;
      button.elt.style.visibility = "hidden";
      background.classList = "image-grid animation-paused";
      animate(
        tickCounter,
        counter,
        counter + height_str * totalRows,
        durationSec * 1000,
        () => {
          // background.style.display = null;
          button.elt.style.visibility = null;
          videoContainer.style.animation = null;
          // videoContainer.classList = '';
          background.classList = "image-grid";
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

  _p5.setup = () => {
    counterMax = data.length * height_str;
    const canvas = _p5.createCanvas(800, 500);
    canvas.parent("canvas");
    // _p5.textSize(18);
    _p5.textSize(23);
    _p5.textFont(fontRegular);
    _p5.textLeading(24);
    // _p5.textLeading(18);
    _p5.fill(200);

    circleTop = (_p5.height - diameter) / 2 + _p5.textAscent() / 3;
    circleCenterY = circleTop + radius;
    counter = counterInitial;
    button = _p5.createButton("Join us");
    button.parent(document.querySelector(".content"));
    button.mousePressed(function () {
      _p5.playRound();
      return false;
    });
    _p5.onAfterSetup();
  };

  function getTotalRowsForDurationAndSpeed(
    videoDurationSec = 22,
    speedItemsPerSec = 3
  ) {
    return speedItemsPerSec * videoDurationSec;
  }

  _p5.mouseDragEnable = (state = true) => {
    mouseDragEnable = state;
  };

  _p5.mouseDragged = (event) => {
    if (
      _p5.mouseX > _p5.width ||
      _p5.mouseX < 0 ||
      _p5.mouseY > _p5.height ||
      _p5.mouseY < 0
    ) {
      return;
    }
    if (isCounterAnimation) {
      return;
    }

    if (!mouseDragEnable) {
      return;
    }

    let delta = _p5.movedY * 4;
    if (_p5.movedY === undefined) {
      let diff = _p5.touches[0].y - touchYPrev;
      delta = (diff < 0 ? -1 : diff === 0 ? 0 : 1) * 12;
      touchYPrev = _p5.touches[0].y;
    }

    incrementCounter(delta);

    return false;
  };

  _p5.draw = () => {
    _p5.clear();
    if (isDebug) {
      fpsCounter.draw();
    }

    if (useDefaultFont) {
      _p5.textFont("Georgia");
      _p5.textAlign(_p5.LEFT, _p5.BOTTOM);
    } else {
      _p5.textFont(fontRegular);
    }

    animationsMap.forEach(startAnimationHandler);

    if (counterDelta > 0) {
      if (counter < counterMax) {
        if (!isCounterAnimation) {
          incrementCounter(3);
        }
      } else {
        counter = counterInitial;
      }
    } else {
      if (counter < counterInitial) {
        counter = counterMax;
      }
    }

    let key, i;
    for (i = -data.length - 2; i < itemsPerScreen + 1; i++) {
      let { x, y } = vect(
        counter + height_str * i + radius,
        circleTop,
        circleTop + diameter,
        false
      );

      if (x < 10) {
        continue;
      }

      _p5.push();
      _p5.translate(centerX, circleCenterY);

      scaleFactor = _p5.map(x, centerX, centerX + radius, 1, 1.5, false);
      x = x * (2 - scaleFactor);
      y = y * (2 - scaleFactor);
      _p5.scale(scaleFactor);

      _p5.fill(
        255,
        Math.round(_p5.map(x + 10, centerX, centerX + radius, 0, 255, true))
      );

      key = data_key(data.length, i);

      if (y < _p5.textAscent() / 2 && y > -_p5.textAscent()) {
        //if (!isCounterAnimation) {
        _p5.fill(212, 160, 0);
        //}
        if (key !== selectedKey) {
          selectedKey = key;
          _p5.onSelectItem(data, selectedKey);
        }
      }

      _p5.text(data[key].title, x, y, 450);
      _p5.pop();
    }
  };

  function vect(current, from, to, overflow = true) {
    const offset = -3, // выравниваем центральный элемент списка вертикально по центру
      overallDegrees = _p5.map(
        current + offset,
        from + offset,
        to,
        -90,
        90,
        !overflow
      ),
      v = p5.Vector.fromAngle(_p5.radians(overallDegrees), radius);
    return v;
  }

  function incrementCounter(delta = 1) {
    delta = (_p5.deltaTime / 100) * delta;
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
        } else {
          tickHook(newNum);
        }
      };
    animationsMap.set(`${startNum},${endNum},${durationMs}`, engine);
  }
}
