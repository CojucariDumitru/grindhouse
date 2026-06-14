import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

const fieldBase =
  'w-full bg-black border-2 border-grey-mid text-white font-body px-4 py-3 ' +
  'placeholder:text-grey-mid focus:outline-none focus:border-red transition-colors';

function Label({ label, htmlFor, required }: { label: string; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="label text-white/70 block mb-2">
      {label} {required && <span className="text-red">*</span>}
    </label>
  );
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-red text-xs font-mono">{message}</p>;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, id, className, ...props }, ref) => (
    <div>
      {label && <Label label={label} htmlFor={id} required={required} />}
      <input
        ref={ref}
        id={id}
        className={clsx(fieldBase, error && 'border-red', className)}
        {...props}
      />
      <Error message={error} />
    </div>
  ),
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, id, className, children, ...props }, ref) => (
    <div>
      {label && <Label label={label} htmlFor={id} required={required} />}
      <select
        ref={ref}
        id={id}
        className={clsx(fieldBase, 'appearance-none cursor-pointer', error && 'border-red', className)}
        {...props}
      >
        {children}
      </select>
      <Error message={error} />
    </div>
  ),
);
Select.displayName = 'Select';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, id, className, ...props }, ref) => (
    <div>
      {label && <Label label={label} htmlFor={id} required={required} />}
      <textarea
        ref={ref}
        id={id}
        className={clsx(fieldBase, 'resize-y min-h-[120px]', error && 'border-red', className)}
        {...props}
      />
      <Error message={error} />
    </div>
  ),
);
Textarea.displayName = 'Textarea';
