import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

const Input: React.FC<IInputProps> = ({ name, label, ...inputProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            {...field}
            {...inputProps}
            onChange={(e) => {
              const value =
                inputProps.type === "number"
                  ? parseFloat(e.target.value)
                  : e.target.value;
              field.onChange(value);
            }}
            className={`input bg-slate-200 outline-none px-4 rounded-lg py-2 w-full ${
              errors[name] ? "input-error" : ""
            }`}
          />
        )}
      />
      {errors[name] && (
        <p className="text-orange-600">{errors[name]?.message?.toString()}</p>
      )}
    </div>
  );
};

export default Input;
