function WheelSketch(_p5) {
  const radius = 203,
    endpoint = "https://backend.spincoin.xyz",
    diameter = radius * 2,
    itemsPerScreen = 7,
    height_str = diameter / itemsPerScreen,
    counterInitial = 0,
    centerX = 10,
    hasNonprintableChars = (string) =>
      /[^\x00-\x7F\u0410-\u044FЁё]/.test(string),
    startAnimationHandler = function (startAnimation) {
      startAnimation();
    };
  let data = [],
    messages = [], // Display keypress
    messageDisplayDuration = 1000, // display time
    wheelTextSize = 20,
    lastKeyPressTime = 0,
    data_list = [],
    theme_images = [],
    counter,
    counterDelta = 0,
    counterMax,
    circleTop,
    theme,
    circleCenterY,
    animationsMap = new Map(),
    selectedKey,
    isCounterAnimation = false,
    counterPrevTickValue = 0,
    video,
    scaleFactor,
    fontRegular,
    mouseDragEnable = true,
    loadedData = false;
    touchYPrev = 0,
    useDefaultFont = false,
    currentRound = 0,
    question_X = 0,
    currentQuestion = "";
  _p5.setData = function (_data) {
    // console.log(_data);
    if (!_data.length) {
      _data = [""];
    }
    data = _data.map((v) => (typeof v === "object" ? v : { title: v }));

    // If text contains unsupported by external Oswald-Regular characters
    useDefaultFont = hasNonprintableChars(data.map((v) => v.title).join());

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

  _p5.onAfterSetup = function () {};

  _p5.onSelectItem = function (theme_images, selectedKey) {};
  _p5.triggerSelectItem = function () {
    _p5.onSelectItem(theme_images, selectedKey);
  };

  _p5.preload = () => {
    fontRegular = _p5.loadFont("./fonts/Oswald-Regular.ttf");
  };

  _p5.onStartWheel = (durationSec) => {};
  _p5.onStopWheel = () => {};
  _p5.onMoveWheel = (delta) => {};

  _p5.setup = () => {
    counterMax = data.length * height_str;

    const canvas = _p5.createCanvas(800, 500);
    canvas.parent("canvas");

    // _p5.textSize(18);
    _p5.textSize(wheelTextSize);
    _p5.textFont(fontRegular);
    _p5.textLeading(24);
    // _p5.textLeading(18);
    _p5.fill(200);

    circleTop = (_p5.height - diameter) / 2 + _p5.textAscent() / 3;
    circleCenterY = circleTop + radius;
    counter = counterInitial;

    button = document.querySelector("#play-btn");
    //let file = "https://backend.spincoin.xyz/api/rounds?populate[events][populate]=*"
    let file = endpoint + "/api/rounds?populate[events][populate]=*"
    fetch (file)
    .then(x => x.text())
    .then(y => {
      let dataLoaded = JSON.parse(y);
      let atrribute = dataLoaded.data[0].attributes;
      let dataWheel = atrribute.events;
      let roundData = []
      for (const oneRound of dataWheel) {
        let oneRoundData = {}
        let parseID = oneRound.youtube_id.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);
        oneRoundData.id=parseID[5];
        oneRoundData.question = oneRound.question;
        oneRoundData.data = oneRound.answers;
        roundData.push(oneRoundData);
      }
      theme = atrribute.theme;
      let getTheme =  endpoint + "/api/themes?populate=*&filters[name][$eq]=" + theme;
      fetch(getTheme).
      then(xTheme => xTheme.text()).
      then(yTheme => {
        let theme = JSON.parse(yTheme);
        if (theme &&  theme.data[0] && theme.data[0].attributes && theme.data[0].attributes.list && theme.data[0].attributes.list.data) {
          for (const themeImage of theme.data[0].attributes.list.data) {
            if (themeImage.attributes.url) {
              theme_images.push(endpoint + themeImage.attributes.url);
            }
          }
        }
        if (!theme_images || theme_images.length < 1) {
          console.log("Cannot load theme. Use default");
          theme_images.push("/images/items/001.png");
          theme_images.push("/images/items/002.png");
          theme_images.push("/images/items/003.png");
          theme_images.push("/images/items/004.png");
          theme_images.push("/images/items/005.png");
          theme_images.push("/images/items/006.png");
          theme_images.push("/images/items/007.png");
        }

      });
      
      _p5.setData(roundData, 0);
      loadYoutubeIframe(_p5);
      loadedData = true;
      currentQuestion = data_list[0].question;
    });
    
    button.addEventListener("click", function (event) {
      if (loadedData) {
        overlay = document.querySelector("#overlay-start");
        overlay.style.display = "none";
        _p5.playRound();
      } else {

      }
      
      return false;
    });
    _p5.onAfterSetup();
  };

  _p5.onNextRound = function () {
    var canv = document.getElementById("countdown-canvas");
    canv.style.display = "none";
    currentRound = currentRound + 1;
    if (currentRound < data_list.length ) {
      currentQuestion = data_list[currentRound].question;
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
  
      setTimeout(function () {
        overlay.style.display = "none";
        overlay.remove();
        svg.remove();
        canv.style.opacity = "1";
        _p5.reloadData(currentRound);
        _p5.playRound();
      }, 4000);
    } else {
      var overlayStart = document.getElementById("overlay-start");
      var playButton = document.getElementById("play-btn");
      var leaderboard = document.getElementById("leaderboard");
      overlayStart.style.display = "block";
      playButton.style.display = "none";
      leaderboard.style.display = "block";
      leaderboard.style.zIndex = 99999;
      currentQuestion = "";
    }
  };
  _p5.playRound = () => {
    const  videoContainer = document.getElementById("filter-shadow");
    if (!isCounterAnimation) {
      const durationSec = 30,
        totalRows = getTotalRowsForDurationAndSpeed(
          durationSec,
          Math.floor(Math.random() * (4 - 2)) + 2
        );
      _p5.onStartWheel(durationSec);
      if (player) {
        player.loadVideoById(data_list[currentRound].id);
        player.playVideo();
      }
      const countdownContainer = document.getElementById("countdown-canvas");
      countdownContainer.style.display = "block";

      // Create a loop to generate the countdown elements
      for (let i = 30; i >= 0; i--) {
        const countdownElement = document.createElement("div");
        countdownElement.className = "n";
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
  function getTotalRowsForDurationAndSpeed(
    videoDurationSec = 22,
    speedItemsPerSec = 3
  ) {
    return speedItemsPerSec * videoDurationSec;
  }

  _p5.mouseDragEnable = (state = true) => {
    mouseDragEnable = state;
  };

  _p5.guessIt = () => {
    let currentTime = new Date().getTime();
    if (currentTime - lastKeyPressTime >= 100) {
      let message = {
        key: data[selectedKey].title,
        timestamp: currentTime,
        y:  Math.random() * _p5.height/2 + 50 // Randomize the y-coordinate to display keys in parallel
      };
      messages.push(message);
      lastKeyPressTime = currentTime;
    }
  }

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
    // Для тач-девайсов эта переменная undefined, поэтому вручную считаем направление сдвига
    if (_p5.movedY === undefined) {
      let diff = _p5.touches[0].y - touchYPrev;
      delta = (diff < 0 ? -1 : diff === 0 ? 0 : 1) * 12;
      touchYPrev = _p5.touches[0].y;
    }

    incrementCounter(delta);

    return false;
  };

  _p5.draw = () => {
    if (!loadedData) {
      return;
    }
    _p5.clear();
    if (useDefaultFont) {
      _p5.textFont("Georgia");
      _p5.textAlign(_p5.LEFT, _p5.BOTTOM);
    } else {
      _p5.textFont(fontRegular);
    }
    let currentTime = new Date().getTime();
    // Iterate through the array of messages
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];
      let elapsedTime  = currentTime - message.timestamp;

      // Calculate opacity based on time elapsed
      let opacity = _p5.map(elapsedTime , 0, messageDisplayDuration, 255, 0);

      // Calculate the y-coordinate to make the text fall down
      let y = _p5.map(
        elapsedTime ,
        0,
        messageDisplayDuration,
        message.y,
        message.y + 200
      );

      // Display the message falling down with reduced opacity
      _p5.fill(0, 255, 0, opacity);
      _p5.textSize(50);
      _p5.text(message.key, 50, y);
      _p5.textSize(wheelTextSize);
      // If the display duration is over, remove the message
      if (elapsedTime >= messageDisplayDuration) {
        messages.splice(i, 1);
        i--; // Decrement the index to account for the removed message
      }
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
    if (currentQuestion) {
      _p5.textSize(25);
      _p5.text(currentQuestion, question_X, 50);
      _p5.textSize(wheelTextSize);    
      question_X += 1;
      if (question_X > _p5.width) {
        question_X = -_p5.textWidth(currentQuestion); // Reset to the left of the canvas
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
        _p5.fill(212, 160, 0);

        if (key !== selectedKey) {
          selectedKey = key;
          _p5.onSelectItem(theme_images, selectedKey);
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
        } else {
          tickHook(newNum);
        }
      };
    animationsMap.set(`${startNum},${endNum},${durationMs}`, engine);
  }
}
