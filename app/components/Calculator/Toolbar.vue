<script setup lang="ts">
const { activeTool, selectedColor, COLORS, setTool, clearCanvas } = useCanvasState();

const tools = [
  { id: 'move', icon: 'i-ph-cursor-fill', label: 'Mover' },
  { id: 'draw_square', icon: 'i-ph-square-fill', label: 'Cuadro' },
  { id: 'draw_circle', icon: 'i-ph-circle-fill', label: 'Círculo' },
  { id: 'cut', icon: 'i-ph-scissors-fill', label: 'Cortar' },
  { id: 'fill', icon: 'i-ph-paint-bucket-fill', label: 'Pintar' }
] as const;
</script>

<template>
  <div class="flex flex-col gap-3 p-3 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-full shadow-sm z-20 items-center overflow-y-auto w-20 min-w-[5rem]">
    
    <!-- Título Vertical (Estético) -->
    <div class="hidden md:block py-2">
      <span class="text-[10px] font-bold text-neutral-300 uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
        Herramientas
      </span>
    </div>

    <!-- Botones de Herramientas -->
    <div class="flex flex-col gap-2 w-full">
      <UTooltip 
        v-for="tool in tools" 
        :key="tool.id" 
        :text="tool.label" 
        placement="right"
        :popper="{ arrow: true }"
      >
        <button
          @click="setTool(tool.id)"
          class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative group mx-auto"
          :class="activeTool === tool.id 
            ? 'bg-neutral-900 text-white shadow-lg scale-105 ring-2 ring-neutral-900 ring-offset-2 dark:bg-primary-500 dark:ring-primary-500' 
            : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800'"
        >
          <UIcon :name="tool.icon" class="text-2xl" />
          
          <!-- Indicador activo -->

        </button>
      </UTooltip>
    </div>
    
    <UDivider class="my-2" />
    
    <!-- Selector de Color -->
    <div class="flex flex-col gap-2 p-1.5 bg-neutral-50 dark:bg-neutral-800 rounded-full border border-neutral-100 dark:border-neutral-700 items-center">
      <UTooltip v-for="c in COLORS" :key="c.value" :text="c.label" placement="right">
        <button 
          @click="selectedColor = c.value"
          class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shadow-sm"
          :class="selectedColor === c.value ? 'border-neutral-800 dark:border-white scale-110 z-10' : 'border-transparent'"
          :style="{ backgroundColor: c.hex }"
        />
      </UTooltip>
    </div>

    <div class="flex-1" />
    
    <UTooltip text="Borrar Todo" placement="right">
      <UButton 
        icon="i-ph-trash-bold" 
        color="error" 
        variant="ghost" 
        size="xl" 
        square
        class="hover:bg-red-50 dark:hover:bg-red-900/20"
        @click="clearCanvas" 
      />
    </UTooltip>
  </div>
</template>