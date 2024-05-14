// This file aggregates interfaces and types used throughout app (with an exception of the interfaces for the components' props).

// Width and height are commonly used pair, so it gets its interface
export interface IWidthAndHeight {
  width: number;
  height: number;
}

// Image configuration
export interface IImageConfig {
  source: string; // It can be a path or a data-url.
  width: number;
  height: number;
  unit: PaperUnit;
}

// Interface for a margin
export interface IMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

// Intarface for printing paper configuration
export interface IPaperConfig {
  unit: PaperUnit;
  width: number;
  height: number;
  margin: IMargin;
  helpingCorners: boolean;
  helpingBorders: boolean;
  pagesCounter: boolean;
  getWithChangedOrientation: () => IPaperConfig;
}

// Type with possible to use units
export type PaperUnit = "mm" | "cm" | "in";

// Interface of sewing pattern. Every sewing pattern should be able to return its width, height and data-url.
export interface ISewingPatter {
  getWidth: () => number;
  getHeight: () => number;
  getDataUrl: () => string;
}

/* Interface of a pattern configurator. Configurator containes:
 * title,
 * picture(icon),
 * dictionaries with names of all manually inputed positions and all selects as keys and objects of messages for user, default values and current values,
 * functions informing about not defined positions and selects,
 * setters of positions and selects,
 * function that checks if the configuration is ready to be used (generate an intance of ISewingPattern),
 * funtion that returns the pattern (if possible),
 * funtion that returns the messages about the needed steps to complete the configuration.
 */
export interface IPatternConfigurator {
  title: string;
  picture: string;
  positions: { [key: string]: { message: string; default: number; value?: number } };
  selects: { [key: string]: { message: string; default: boolean; value?: boolean } };
  lackingPositions: () => string[];
  lackingSelects: () => string[];
  setPosition: (name: string, value: number) => void;
  setSelect: (name: string, value: boolean) => void;
  isReady: () => boolean;
  reset: () => void;
  getPattern: () => ISewingPatter;
  getUnreadyMessages: () => string[];
}
