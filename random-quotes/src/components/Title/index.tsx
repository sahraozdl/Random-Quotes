// components/Title.tsx
import { ReactNode } from "react";

type TitleProps = {
  children: ReactNode;
};

export const Title = ({ children }: TitleProps) => {
  return (
    <h1 className="m-0 text-yellow-400 drop-shadow-3xl text-4xl font-extrabold h-1/5">
      {children}
    </h1>
  );
};

