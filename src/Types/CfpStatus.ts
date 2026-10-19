// Derived call-for-papers status of a venue relative to a reference date.

/**
 * "open": a deadline remains; "rolling": no deadline but submissions accepted any time;
 * "unknown": CfP not yet published; "closed": every deadline has passed.
 */
export type CfpStatus = "open" | "rolling" | "unknown" | "closed";

/** Every status value, in display order. */
export const CFP_STATUS_VALUES: readonly CfpStatus[] = ["open", "rolling", "unknown", "closed"];
