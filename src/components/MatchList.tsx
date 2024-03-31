import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const MatchList: React.FC<Props> = ({ children, ...props }) => {
  return (
    <div {...props} className={`flex relative flex-col gap-3 ${props.className}`}>
      {children}
    </div>
  );
};
