import { useEffect, useRef, useState } from "react";

const audioSrc =
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

const TimerLengthControl = ({
  addID,
  length,
  lengthID,
  minID,
  updateTime,
  title,
  titleID,
}) => {
  return (
    <div className="w-full lg:w-1/2 flex justify-center">
      <div id={titleID} className="flex flex-col items-center">
        <h2 className="text-3xl font-normal">{title}</h2>
        <div className="flex space-x-4 items-center mt-4">
          <button
            id={minID}
            onClick={() => updateTime(-60, lengthID)}
            value="-"
            className="w-8 h-8 rounded-md text-xl font-semibold bg-light-purple text-dark flex justify-center items-center"
          >
            <i className="minus fas fa-minus"></i>
          </button>
          <span id={lengthID} className="font-medium text-2xl">
            {length}
          </span>
          <button
            id={addID}
            onClick={() => updateTime(60, lengthID)}
            value="+"
            className="w-8 h-8 rounded-md text-xl font-semibold bg-light-purple text-dark flex justify-center items-center"
          >
            <i className="plus fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [timer, setTimer] = useState(5);
  const [breakLength, setBreakLength] = useState(5 * 60);
  const [sessionLength, setSessionLength] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  let audio = useRef(null);

  useEffect(() => {
    if (timer <= 0) {
      setOnBreak(true);
      breakSound();
    } else if (!timerOn && timer === breakLength) {
      setOnBreak(false);
    }
  }, [breakLength, timer, timerOn, sessionLength, onBreak]);

  const breakSound = () => {
    audio.currentTime = 0;
    audio.play();
  };

  const updateTime = (amount, lengthID) => {
    if (lengthID === "break-length") {
      if ((breakLength <= 60 && amount < 0) || breakLength >= 60 * 60) {
        return;
      }
      setBreakLength((prev) => prev + amount);
    } else {
      if ((sessionLength <= 60 && amount < 0) || sessionLength >= 60 * 60) {
        return;
      }
      setSessionLength((prev) => prev + amount);
      if (!timerOn) {
        setTimer(sessionLength + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setTimer((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              onBreakVariable = true;
              return breakLength;
            } else if (prev <= 0 && onBreakVariable) {
              onBreakVariable = false;
              setOnBreak(false);
              return sessionLength;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("intervalID", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("intervalID"));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    clearInterval(localStorage.getItem("intervalID"));

    audio.pause();
    audio.currentTime = 0;

    setTimerOn(false);
    setOnBreak(false);
    setTimer(25 * 60);
    setBreakLength(5 * 60);
    setSessionLength(25 * 60);
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  return (
    <div className="w-full min-h-full  text-white ">
      <div className="m-auto w-full lg:w-1/2 mt-8 lg:mt-16">
        <h1 className="font-normal text-5xl text-center">Pomodoro Clock</h1>
        <div className="w-full mt-12 flex flex-wrap space-y-8 lg:space-y-0">
          <TimerLengthControl
            addID="break-increment"
            length={breakLength / 60}
            lengthID="break-length"
            minID="break-decrement"
            updateTime={updateTime}
            title="Break Length"
            titleID="break-label"
          />
          <TimerLengthControl
            addID="session-increment"
            length={sessionLength / 60}
            lengthID="session-length"
            minID="session-decrement"
            updateTime={updateTime}
            title="Session Length"
            titleID="session-label"
          />
        </div>
        <div className="w-full flex justify-center mt-8">
          <div className="flex flex-col items-center">
            <div id="timer-label" className="font-normal text-4xl">
              {onBreak ? "Break" : "Session"}
            </div>
            <div id="time-left" className="font-normal text-6xl">
              {formatTime(timer)}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-8">
          <div className="space-x-4">
            <button
              id="start_stop"
              onClick={controlTime}
              className="space-x-4 text-2xl"
            >
              {timerOn ? (
                <i className="fa fa-pause" />
              ) : (
                <i className="fa fa-play" />
              )}
            </button>
            <button id="reset" onClick={resetTime} className="text-2xl">
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        <audio ref={(t) => (audio = t)} src={audioSrc} id="beep" />
      </div>
    </div>
  );
};

export default App;
