let NOQ = document.querySelector(".NOQ");
let bulletcircel = document.querySelector(".bullet .bulletcircel");
let bullet = document.querySelector(".bullet");
let question_area = document.querySelector(".question_area");
let option_area = document.querySelector(".option_area");
let buttonsubmit = document.querySelector(".buttonsubmit");
let countdown = document.querySelector(".countdown");

let currentindex = 0;
let therightanswer = 0;
let countdownintervalreset;

function getquestion(){
  let Qrequset =  new XMLHttpRequest();

  Qrequset.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let QusetionObject = JSON.parse(this.responseText);
      let qCount =  QusetionObject.length;
      console.log(QusetionObject);


      createbullet(qCount);
      addQuestion(QusetionObject[currentindex], qCount);

      countdowninterval(100,qCount);

      buttonsubmit.onclick = () => {
        let rightanswer = QusetionObject[currentindex].correct_option;

        currentindex++;

        checkanswer(rightanswer, qCount);

        question_area.innerHTML = "";
        option_area.innerHTML = "";

        addQuestion(QusetionObject[currentindex], qCount);
        hundelbullet();

        clearInterval(countdownintervalreset);
        countdowninterval(100, qCount);

        showresult(qCount);
      }
    }
  };


  Qrequset.open("GET", "./assest/js/exam.json", true);

  Qrequset.send();
}
getquestion();


function createbullet(num){
  NOQ.innerHTML = num;

  for(let i = 0;i < num; i++){

    let bullet = document.createElement("span");

    if(i===0){
      bullet.className = "on";
    }


    bulletcircel.appendChild(bullet);
  }
}

function addQuestion(obj , count){
  if (currentindex < count){

    let QuestionTitle = document.createElement("h2");

    let QuestionText = document.createTextNode(obj["title"]);

    QuestionTitle.appendChild(QuestionText);

    question_area.appendChild(QuestionTitle);

    for (let i = 1; i <= 4; i++) {
      let maindiv = document.createElement("div");

      maindiv.className = "answer";

      let inputOption = document.createElement("input");
      inputOption.name = "Q";
      inputOption.type = "radio";
      inputOption.id = `option${i}`;
      inputOption.dataset.answer = obj[`option_${i}`];

      let Mlebel = document.createElement("label");
      Mlebel.htmlFor = `option${i}`;

      let lebeltext = document.createTextNode(obj[`option_${i}`]);

      Mlebel.appendChild(lebeltext);

      maindiv.appendChild(inputOption);
      maindiv.appendChild(Mlebel);

      option_area.appendChild(maindiv);
    }

  }
}

function checkanswer(rightanswer, qCount){

  let answers = document.getElementsByName("Q");
  let thechoosenanswer;

  for (let i = 0; i < answers.length ; i++ ) {

    if(answers[i].checked) {
      thechoosenanswer = answers[i].dataset.answer;
    }
  }

  if (rightanswer === thechoosenanswer) {
    therightanswer++;
  }

}

function hundelbullet(){
  let bulletspan = document.querySelectorAll(".bulletcircel span");
  let arrayOfSpan = Array.from(bulletspan);

  let answers = document.getElementsByName("Q");

  arrayOfSpan.forEach((span, index) => {
    if (currentindex === index) {
      console.log(answers);
      span.className = "on";

    }
  });


}

function showresult(count){
  let theresult;

  if(currentindex === count){
    question_area.remove();
    option_area.remove();
    buttonsubmit.remove();
    bullet.remove();

    if (therightanswer > (count / 2) && therightanswer < count) {
      theresult = `<span class="good">good</span> you answerd ${therightanswer} from ${count}`;
    } else if (therightanswer == count) {
      theresult = `<span class="perfuct">perfuct</span> you answerd ${therightanswer} from ${count}`;
    } else {
      theresult = `<span class="bad">bad</span> you answerd ${therightanswer} from ${count}`;
    }

    let resultdiv = document.querySelector(".result");
    resultdiv.innerHTML = theresult;

    resultdiv.style.padding = "15px"
    resultdiv.style.margintop = "10px"
  }


}

function countdowninterval(setperiod,qCount){

  if (currentindex < qCount) {
    let minets,secend;

    countdownintervalreset = setInterval(function () {
      minets = parseInt(setperiod / 60);
      secend = parseInt(setperiod % 60);

      minets = minets <10 ? `0${minets}` : `${minets}`;
      secend = secend < 10 ? `0${secend}` : `${secend}`;


      countdown.innerHTML = `${minets}:${secend}`;
      if (--setperiod < 0) {
        clearInterval(countdownintervalreset);
        buttonsubmit.click();
      }

    },1000);

  }

}