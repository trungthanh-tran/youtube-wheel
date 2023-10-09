class LeaderBoard {
  constructor() {
    this.team = "";
  }

  getLeaderBoard() {
    this.team = [
      {
        rank: 1,
        name: "Lewis Hamilton",
        handle: "lewishamilton",
        img: "https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col-retina/image.png",
        kudos: 36,
        sent: 31,
      },
      {
        rank: 2,
        name: "Kimi Raikkonen",
        handle: "kimimatiasraikkonen",
        img: "https://www.formula1.com/content/dam/fom-website/drivers/K/KIMRAI01_Kimi_R%C3%A4ikk%C3%B6nen/kimrai01.png.transform/2col-retina/image.png",
        kudos: 31,
        sent: 21,
      },
      {
        rank: 3,
        name: "Sebastian Vettel",
        handle: "vettelofficial",
        img: "https://www.formula1.com/content/dam/fom-website/drivers/S/SEBVET01_Sebastian_Vettel/sebvet01.png.transform/2col-retina/image.png",
        kudos: 24,
        sent: 7,
      },
      {
        rank: 4,
        name: "Max Verstappen",
        handle: "maxverstappen1",
        img: "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col-retina/image.png",
        kudos: 22,
        sent: 4,
      },
      {
        rank: 5,
        name: "Lando Norris",
        handle: "landonorris",
        img: "https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col-retina/image.png",
        kudos: 18,
        sent: 16,
      },
    ];
  }

  randomEmoji() {
    {
        const emojis = ["👏", "👍", "🙌", "🤩", "🔥", "⭐️", "🏆", "💯"];
        let randomNumber = Math.floor(Math.random() * emojis.length);
        return emojis[randomNumber];
      };
  }

  renderLeaderShip() {
    var leaderboard = document.getElementById('leaderboard')
    leaderboard.style.opacity="1";
    leaderboard.style.zIndex="100";
    let leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = "";
    this.getLeaderBoard();
    this.team.forEach((member) => {
        let newRow = document.createElement("li");
        let emoji = this.randomEmoji();
        newRow.classList = "c-list__item";
        newRow.innerHTML = `
              <div class="c-list__grid">
                  <div class="c-flag c-place u-bg--transparent">${member.rank}</div>
                  <div class="c-media">
                      <img class="c-avatar c-media__img" src="${member.img}" />
                      <div class="c-media__content">
                          <div class="c-media__title">${member.name}</div>
                          
                      </div>
                  </div>
                  <div class="u-text--right c-kudos">
                      <div class="u-mt--8">
                          <strong>${member.kudos}</strong> ${emoji}
                      </div>
                  </div>
              </div>
          `;
        if (member.rank === 1) {
          newRow.querySelector(".c-place").classList.add("u-text--dark");
          newRow.querySelector(".c-place").classList.add("u-bg--yellow");
          newRow.querySelector(".c-kudos").classList.add("u-text--yellow");
        } else if (member.rank === 2) {
          newRow.querySelector(".c-place").classList.add("u-text--dark");
          newRow.querySelector(".c-place").classList.add("u-bg--teal");
          newRow.querySelector(".c-kudos").classList.add("u-text--teal");
        } else if (member.rank === 3) {
          newRow.querySelector(".c-place").classList.add("u-text--dark");
          newRow.querySelector(".c-place").classList.add("u-bg--orange");
          newRow.querySelector(".c-kudos").classList.add("u-text--orange");
        }
        leaderboardList.appendChild(newRow);
      });
  }
}
