import { useContext } from 'react';

import PopupContext from '../components/PopupContext.jsx';

const usePopup = () => {
  return useContext(PopupContext);
};

export { usePopup };
