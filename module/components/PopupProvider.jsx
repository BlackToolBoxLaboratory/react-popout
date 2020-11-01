import React, { useRef } from 'react';
import { render } from 'react-dom';

import PopupContext from './PopupContext.jsx';
import PopupContent from './PopupContent.jsx';

const TRANSITION_DURATION = 0.3 * 1000;

const PopupProvider = (props) => {
  const {
    children,
    defaultTransitionDuration = TRANSITION_DURATION,
    onShowing = () => {},
    onHiding = () => {},
  } = props;
  const refPopup = useRef();
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
    render(<PopupContent>{content}</PopupContent>, document.getElementById(id));
  };
  const _clearContent = () => {
    render(<PopupContent />, document.getElementById(id));
  };
  const _showingContent = (param) => {
    const { content } = param;
    const popup = refPopup.current;
    _clearTimeoutPopup();
    onShowing();
    _renderContent({ content });
    popup.classList.remove('popup-hidden');
    popup.classList.add('popup-showing');
  };
  const _hidingContent = (duration) => {
    const popup = refPopup.current;
    _clearTimeoutPopup();
    onHiding();
    popup.classList.remove('popup-showing');
    timeoutPopup = setTimeout(function countDown() {
      popup.classList.add('popup-hidden');
      _clearContent();
    }, duration);
  };

  const _showContent = (param = {}) => {
    const { content } = param;
    const popup = refPopup.current;
    if (popup.classList.contains('popup-showing')) {
      _renderContent({ content });
    } else {
      _showingContent({ content });
    }
  };
  const _hideContent = (param = {}) => {
    const { duration = defaultTransitionDuration } = param;
    const popup = refPopup.current;
    if (popup.classList.contains('popup-hidden')) {
      _clearContent();
    } else {
      _hidingContent(duration);
    }
  };

  return (
    <PopupContext.Provider value={{ show : _showContent, hide : _hideContent }}>
      <div className="btb-react-popup popup-hidden" ref={refPopup}>
        <div className="popup_mask" />
        <div id={id} className="popup_container" />
      </div>
      {children}
    </PopupContext.Provider>
  );
};

export default PopupProvider;