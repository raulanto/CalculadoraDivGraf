// types/index.ts

export type ShapeType = "square" | "circle";
export type ToolId = "move" | "draw_square" | "draw_circle" | "cut" | "fill";

export interface Shape {
  id: number;
  type: ShapeType;
  x: number;
  y: number;
  size: number;
  denominator: number;
  slices: boolean[]; // Array de estados (true=pintado, false=vacío)
  color: string;
  sign: 1 | -1; // 1 para sumar, -1 para restar
}

export interface Fraction {
  n: number;
  d: number;
}

export interface ColorOption {
  value: string;
  hex: string;
  label: string;
}
