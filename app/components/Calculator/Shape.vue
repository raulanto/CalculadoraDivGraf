<script setup lang="ts">
import type { Shape } from '~/types';

const props = defineProps<{
  shape: Shape;
  isActiveToolMove: boolean;
}>();

const emit = defineEmits<{
  (e: 'click-shape', shape: Shape): void;
  (e: 'click-slice', shape: Shape, index: number): void;
  (e: 'toggle-sign', shape: Shape): void;
  (e: 'remove', id: number): void;
  (e: 'resize', shape: Shape): void;
  (e: 'start-move', event: MouseEvent, shape: Shape): void;
}>();

const { getColorHex, getCirclePaths } = useCanvasState(); // Helpers y estado
// Nota: getCirclePaths también lo movimos a useFractionMath, pero para acceso rápido a state usamos el de CanvasState si existe, o FractionMath.
// Usaremos useFractionMath para getCirclePaths para ser consistentes.
const { getCirclePaths: calculatePaths } = useFractionMath();

const canvasState = useCanvasState(); 

const circlePaths = computed(() => {
  if (props.shape.type !== 'circle') return [];
  return calculatePaths(props.shape.size, props.shape.denominator);
});

const activeSlices = computed(() => props.shape.slices.filter(Boolean).length);
const shapeColor = computed(() => canvasState.getColorHex(props.shape.color));
</script>

<template>
  <g 
    :transform="`translate(${shape.x}, ${shape.y})`" 
    class="pointer-events-auto group/shape"
  >
    <!-- Grupo Principal con eventos de movimiento -->
    <g 
      @mousedown.stop="emit('start-move', $event, shape)"
      class="transition-transform duration-200 ease-out"
      :class="{'hover:scale-[1.02] cursor-move': isActiveToolMove}"
    >
      <!-- Indicador de Signo (Halo de fondo) -->
      <component 
        :is="shape.type === 'circle' ? 'circle' : 'rect'"
        :cx="shape.type === 'circle' ? shape.size/2 : undefined"
        :cy="shape.type === 'circle' ? shape.size/2 : undefined"
        :r="shape.type === 'circle' ? (shape.size/2) + 6 : undefined"
        :x="shape.type === 'square' ? -6 : undefined"
        :y="shape.type === 'square' ? -6 : undefined"
        :width="shape.type === 'square' ? shape.size + 12 : undefined"
        :height="shape.type === 'square' ? shape.size + 12 : undefined"
        :rx="shape.type === 'square' ? 12 : undefined"
        fill="none" 
        :stroke="shape.sign === 1 ? '#00DC82' : '#EF4444'" 
        stroke-width="3" 
        stroke-dasharray="6 4" 
        opacity="0.3" 
        class="transition-opacity group-hover/shape:opacity-60"
      />

      <!-- Sombra SVG -->
      <defs>
        <filter :id="`shadow-${shape.id}`" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.1"/>
        </filter>
      </defs>

      <!-- --- RENDERIZADO CUADRADO --- -->
      <template v-if="shape.type === 'square'">
        <!-- Fondo Blanco -->
        <rect 
          :width="shape.size" :height="shape.size" 
          fill="white" stroke="#334155" stroke-width="2" rx="4"
          :filter="`url(#shadow-${shape.id})`"
          @click.stop="emit('click-shape', shape)" 
        />
        <!-- Slices -->
        <g v-for="(active, i) in shape.slices" :key="i">
          <rect 
            :x="i * (shape.size / shape.denominator)" y="0" 
            :width="shape.size / shape.denominator" :height="shape.size"
            :fill="active ? shapeColor : 'transparent'"
            stroke="#334155" stroke-width="1"
            :stroke-dasharray="active ? '' : '4 2'"
            class="hover:opacity-80 transition-opacity cursor-pointer"
            @click.stop="emit('click-slice', shape, i)"
          />
        </g>
        <!-- Borde Superior (para limpieza visual) -->
        <rect 
          :width="shape.size" :height="shape.size" 
          fill="none" stroke="#334155" stroke-width="2" rx="4" 
          class="pointer-events-none"
        />
      </template>

      <!-- --- RENDERIZADO CÍRCULO --- -->
      <template v-else>
        <!-- Fondo Blanco -->
        <circle 
          :cx="shape.size/2" :cy="shape.size/2" :r="shape.size/2" 
          fill="white" stroke="#334155" stroke-width="2"
          :filter="`url(#shadow-${shape.id})`"
          @click.stop="emit('click-shape', shape)" 
        />
        <!-- Slices (Paths) -->
        <path 
          v-for="(path, i) in circlePaths" :key="i"
          :d="path"
          :fill="shape.slices[i] ? shapeColor : 'transparent'"
          stroke="#334155" stroke-width="1"
          :stroke-dasharray="shape.slices[i] ? '' : '4 2'"
          class="hover:opacity-80 transition-opacity cursor-pointer"
          @click.stop="emit('click-slice', shape, i)"
        />
        <!-- Borde Superior -->
        <circle 
          :cx="shape.size/2" :cy="shape.size/2" :r="shape.size/2" 
          fill="none" stroke="#334155" stroke-width="2" 
          class="pointer-events-none"
        />
      </template>
    </g>

    <!-- Overlay de Controles (Siempre visible al hover del grupo o siempre visible si prefieres) -->
    <foreignObject :x="0" :y="-50" :width="shape.size" height="50" class="overflow-visible pointer-events-none">
      <div class="flex justify-between w-full px-1 pointer-events-auto opacity-0 group-hover/shape:opacity-100 transition-opacity duration-200">
        <div class="flex gap-1">
          <!-- Botón Signo -->
          <button 
            @click.stop="emit('toggle-sign', shape)"
            class="w-9 h-9 rounded-full shadow-lg flex items-center justify-center border-2 bg-white transition-transform hover:scale-110"
            :class="shape.sign === 1 ? 'border-primary-500 text-primary-500' : 'border-red-500 text-red-500'"
            title="Cambiar operación (+/-)"
          >
            <UIcon :name="shape.sign === 1 ? 'i-ph-plus-bold' : 'i-ph-minus-bold'" class="text-lg" />
          </button>
          
          <!-- Botón Resize -->
          <button 
            @click.stop="emit('resize', shape)" 
            class="w-9 h-9 rounded-full shadow-lg flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:text-primary-500 hover:border-primary-500 transition-colors"
            title="Cambiar tamaño"
          >
            <UIcon name="i-ph-arrows-out-simple-bold" class="text-lg" />
          </button>
        </div>
        
        <!-- Botón Eliminar -->
        <button 
          @click.stop="emit('remove', shape.id)" 
          class="w-9 h-9 rounded-full shadow-lg flex items-center justify-center border border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors"
          title="Eliminar figura"
        >
           <UIcon name="i-ph-x-bold" class="text-lg" />
        </button>
      </div>
    </foreignObject>

    <!-- Etiqueta Fracción (Debajo) -->
    <foreignObject :x="0" :y="shape.size + 8" :width="shape.size" height="50" class="pointer-events-none text-center">
      <div class="inline-flex flex-col items-center bg-white/90 backdrop-blur px-3 py-1 rounded-xl border border-gray-200 shadow-sm">
        <span class="text-lg font-bold font-mono leading-none" :class="shape.sign === 1 ? 'text-gray-700' : 'text-red-500'">{{ activeSlices }}</span>
        <div class="w-full h-0.5 bg-gray-300 my-0.5"></div>
        <span class="text-lg font-bold font-mono leading-none text-gray-700">{{ shape.denominator }}</span>
      </div>
    </foreignObject>
  </g>
</template>