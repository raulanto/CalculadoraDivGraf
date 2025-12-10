<script setup lang="ts">
import { useMouseInElement } from '@vueuse/core';
import type { Shape } from '~/types';

const canvasRef = ref<HTMLElement | null>(null);
const { elementX, elementY } = useMouseInElement(canvasRef);

const { 
  shapes, activeTool, zoomLevel, selectedColor,
  addShape, removeShape, setTool, getColorHex, cycleShapeSize
} = useCanvasState();

// --- Lógica de Dibujo ---
const isDrawing = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const drawPreview = ref({ x: 0, y: 0, w: 0, h: 0 });

// --- Lógica de Movimiento ---
const isMoving = ref(false);
const movingShapeId = ref<number | null>(null);
const moveOffset = ref({ x: 0, y: 0 });

// Helper para obtener coordenadas "virtuales" corregidas por el zoom
const getVirtualCoords = () => {
  return {
    x: elementX.value / zoomLevel.value,
    y: elementY.value / zoomLevel.value
  };
};

const handleMouseDown = (e: MouseEvent) => {
  const { x, y } = getVirtualCoords();

  // Herramientas de dibujo
  if (activeTool.value.startsWith('draw_')) {
    isDrawing.value = true;
    dragStart.value = { x, y };
    drawPreview.value = { x, y, w: 0, h: 0 };
    return; // Stop here
  }
};

const handleMouseMove = (e: MouseEvent) => {
  const { x, y } = getVirtualCoords();

  // 1. Dibujando (Preview)
  if (isDrawing.value) {
    const w = Math.abs(x - dragStart.value.x);
    const h = Math.abs(y - dragStart.value.y);
    const startX = Math.min(x, dragStart.value.x);
    const startY = Math.min(y, dragStart.value.y);
    
    // Forzamos cuadrado si es círculo o cuadrado (para mantener proporción matemática visual)
    const size = Math.max(w, h);
    drawPreview.value = { x: startX, y: startY, w: size, h: size };
  }

  // 2. Moviendo figura
  if (isMoving.value && movingShapeId.value !== null) {
    const shape = shapes.value.find(s => s.id === movingShapeId.value);
    if (shape) {
      shape.x = x - moveOffset.value.x;
      shape.y = y - moveOffset.value.y;
    }
  }
};

const handleMouseUp = (e: MouseEvent) => {
  // Finalizar Dibujo
  if (isDrawing.value) {
    if (drawPreview.value.w > 20) { // Tamaño mínimo para evitar clics accidentales
      const newShape: Shape = {
        id: Date.now(),
        type: activeTool.value === 'draw_square' ? 'square' : 'circle',
        x: drawPreview.value.x,
        y: drawPreview.value.y,
        size: drawPreview.value.w,
        denominator: 2,
        slices: [true, false],
        color: selectedColor.value,
        sign: 1
      };
      addShape(newShape);
      
      // Opcional: Volver a herramienta mover automáticamente después de dibujar
      // setTool('move'); 
    }
    isDrawing.value = false;
    drawPreview.value = { x: 0, y: 0, w: 0, h: 0 };
  }

  // Finalizar Movimiento
  if (isMoving.value) {
    isMoving.value = false;
    movingShapeId.value = null;
  }
};

// --- Manejadores de Eventos desde Shape.vue ---

const onStartMoveShape = (event: MouseEvent, shape: Shape) => {
  if (activeTool.value === 'move') {
    isMoving.value = true;
    movingShapeId.value = shape.id;
    const { x, y } = getVirtualCoords();
    moveOffset.value = { x: x - shape.x, y: y - shape.y };
  }
};

const onShapeClick = (shape: Shape) => {
  // Herramienta Cortar: Aumentar denominador
  if (activeTool.value === 'cut') {
    if (shape.denominator < 20) {
      shape.denominator++;
      // Rellenar array de slices
      while(shape.slices.length < shape.denominator) {
        shape.slices.push(false);
      }
    }
  }
};

const onSliceClick = (shape: Shape, index: number) => {
  // Herramienta Pintar
  if (activeTool.value === 'fill') {
    shape.color = selectedColor.value; // Actualizar color al seleccionado
    shape.slices[index] = !shape.slices[index]; // Toggle
  } 
  // Herramienta Cortar también funciona en slices
  else if (activeTool.value === 'cut') {
    onShapeClick(shape);
  }
};

const onToggleSign = (shape: Shape) => {
  shape.sign = shape.sign * -1 as 1 | -1;
};

const cursorClass = computed(() => {
  switch(activeTool.value) {
    case 'draw_square': case 'draw_circle': return 'cursor-crosshair';
    case 'move': return 'cursor-default'; // Shape tendrá cursor-move al hover
    case 'cut': return 'cursor-[url(https://api.iconify.design/ph:scissors-fill.svg),_pointer]'; // Ejemplo cursor personalizado
    case 'fill': return 'cursor-[url(https://api.iconify.design/ph:paint-bucket-fill.svg),_pointer]';
    default: return '';
  }
});
</script>

<template>
  <div 
    ref="canvasRef" 
    class="relative w-full h-full overflow-hidden bg-neutral-50 dark:bg-neutral-800 dot-grid select-none"
    :class="cursorClass"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <!-- Controles Zoom -->
    <CalculatorZoomControls />

    <!-- SVG Container -->
    <svg class="w-full h-full absolute inset-0 pointer-events-none overflow-visible">
      <defs>
        <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" class="text-neutral-300 dark:text-neutral-800" fill="currentColor" />
        </pattern>
      </defs>
      
      <!-- Grupo con Zoom -->
      <g :transform="`scale(${zoomLevel})`" class="origin-top-left">
        
        <!-- Renderizar Figuras -->
        <CalculatorShape 
          v-for="shape in shapes" 
          :key="shape.id"
          :shape="shape"
          :is-active-tool-move="activeTool === 'move'"
          @start-move="onStartMoveShape"
          @click-shape="onShapeClick"
          @click-slice="onSliceClick"
          @toggle-sign="onToggleSign"
          @remove="removeShape"
          @resize="cycleShapeSize"
        />
        
        <!-- Previsualización de Dibujo (Ghost) -->
        <g v-if="isDrawing" class="pointer-events-none">
           <rect 
            v-if="activeTool === 'draw_square'"
            :x="drawPreview.x" :y="drawPreview.y" 
            :width="drawPreview.w" :height="drawPreview.h"
            class="fill-primary-500/10 stroke-primary-500 stroke-2 stroke-dashed rx-1"
          />
          <circle 
            v-if="activeTool === 'draw_circle'"
            :cx="drawPreview.x + drawPreview.w/2" :cy="drawPreview.y + drawPreview.h/2" 
            :r="drawPreview.w/2"
            class="fill-primary-500/10 stroke-primary-500 stroke-2 stroke-dashed"
          />
          <!-- Medida del dibujo -->
          <text 
            :x="drawPreview.x + drawPreview.w + 10" 
            :y="drawPreview.y + drawPreview.h + 20" 
            class="text-xs font-mono fill-primary-600 font-bold"
          >
            {{ Math.round(drawPreview.w) }}px
          </text>
        </g>

      </g>
    </svg>
  </div>
</template>

<style scoped>
.dot-grid {
  /* Fallback CSS grid si SVG pattern falla, o complementario */
  background-size: 24px 24px;
  background-image: radial-gradient(#cbd5e1 1.5px, transparent 1.5px);
}
</style>