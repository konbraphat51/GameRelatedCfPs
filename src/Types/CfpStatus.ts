// Derived call-for-papers status of a venue relative to a reference date.

/** "unknown": CfP not yet published; "open": at least one deadline remains; "closed": all passed. */
export type CfpStatus = "unknown" | "open" | "closed";

/** Every status value, in display order. */
export const CFP_STATUS_VALUES: readonly CfpStatus[] = ["open", "unknown", "closed"];
