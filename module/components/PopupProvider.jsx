import React, { useState, useRef } from 'react';
import { render } from 'react-dom';

import PopupContext from './PopupContext.jsx';
import PopupContent from './PopupContent.jsx';

const TRANSITION_DURATION = 0.3 * 1000;

const PopupProvider = (props) => {
  const {
    children,
    defaultTransitionDuration = TRANSITION_DURATION,
    defaultPersistent = false,
    onShow = () => { },
    onHide = () => { },
    onMaskClick = () => { },
  } = props;
  const refPopup = useRef();
  const [isPersistent, setPersistent] = useState(defaultPersistent);
  const id = `popup_${Date.now()}_${Math.ceil(Math.random() * 1000)}`;
  let timeoutPopup;

  const _clearTimeoutPopup = () => {
    if (timeoutPopup) {
      clearTimeout(timeoutPopup);
      timeoutPopup = undefined;
    }
  };

  const _renderContent = (data) => {
    const { content } = data;
    if (document.getElementById(id)) {
      render(<PopupContent>{content}</PopupContent>, document.getElementById(id));
    }
  };
  const _clearContent = () => {
    if (document.getElementById(id)) {
      render(<PopupContent />, document.getElementById(id));
    }
  };
  const _showingContent = (param) => {
    const { content } = param;
    const popup = refPopup.current;
    _clearTimeoutPopup();
    onShow();
    _renderContent({ content });
    popup.classList.remove('popup-hidden');
    popup.classList.add('popup-showing');
  };
  const _hidingContent = (duration) => {
    const popup = refPopup.current;
    _clearTimeoutPopup();
    onHide();
    popup.classList.remove('popup-showing');
    timeoutPopup = setTimeout(function countDown() {
      popup.classList.add('popup-hidden');
      _clearContent();
    }, duration);
  };

  const _showContent = (param = {}) => {
    const { content, persistent = defaultPersistent } = param;
    const popup = refPopup.current;
    if (persistent !== isPersistent) {
      setPersistent(persistent);
    }
    if (popup.classList.contains('popup-showing')) {
      onShow();
      _renderContent({ content });
    } else {
      _showingContent({ content });
    }
  };
  const _hideContent = (param = {}) => {
    const { duration = defaultTransitionDuration } = param;
    const popup = refPopup.current;
    if (popup.classList.contains('popup-hidden')) {
      onHide();
      _clearContent();
    } else {
      _hidingContent(duration);
    }
  };
  const _clickMask = () => {
    if (!isPersistent) {
      _hideContent();
    }
    onMaskClick();
  };

  return (
    <PopupContext.Provider value={{ show : _showContent, hide : _hideContent }}>
      <div className="btb-react-popup popup-hidden" ref={refPopup}>
        <div className="popup_mask" onClick={_clickMask} />
        <div id={id} className="popup_container" />
      </div>
      {children}
    </PopupContext.Provider>
  );
};

export default PopupProvider;