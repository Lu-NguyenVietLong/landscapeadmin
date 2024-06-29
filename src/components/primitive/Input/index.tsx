import React from "react";

interface IInput {
  register: any;
  error: any;
}

const index = ({ register, error, ...inputProps }: IInput) => {
  return (
    <>
      <input ref={register} {...inputProps} />
      {error && <p>{error.message}</p>}
    </>
  );
};

export default index;
