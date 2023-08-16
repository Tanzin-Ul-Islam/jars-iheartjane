import React from 'react';

const Input = ({ label, placeholder, type, cls, handleInput, name, errors, wth }) => {
  return (
    <>
      <div style={{ width: `${wth} !important` }}>
        <input
          type={type}
          name={name}
          onChange={handleInput}
          placeholder={placeholder}
          className={`${cls} p-2 w-100 my-2 border-secondary border rounded-2`}
        />
        {
          errors && (
            <div>
              <span className="text-danger mt-2 fs-12">
                *&nbsp;{errors}
              </span>
            </div>
          )
        }
      </div>
    </>
  );
};

export default Input;

export const Select = ({ options, cls, handleInput, name }) => {
  return (
    <select name={name} id="" className={`${cls} my-auto p-2 rounded-2`} onChange={handleInput}>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
