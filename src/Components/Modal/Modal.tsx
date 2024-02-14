import { KeyboardEventHandler, MouseEventHandler, ReactNode, useEffect, useRef } from "react";
import css from "./Modal.module.scss";

export default function FormModal({ isEnabled, setIsEnabled, tabIndex, children }: FormModalProps) {
  const parentRef = useRef(null as null | HTMLDivElement);
  useEffect(() => {
    if (isEnabled) parentRef.current!.focus();
  }, [isEnabled]);
  const onClick: MouseEventHandler<HTMLDivElement> = (e): void => {
    if (e.currentTarget === e.target) setIsEnabled(false);
  };
  const onEscape: KeyboardEventHandler<HTMLDivElement> = (e): void => {
    if (e.key === "Escape") setIsEnabled(false);
  };
  return (
    <div
      ref={parentRef}
      tabIndex={tabIndex}
      className={css.Modal}
      hidden={!isEnabled}
      onClick={onClick}
      onKeyDown={onEscape}>
      {children}
    </div>
  );
}

interface FormModalProps {
  isEnabled: boolean;
  setIsEnabled: (visibility: boolean) => void;
  children?: ReactNode | ReactNode[];
  tabIndex: number;
}
