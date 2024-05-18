import { KeyboardEventHandler, MouseEventHandler, ReactNode, useEffect, useRef } from "react";
import css from "./Modal.module.scss";

// Modal to show elements over the main webapp structure
export default function FormModal({ isEnabled, setIsEnabled, tabIndex, children }: FormModalProps) {
  const parentRef = useRef(null as null | HTMLDivElement);
  // If modal has been enabled, focus on it
  useEffect(() => {
    if (isEnabled) parentRef.current!.focus();
  }, [isEnabled]);
  // If clicked outside content area, disable modal
  const onClick: MouseEventHandler<HTMLDivElement> = (e): void => {
    if (e.currentTarget === e.target) setIsEnabled(false);
  };
  // Disable modal with exc key
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
      <div className={css.Content}>{children}</div>
    </div>
  );
}

interface FormModalProps {
  isEnabled: boolean;
  setIsEnabled: (visibility: boolean) => void;
  children?: ReactNode;
  tabIndex: number;
}
