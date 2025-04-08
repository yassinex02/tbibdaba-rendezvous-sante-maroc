
import { ReactNode } from 'react';

interface RequiredFieldLabelProps {
  children: ReactNode;
  required?: boolean;
}

const RequiredFieldLabel = ({ children, required = true }: RequiredFieldLabelProps) => {
  return (
    <div className="flex items-center gap-1 mb-1">
      <span className="text-sm font-medium text-gray-700">{children}</span>
      {required && (
        <span className="text-red-500 font-bold" aria-label="Champ obligatoire">*</span>
      )}
    </div>
  );
};

export default RequiredFieldLabel;
