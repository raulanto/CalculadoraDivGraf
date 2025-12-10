<script setup lang="ts">
const { zoomLevel, changeZoom, resetZoom } = useCanvasState();
</script>

<template>
  <div class="absolute top-4 right-4 flex flex-col gap-1 z-50 bg-white p-1.5 rounded-xl shadow-md border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
    <UTooltip text="Acercar" placement="left">
      <UButton 
        icon="i-ph-plus-bold" 

        variant="ghost" 
        size="sm"
        square
        @click="changeZoom(0.1)" 
      />
    </UTooltip>
    
    <div class="text-[10px] font-mono text-center text-neutral-500 dark:text-neutral-400 py-1 select-none">
      {{ Math.round(zoomLevel * 100) }}%
    </div>
    
    <UTooltip text="Alejar" placement="left">
      <UButton 
        icon="i-ph-minus-bold" 

        variant="ghost" 
        size="sm"
        square
        @click="changeZoom(-0.1)" 
      />
    </UTooltip>
    
    <UDivider class="my-1" />
    
    <UTooltip text="Restaurar (100%)" placement="left">
      <UButton 
        icon="i-ph-arrows-out-line-horizontal-bold" 

        variant="ghost" 
        size="sm"
        square
        @click="resetZoom" 
      />
    </UTooltip>
  </div>
</template>