import React from 'react';

const PopupContent = (props) => {
  const { children } = props;
  return <div className="container_content">{children}</div>;
};

export default PopupContent;
