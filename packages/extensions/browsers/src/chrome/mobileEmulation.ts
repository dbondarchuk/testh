/** Mobile emulation using predefined device */
export type ChromeMobileEmulationDeviceOptions = {
  /** Name of the predefined device */
  deviceName: string;
};

/** Device configurations for the mobile emulation */
export type ChromeMobileEmulationMetricsOptions = {
  /** Device width */
  width: number;

  /** Device height */
  height: number;

  /** Device pixel ratio */
  pixelRatio: number;

  /** Whether to emulate touch events (defaults to true, usually does not need to be set) */
  touch?: boolean;
};

/** Manual configuration for the mobile emulation */
export type MobileEmulationConfigurableOptions = {
  /** Device configuration  */
  deviceMetrics?: ChromeMobileEmulationMetricsOptions;

  /** Custom user agent */
  userAgent?: string;
};

/** Options for mobile emulation */
export type ChromeMobileEmulationOptions =
  | ChromeMobileEmulationDeviceOptions
  | MobileEmulationConfigurableOptions;
