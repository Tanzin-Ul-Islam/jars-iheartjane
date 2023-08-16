import React from 'react';

const Button = ({ children, cls }) => {
  return (
    <button className={`${cls} bg-black text-white px-5 py-2 btn ff-Soleil700`}>
      {children}
    </button>
  );
};

export default Button;
