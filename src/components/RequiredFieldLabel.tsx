
import { ReactNode } from 'react';

interface RequiredFieldLabelProps {
  children: ReactNode;
  required?: boolean;
}

const RequiredFieldLabel = ({ children, required = true }: RequiredFieldLabelProps) => {
  return (
    <div className="flex items-center gap-1">
      <span>{children}</span>
      {required && <span className="text-red-500">*</span>}
    </div>
  );
};

export default RequiredFieldLabel;
