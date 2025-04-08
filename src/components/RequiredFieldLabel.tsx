
import { ReactNode } from 'react';

interface RequiredFieldLabelProps {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
}

const RequiredFieldLabel = ({ children, required = true, htmlFor }: RequiredFieldLabelProps) => {
  return (
    <div className="flex items-center gap-1 mb-1">
      <label 
        htmlFor={htmlFor} 
        className="text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900"
      >
        {children}
      </label>
      {required && (
        <span 
          className="text-red-500 font-bold" 
          aria-label="Champ obligatoire"
          title="Champ obligatoire"
        >*</span>
      )}
    </div>
  );
};

export default RequiredFieldLabel;
