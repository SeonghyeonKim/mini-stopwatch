// TODO: 이 곳에 정답 코드를 작성해주세요.

import Stopwatch from "./stopwatch.js";

const stopwatch = new Stopwatch();

let isRunning = false;
let interval;

// 1. 시작 기능
// 스톱워치가 시작하고, 스톱워치의 시간이 올라갑니다.
// 좌측의 리셋 L 버튼이 랩 L 버튼으로, 우측의 시작 S 버튼이 중단 S 버튼으로 변경됩니다.

const $timer = document.getElementById('timer');
const $lapResetBtn = document.getElementById('lap-reset-btn');
const $startStopBtn = document.getElementById('start-stop-btn');
const $lapResetBtnLabel = document.getElementById('lap-reset-btn-label');
const $startStopBtnLabel = document.getElementById('start-stop-btn-label');

let $minLap, $maxLap

/**
 * 입력한 시간을 화면에 표시하는 함수
 * @param {int} time 
 */
const updateTime = (time) => {
  $timer.innerText = formatTime(time);
};

/**
 * 시작/종료 버튼의 색을 변경하는 함수
 */
const toggleBtnStyle = () => {
  $startStopBtn.classList.toggle('bg-green-600');
  $startStopBtn.classList.toggle('bg-red-600');
};

/**
 * 시작/종료 버튼을 클릭했을 때 실행하는 함수
 */
const onClickStartStopBtn = () => {
  if(isRunning) {
    onClickStopBtn();
  }
  else {
    onClickStartBtn();
  }
  isRunning = !isRunning;
  toggleBtnStyle();
};

/**
 * isRunning이 false일 때 타이머를 실행시키는 함수
 */
const onClickStartBtn = () => {
  stopwatch.start();
  interval = setInterval(() => {
    updateTime(stopwatch.centisecond);
  }, 10);
  $lapResetBtnLabel.innerText = "랩";
  $startStopBtnLabel.innerText = "중단";
};

/**
 * isRunning이 true일 때 타이머를 정지시키는 함수
 */
const onClickStopBtn = () => {
  stopwatch.pause();
  clearInterval(interval);
  $lapResetBtnLabel.innerText = "리셋";
  $startStopBtnLabel.innerText = "시작";
};


$startStopBtn.addEventListener('click', onClickStartStopBtn);


// 2. 시간 포맷팅 기능
// 스톱워치 모듈에서 내려받은 centisecond는 다음과 같은 포맷을 가져야 합니다.
// 아래와 같은 포맷을 가지도록 스톱워치의 시간 출력 형태를 변경해주세요.
// [분]:[초].[100/1 초 = centisecond]

const formatString = (num) => (num < 10 ? '0' + num : num);

/**
 * 입력된 1/100초를 문자열로 변환하는 함수
 * @param {int} centisecond 
 * @returns {string} MM:SS.CC 형식의 문자열
 */
const formatTime = (centisecond) => {
  const min = parseInt(centisecond / 6000);
  const sec = parseInt(centisecond % 6000 / 100);
  const centisec = centisecond % 100;
  
  const formattedString = `${formatString(min)}:${formatString(sec)}.${formatString(centisec)}`;

  return formattedString;
};


// 3. 랩 기능
// Lap Count가 함께 명시된 랩이 하나씩 기록됩니다.
// 최신 Lap이 순서대로 맨 위에 추가됩니다.

// 4. 리셋 기능
// 리셋 L 버튼을 클릭하면 아래와 같은 작업이 이루어져야 합니다.
// 스톱워치의 시간이 초기화 됩니다. (00:00.00)
// 모든 랩이 사라집니다.

const $laps = document.getElementById('laps');

const onClickResetBtn = () => {
  stopwatch.reset();
  updateTime(0);
  $laps.innerHTML = '';
}

const onClickLapBtn = () => {
  const [lapCount, lapTime] = stopwatch.createLap();
  const $lap = document.createElement('li');
  $lap.setAttribute('data-time', lapTime);
  $lap.classList.add('flex', 'justify-between', 'py-2', 'px-3', 'border-b-2');
  $lap.innerHTML = `
    <span>랩 ${lapCount}</span>
    <span>${formatTime(lapTime)}</span>
  `;
  $laps.prepend($lap);

  // 첫 번째 lap을 눌렀을 때
  if($minLap === undefined) {
    $minLap = $lap;
    return ;
  }

  // 두 번째 lap을 눌렀을 때
  if($maxLap === undefined) {
    if(lapTime < $minLap.dataset.time) {
      $maxLap = $minLap;
      $minLap = $lap;
    }
    else {
      $maxLap = $lap;
    }
  }

  // 세 번 이상 lap을 눌렀을 때
  if(lapTime < $minLap.dataset.time) {
    $minLap.classList.remove('text-green-600');  
    $minLap = $lap;
  }
  else if(lapTime > $maxLap.dataset.time) {
    $maxLap.classList.remove('text-red-600');
    $maxLap = $lap;
  }

  $minLap.classList.add('text-green-600');  
  $maxLap.classList.add('text-red-600');
}

const onClickLapResetBtn = () => {
  if(isRunning) {
    onClickLapBtn()
  }
  else {
    onClickResetBtn();
  }
}

$lapResetBtn.addEventListener('click', onClickLapResetBtn);

// 5. 키보드 조작 기능
// 버튼을 키보드로 조작할 수 있도록 해야 합니다.
// 키보드 L: 랩 L, 리셋 L 키보드 S: 시작 S, 중단 S

const onKeyDown = (e) => {
  switch(e.code) {
    case 'KeyS':
      onClickLapResetBtn();
      break;
    case 'KeyL': 
      onClickStartStopBtn();
      break;
  }
}

document.addEventListener('keydown', (e) => onKeyDown(e));


// 6. 최단, 최장 기록 강조 효과
// Lap 중 최장 Lap 기록은 붉은색으로 (text-red-600)
// 최단 Lap 기록은 초록색으로 (text-green-600) 표시되어야 합니다.

