// Type declarations for Tremor components
import "@tremor/react";

declare module "@tremor/react" {
  export type ValueFormatter = (value: number) => string;
} 