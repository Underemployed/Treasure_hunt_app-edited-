var express = require("express");
const session = require("express-session");
var router = express.Router();
var teamHelper = require("../helpers/team-helper");

// edited by Underemployed 17-02-2024
function verifyTeam(Id) {
  var isTeamId = false;
  for (var i = 1; i <= 25; i++) {
    var teamId = "team" + (i > 9 ? i : "0" + i);
    if (Id === teamId) {
      isTeamId = true;
      break;
    }
  }
  return isTeamId;
}

function createTeam(teamId) {
  let teamDetails = {};
  //teamId
  teamDetails.teamId = teamId.toLowerCase().trim();
  //current clue number for leaderboard
  teamDetails.currentClue = 2;
  // array for track user
  passedAnswers = [];
  datePassed = new Date();
  // let time=datePassed.getUTCHours() + ":" + datePassed.getUTCMinutes() + ":" + datePassed.getUTCSeconds();
  time = new Date(datePassed).toLocaleString(undefined, {
    timeZone: "Asia/Kolkata",
  });
  passedAnswers[0] = {
    time: time,
    clueNo: 1,
  };
  teamDetails.passedAnswers = passedAnswers;
  return teamDetails;
}

function updateTeam(clueNo, passedAnswers) {
  let teamDetails = {};
  teamDetails.currentClue = clueNo;
  datePassed = new Date();
  //let time=datePassed.getUTCHours() + ":" + datePassed.getUTCMinutes() + ":" + datePassed.getUTCSeconds();
  time = new Date(datePassed).toLocaleString(undefined, {
    timeZone: "Asia/Kolkata",
  });
  trackingData = {
    time: time,
    clueNo: clueNo - 1,
  };
  passedAnswers.unshift(trackingData);
  teamDetails.passedAnswers = passedAnswers;
  return teamDetails;
}

function isCompletePrevClues(result, thisClueNo) {
  if (result === null) {
    return false;
  } else {
    if (result.currentClue >= thisClueNo) {
      return true;
    } else {
      if (result.currentClue < thisClueNo) {
        if (result.currentClue + 1 == thisClueNo) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

function finalCheck(thisClueNo, teamId, nextPageName, res) {
  teamHelper.getTeamDetails(teamId).then((result) => {
    if (isCompletePrevClues(result, thisClueNo)) {
      if (result.currentClue == thisClueNo || result.currentClue > thisClueNo) {
        res.render("clues/" + nextPageName, { msg: "Already completed" });
      } else {
        passedAnswers = result.passedAnswers;
        teamDetails = updateTeam(thisClueNo, passedAnswers);
        teamHelper.updateTeam(teamId, teamDetails).then((result) => {
          res.render("clues/" + nextPageName);
        });
      }
    } else {
      session.errMsg = "Malpractice detected!";
      console.log(
        "\n" +
          "*".repeat(10) +
          "\nMalpractice detected for team: " +
          teamId +
          " at clue " +
          thisClueNo +
          " at " +
          new Date().toLocaleString() +
          "\n" +
          "*".repeat(10) +
          "\n"
      ); // Log the team that did malpractice along with the current time and date
      res.redirect("/");
    }
  });
}
//newly added fn 
function normalizeAnswer(ans) {
  return ans
    .toLowerCase()             
    .replace(/\s+/g, "")        // remove all spaces
    .replace(/[^a-z0-9]/g, ""); // remove special chars
}


/* GET users listing. */
router.get("/", function (req, res) {
  if (req.session.teamId) {
    teamId = req.session.teamId;
    res.render("player/play-zone", { teamId, error: session.errMsg });
    session.errMsg = null;
  } else {
    res.render("player/play-zone", { error: session.errMsg });
    session.errMsg = null;
  }
});

router.post("/clue", async function (req, res) {
  let title = "Vista Voyage";
  let data = req.body;
  var teamId = data.teamId;
  teamId = teamId.replace(/\s+/g, "").toLowerCase();
  if (verifyTeam(teamId)) {
    req.session.teamId = data.teamId;
    var answer = data.answer;
    answer = answer.toLowerCase().trim();

    //newly added 
    // fetch clues from db
    const ansCollection = await teamHelper.getAllCluesFromDb();
    console.log("Ans fetched", ansCollection);
    let clueNum = null;
    let clueObj = null;
    ansCollection.forEach((clue) => {
      if (clue.answers.some(a => normalizeAnswer(a) === normalizeAnswer(answer))) { 
        clueNum = clue.ans;
        clueObj = clue;
      }
    });

    if (clueNum === null) {
      session.errMsg = "Wrong answer !";
      return res.redirect("/");
    }
    switch (clueNum) {
      case 1:
        teamHelper.isTeam(teamId).then((result) => {
          if (result) {
            res.render("clues/clue2", {
              msg: "Already completed",
              title: title,
            });
          } else {
            teamDetails = createTeam(teamId);
            teamHelper.addTeam(teamDetails).then((data) => {
              res.render("clues/clue2", { title: title });
            });
          }
        });
        break;
      
      case 2:
        nextPageName = "clue3";
        finalCheck(3, teamId, nextPageName, res);
        break;
      case 3:
        nextPageName = "clue4";
        finalCheck(4, teamId, nextPageName, res);
        break;
      case 4:
        nextPageName = "clue5";
        finalCheck(5, teamId, nextPageName, res);
        break;
      case 5:
        nextPageName = "clue6";
        finalCheck(6, teamId, nextPageName, res);
        break;
      case 6:
        nextPageName = "clue7";
        finalCheck(7, teamId, nextPageName, res);
        break;
      case 7:
        nextPageName = "clue8";
        finalCheck(8, teamId, nextPageName, res);
        break;
      case 8:
        nextPageName = "clue9";
        finalCheck(9, teamId, nextPageName, res);
        break;
      case 9:
        nextPageName = "clue10";
        finalCheck(10, teamId, nextPageName, res);
        break;
      case 10:
        nextPageName = "clue11";
        finalCheck(11, teamId, nextPageName, res);
        break;
      case 11:
        nextPageName = "clue12";
        finalCheck(12, teamId, nextPageName, res);
        break;
      case 12:
        nextPageName = "clue13";
        finalCheck(13, teamId, nextPageName, res);
        break;
      case 13:
        nextPageName = "clue14";
        finalCheck(14, teamId, nextPageName, res);
        break;
      case 14:
        nextPageName = "clue15";
        finalCheck(15, teamId, nextPageName, res);
        break;
      case 15:
        teamHelper.getTeamDetails(teamId).then((result) => {
          if (isCompletePrevClues(result, 16)) {
            if (result.currentClue == 16 || result.currentClue > 16) {
              res.render("clues/treasure", { title: title });
            } else {
              passedAnswers = result.passedAnswers;
              teamDetails = updateTeam(16, passedAnswers);
              teamDetails.atTreasure = true;
              let temp = teamDetails.passedAnswers;
              let treasureTime = temp[0];
              teamDetails.treasureTime = treasureTime.time;
              console.log(teamDetails);
              teamHelper.updateTeam(teamId, teamDetails).then((result) => {
                res.render("clues/treasure", { title: title });
              });
            }
          } else {
            session.errMsg = "Malpractice detected!";
            res.redirect("/");
          }
        });
        break;
      default:
        session.errMsg = "Wrong answer!";
        res.redirect("/");
    }
  } else {
    session.errMsg = "Wrong Team Id!";
    res.redirect("/");
  }
});
// leader board page(UNCOMMENT IF U WANT TO USE)
// sorted by treasure time and clue (by underemployed 24-02-2024)
router.get("/vault-access2k25", function (req, res) {
  teamHelper.getAllTeamData().then((TeamData) => {
    TeamData.sort((a, b) => {
      if (a.treasureTime && b.treasureTime) {
        return new Date(a.treasureTime) - new Date(b.treasureTime);
      } else if (a.treasureTime) {
        return -1;
      } else if (b.treasureTime) {
        return 1;
      } else {
        return b.currentClue - a.currentClue;
      }
    });

    var i = 1;
    TeamData.forEach((element) => {
      element.index = i;
      i++;
      element.atTreasure; // at treasure text
    });
    res.render("partials/leaderboard", { layout: false, TeamData });
  });
});
router.get("/track", function (req, res) {
  teamHelper.getAllTeamData().then((TeamData) => {
    TeamData.sort((a, b) => {
      return a.currentClue - b.currentClue;
    });
    TeamData.reverse();
    var i = 1;
    TeamData.forEach((element) => {
      element.index = i;
      i++;
    });
    res.render("admin/playerTracker", { TeamData });
  });
});

router.get("/player-progress", function (req, res) {
  res.render("player/player-progress");
});

router.post("/player-progress", function (req, res) {
  let data = req.body;
  var teamId = data.teamId;
  teamId = teamId.toLowerCase();
  teamHelper.isTeam(teamId).then((response) => {
    if (response) {
      teamHelper.getOneTeamData(teamId).then((result) => {
        let currentClue = result.currentClue;
        let persentage = (result.currentClue / 10) * 100;
        res.render("player/player-progress", {
          persentage,
          teamId,
          currentClue,
        });
      });
    } else {
      res.render("player/player-progress", { error: "No such team" });
    }
  });
});

router.get("/*", function (req, res) {
  res.render("player/exception-page", { layout: false });
});

module.exports = router;
