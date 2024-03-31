import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const TitleColumn: React.FC<Props> = ({ children, ...props }) => {
  return (
    <div {...props} className={`text-center relative font-semibold border py-2 rounded-md ${props.className}`}>
      {children}
    </div>
  );
};
