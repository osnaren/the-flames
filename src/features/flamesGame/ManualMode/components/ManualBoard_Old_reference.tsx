import { Footer } from '@components/index';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import * as htmlToImage from 'html-to-image';
import $ from 'jquery';
import { createRef, useEffect, useState } from 'react';
import { BsBoxArrowDownLeft, BsBoxArrowUpRight, BsEraser } from 'react-icons/bs';
import { MdOutlineEdit, MdOutlineEditOff } from 'react-icons/md';
import reactNotify from '../../utilities/toast/toast';

import animationData1 from '../../assets/download.json';
import animationData from '../../assets/duster.json';

const defaultOptions = {
  loop: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const downloadOptions = {
  loop: true,
  animationData: animationData1,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function chalkboard(): void {
  $('#chalkboard').remove();
  $('.chalk').remove();
  $('#chalkBoard__canvas').prepend('<canvas id="chalkboard"></canvas>');
  $('#chalkBoard__canvas').prepend('<div className="chalk"></div>');
  $('.panel').css('display', 'none');

  const canvas = document.getElementById('chalkboard') as HTMLCanvasElement;
  canvas.width = $(window).width() || 1000;
  canvas.height = $(window).height() || 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width } = canvas;
  const { height } = canvas;
  let mouseX = 0;
  let mouseY = 0;
  let mouseD = false;
  let eraser = false;
  let xLast = 0;
  let yLast = 0;
  const brushDiameter = 7;
  const eraserWidth = 50;
  const eraserHeight = 100;

  $('#chalkboard').css('cursor', 'none');
  document.onselectstart = function () {
    return false;
  };
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = brushDiameter;
  ctx.lineCap = 'round';

  document.addEventListener(
    'touchmove',
    function (evt) {
      const touch = evt.touches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      if (mouseY < height && mouseX < width) {
        evt.preventDefault();
        $('.chalk').css('left', `${mouseX}px`);
        $('.chalk').css('top', `${mouseY}px`);
        // $('.chalk').css('display', 'none');
        if (mouseD) {
          draw(mouseX, mouseY);
        }
      }
    },
    false
  );
  document.addEventListener(
    'touchstart',
    function (evt) {
      // evt.preventDefault();
      const touch = evt.touches[0];
      mouseD = true;
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      xLast = mouseX;
      yLast = mouseY;
      draw(mouseX + 1, mouseY + 1);
    },
    false
  );
  document.addEventListener(
    'touchend',
    function () {
      mouseD = false;
    },
    false
  );
  $('#chalkboard').css('cursor', 'none');
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = brushDiameter;
  ctx.lineCap = 'round';

  $(document).on('mousemove', function (evt) {
    mouseX = evt.pageX;
    mouseY = evt.pageY;
    if (mouseY < height && mouseX < width) {
      $('.chalk').css('left', `${mouseX + 1.5 * brushDiameter}px`);
      $('.chalk').css('top', `${mouseY - 0.5 * brushDiameter}px`);
      if (mouseD) {
        if (eraser) {
          erase(mouseX, mouseY);
        } else {
          draw(mouseX, mouseY);
        }
      }
    } else {
      $('.chalk').css('top', height - 10);
    }
  });

  $(document).on('mousedown', function (evt) {
    mouseD = true;
    xLast = mouseX;
    yLast = mouseY;
    if (evt.button === 2) {
      erase(mouseX, mouseY);
      eraser = true;
      $('.chalk').addClass('eraser');
    } else if (!$('.panel:hover').length === 0) {
      draw(mouseX + 1, mouseY + 1);
    }
  });

  $(document).on('mouseup', function (evt) {
    mouseD = false;
    if (evt.button === 2) {
      eraser = false;
      $('.chalk').removeClass('eraser');
    }
  });

  $(document).on('keyup', function (evt) {
    if (evt.key === ' ') {
      ctx.clearRect(0, 0, width, height);
    }
  });

  document.oncontextmenu = function () {
    return false;
  };

  function draw(x: number, y: number): void {
    if (!ctx) return;

    ctx.strokeStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.moveTo(xLast, yLast);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Chalk Effect
    const length = Math.round(Math.sqrt((x - xLast) ** 2 + (y - yLast) ** 2) / (5 / brushDiameter));
    const xUnit = (x - xLast) / length;
    const yUnit = (y - yLast) / length;
    for (let i = 0; i < length; i++) {
      const xCurrent = xLast + i * xUnit;
      const yCurrent = yLast + i * yUnit;
      const xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      const yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
    }

    xLast = x;
    yLast = y;
  }

  function erase(x: number, y: number): void {
    if (!ctx) return;
    ctx.clearRect(x - 0.5 * eraserWidth, y - 0.5 * eraserHeight, eraserWidth, eraserHeight);
  }
}

export default function ManualBoard(): JSX.Element {
  const ref = createRef<HTMLDivElement>();
  const [viewBoardBg, setViewBoardBg] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentDay, setCurrentDay] = useState<string>('');
  const [isDusterPaused, setIsDusterPaused] = useState<boolean>(true);
  const [isDusterStopped, setIsDusterStopped] = useState<boolean>(true);
  const [isDownloadPaused, setIsDownloadPaused] = useState<boolean>(true);
  const [isDownloadStopped, setIsDownloadStopped] = useState<boolean>(true);
  const [isToolsVisible, setIsToolsVisible] = useState<boolean>(false);
  const [person1Name, setPerson1Name] = useState<string>('');
  const [person2Name, setPerson2Name] = useState<string>('');
  const [person1NameError, setPerson1NameError] = useState<boolean>(false);
  const [person2NameError, setPerson2NameError] = useState<boolean>(false);
  const [person1NameValid, setPerson1NameValid] = useState<boolean>(false);
  const [person2NameValid, setPerson2NameValid] = useState<boolean>(false);
  const [name1edit, setName1edit] = useState<boolean>(false);
  const [name2edit, setName2edit] = useState<boolean>(false);
  const [hideAll, setHideAll] = useState<boolean>(false);

  const [dvcInfoAnchorEl, setDvcInfoAnchorEl] = useState<HTMLElement | null>(null);
  const setAnchorNull = () => setDvcInfoAnchorEl(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setViewBoardBg(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentDay(weekday[new Date().getDay()]);
    setCurrentDate(new Date().toLocaleDateString('en-IN'));

    const boardTimer = setTimeout(() => {
      chalkboard();
    }, 1500);

    return () => clearTimeout(boardTimer);
  }, []);

  const downloadImage = (): void => {
    $('#tools').hide();
    $('.chalk').css('display', 'none');

    const element = document.getElementById('schoolBg');
    if (!element) return;

    htmlToImage
      .toCanvas(element)
      .then(function (canvas) {
        const img = canvas.toDataURL('image/png', 1.0).replace('image/png', 'image/octet-stream');
        const link = document.createElement('a');
        link.download = 'flames-result.png';
        link.href = img;
        link.click();
      })
      .then(() => {
        setIsDownloadPaused(true);
        setIsDownloadStopped(true);
        $('.chalk').css('display', 'block');
        $('#tools').show();
        setTimeout(() => {
          handleToolsVisible();
        }, 1000);
      });
  };

  const handleClearAll = (): void => {
    setIsDusterPaused(false);
    setIsDusterStopped(false);
    $('.chalk').css('display', 'none');
    $('#chalkBoard__canvas').addClass('animate__wobble');

    setTimeout(() => {
      const canvas = document.getElementById('chalkboard') as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      setTimeout(() => {
        $('#chalkBoard__canvas').removeClass('animate__wobble');
        $('.chalk').css('display', 'block');
        setIsDusterPaused(true);
        setIsDusterStopped(true);
        handleToolsVisible();
      }, 1000);
    }, 700);
  };

  const handleToolsVisible = (): void => {
    if (isToolsVisible) {
      setIsToolsVisible(false);
      $('.chalk').css('display', 'block');
    } else {
      setIsToolsVisible(true);
      $('.chalk').css('display', 'none');
    }
  };

  const notifyNameError = (caseNo: number): void => {
    let message = '';
    if (caseNo === 1) {
      message = 'Name must be atleast 3 characters';
    } else if (caseNo === 2) {
      message = 'Name must be alphanumeric';
    }

    reactNotify({
      type: 'error',
      message,
      options: {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        position: 'top-center',
      },
    });
  };

  const notifyNameSuccess = (): void => {
    reactNotify({
      type: 'success',
      message: 'Name is Vaild',
      options: {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        position: 'top-center',
      },
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const input = (e.target as HTMLElement).closest('.flames__input') as HTMLElement;
    if (input && input.id === 'manualInput1') {
      setPerson1Name(e.target.value);
    } else if (input && input.id === 'manualInput2') {
      setPerson2Name(e.target.value);
    }
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const input = (e.target as HTMLElement).closest('.flames__input') as HTMLElement;
    if (input && input.id === 'manualInput1') {
      if (person1Name.length < 3) {
        notifyNameError(1);
        setPerson1NameError(true);
      } else if (person1Name.match(/^[A-Za-z0-9]*$/) === null) {
        notifyNameError(2);
        setPerson1NameError(true);
        setPerson1NameValid(false);
      } else {
        setName1edit(false);
        setPerson1NameValid(true);
        notifyNameSuccess();
        setPerson1NameError(false);
      }
    } else if (input && input.id === 'manualInput2') {
      if (person2Name.length < 3) {
        notifyNameError(1);
        setPerson2NameError(true);
      } else if (person2Name.match(/^[A-Za-z0-9]*$/) === null) {
        notifyNameError(2);
        setPerson2NameError(true);
        setPerson2NameValid(false);
      } else {
        setName2edit(false);
        setPerson2NameValid(true);
        notifyNameSuccess();
        setPerson2NameError(false);
      }
    }
  };

  const handleNameFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    const input = (e.target as HTMLElement).closest('.flames__input') as HTMLElement;
    if (input && input.id === 'manualInput1') {
      setPerson1NameError(false);
    } else if (input && input.id === 'manualInput2') {
      setPerson2NameError(false);
    }
  };

  const handleEditToggle = (e: React.MouseEvent<HTMLElement>): void => {
    const input = (e.target as HTMLElement).closest('.flames__input') as HTMLElement;
    if (input && input.id === 'manualInput1') {
      setName1edit(!name1edit);
      if (name1edit) $('#person1_input').trigger('focus');
    } else if (input && input.id === 'manualInput2') {
      setName2edit(!name2edit);
      if (name2edit) $('#person2_input').trigger('focus');
    }
  };

  const handleMouseEnterInput = (): void => {
    if (!name1edit && !name2edit) return;
    $('.chalk').hide();
  };

  const handleMouseLeaveInput = (): void => {
    $('.chalk').show();
  };

  return (
    <>
      <div className="manualBoard__container" id="schoolBg" ref={ref}>
        {viewBoardBg && <div className="manualBoard__container__canvas animate__animated" id="chalkBoard__canvas" />}
        <div className="date__day__container">
          <div className="manualBoard__date__container">Date : {currentDate}</div>
          <div className="manualBoard__day__container">Day : {currentDay}</div>
        </div>
        <div className="falmes__text__container">
          <span className="flames__text">F</span>
          <span className="flames__text">L</span>
          <span className="flames__text">A</span>
          <span className="flames__text">M</span>
          <span className="flames__text">E</span>
          <span className="flames__text">S</span>
        </div>
        <div className="manualBoard__right__container" />
        <div
          className="downArrow"
          id="tools"
          onClick={handleToolsVisible}
          onMouseEnter={(e) => {
            $('.chalk').css('display', 'none');
            setDvcInfoAnchorEl(e.currentTarget);
          }}
          onMouseLeave={() => {
            $('.chalk').css('display', 'block');
            setAnchorNull();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleToolsVisible();
            }
          }}
        >
          {isToolsVisible ? <BsBoxArrowUpRight size={20} /> : <BsBoxArrowDownLeft size={20} />}
          {isToolsVisible && (
            <Popover
              className="manualBoard__right__container"
              id="simple-popover"
              open={Boolean(dvcInfoAnchorEl)}
              anchorEl={dvcInfoAnchorEl}
              onClose={setAnchorNull}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div
                className="clean_all_icon"
                id="dusterIcon"
                onMouseEnter={() => {
                  setIsDusterPaused(false);
                  setIsDusterStopped(false);
                  $('.chalk').css('display', 'none');
                }}
                onMouseLeave={() => {
                  setIsDusterPaused(true);
                  setIsDusterStopped(true);
                  $('.chalk').css('display', 'block');
                }}
                onClick={handleClearAll}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClearAll();
                  }
                }}
              >
                <Lottie
                  options={defaultOptions}
                  height={100}
                  width={100}
                  isStopped={isDusterStopped}
                  isPaused={isDusterPaused}
                />
              </div>
              <div
                className="download_icon"
                id="downloadIcon"
                onMouseEnter={() => {
                  setIsDownloadPaused(false);
                  setIsDownloadStopped(false);
                  $('.chalk').css('display', 'none');
                }}
                onMouseLeave={() => {
                  setIsDownloadPaused(true);
                  setIsDownloadStopped(true);
                  $('.chalk').css('display', 'block');
                }}
                onClick={() => {
                  setIsDownloadPaused(false);
                  setIsDownloadStopped(false);
                  $('.chalk').css('display', 'none');
                  setTimeout(() => {
                    downloadImage();
                  }, 1300);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setIsDownloadPaused(false);
                    setIsDownloadStopped(false);
                    $('.chalk').css('display', 'none');
                    setTimeout(() => {
                      downloadImage();
                    }, 1300);
                  }
                }}
              >
                <Lottie
                  options={downloadOptions}
                  height={100}
                  width={100}
                  isStopped={isDownloadStopped}
                  isPaused={isDownloadPaused}
                />
              </div>
              <div className="toggle__board">
                <ToggleButton
                  value="check"
                  selected={hideAll}
                  onChange={() => {
                    setHideAll(!hideAll);
                  }}
                />
              </div>
            </Popover>
          )}
        </div>
        <div className="flames__input__container">
          <div
            className={'flames__input' + ` ${person1NameValid ? 'editInputOn' : ''}`}
            id="manualInput1"
            onMouseEnter={handleMouseEnterInput}
            onMouseLeave={handleMouseLeaveInput}
          >
            <div className="input__tools">
              {name1edit ? (
                <MdOutlineEdit size={30} className="input__edit__icon edit_on" onClick={handleEditToggle} />
              ) : (
                <MdOutlineEditOff size={30} className="input__edit__icon" onClick={handleEditToggle} />
              )}
              <BsEraser
                size={30}
                className="input__erase__icon"
                onClick={() => {
                  setPerson1Name('');
                  setPerson1NameValid(false);
                }}
              />
            </div>
            <TextField
              id="person1_input"
              className={
                'input__textField' +
                ` ${person1NameError ? 'input_error' : ''} ${person1NameValid ? 'editInputOn' : ''}`
              }
              onDoubleClick={() => setName1edit(true)}
              value={person1Name || ''}
              label="Name 1"
              variant="standard"
              error={person1NameError}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onFocus={handleNameFocus}
              disabled={!name1edit}
            />
          </div>
          <div
            className={'flames__input' + ` ${person2NameValid ? 'editInputOn' : ''}`}
            id="manualInput2"
            onMouseEnter={handleMouseEnterInput}
            onMouseLeave={handleMouseLeaveInput}
          >
            <div className="input__tools">
              {name2edit ? (
                <MdOutlineEdit size={30} className="input__edit__icon edit_on" onClick={handleEditToggle} />
              ) : (
                <MdOutlineEditOff size={30} className="input__edit__icon" onClick={handleEditToggle} />
              )}
              <BsEraser
                size={30}
                className="input__erase__icon"
                onClick={() => {
                  setPerson2Name('');
                  setPerson2NameValid(false);
                }}
              />
            </div>
            <TextField
              id="person2_input"
              className={
                'input__textField' +
                ` ${person2NameError ? 'input_error' : ''} ${person2NameValid ? 'editInputOn' : ''}`
              }
              onDoubleClick={() => setName2edit(true)}
              value={person2Name || ''}
              label="Name 2"
              variant="standard"
              error={person2NameError}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onFocus={handleNameFocus}
              disabled={!name2edit}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
