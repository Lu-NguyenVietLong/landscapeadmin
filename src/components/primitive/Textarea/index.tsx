import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextareaHTMLAttributes } from "react";

interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
}

const Textarea: React.FC<ITextareaProps> = ({
  name,
  label,
  ...textareaProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="textarea-group">
      {label && (
        <label htmlFor={name} className="textarea-label">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            id={name}
            {...field}
            {...textareaProps}
            onChange={(e) => field.onChange(e.target.value)}
            className={`textarea bg-slate-200 outline-none px-4 rounded-lg py-2 w-full ${
              errors[name] ? "textarea-error" : ""
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

export default Textarea;
