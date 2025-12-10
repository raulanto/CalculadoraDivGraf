<script setup lang="ts">
// Layout principal
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden font-sans bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
    <!-- Navbar simple opcional -->
    <header class="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center px-4 justify-between z-40">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
          <UIcon name="i-ph-calculator-fill" class="text-xl" />
        </div>
        <h1 class="font-bold text-lg tracking-tight">Visual Fractions</h1>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          icon="i-ph-github-logo-fill"

          variant="ghost"
          to="https://github.com/raulanto"
          target="_blank"
        />
        <!-- Modo oscuro toggle (si tienes ColorMode configurado) -->
        <UColorModeButton />
      </div>
    </header>

    <div class="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
      <!-- Barra Lateral -->
      <CalculatorToolbar />

      <!-- Área Principal -->
      <div class="flex-1 flex flex-col relative overflow-hidden">
        <CalculatorCanvas />
        
        <!-- Barra Inferior de Resultados -->
        <CalculatorFormulaBar />
      </div>
    </div>
  </div>
</template>