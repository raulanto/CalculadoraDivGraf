<script setup lang="ts">
import { useFractionMath } from '~/composables/useFractionMath';

const { shapes } = useCanvasState();
const { calculateTotalFraction, getStepsToSolution } = useFractionMath();

// Calculamos el resultado reactivamente
const totalFraction = computed(() => calculateTotalFraction(shapes.value));
const resultDecimal = computed(() => {
  if (totalFraction.value.d === 0) return 0;
  return (totalFraction.value.n / totalFraction.value.d).toFixed(3);
});

// Helper para contar slices activos en una figura
const getActiveCount = (slices: boolean[]) => slices.filter(Boolean).length;

// Control del panel de pasos
const showSteps = ref(false);

// Verificar si hay una operación real (más de una figura o alguna resta)
const hasOperation = computed(() => {
  return shapes.value.length > 1 || shapes.value.some(s => s.sign === -1);
});

// Obtener los pasos de la solución
const steps = computed(() => getStepsToSolution(shapes.value));
</script>

<template>
  <div class="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-30 relative">
    
    <!-- Área Principal del Footer -->
    <div class="h-28 flex items-center px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      
      <div class="flex-1 overflow-x-auto flex items-center gap-4 py-2 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700">
        
        <!-- Estado Vacío -->
        <div v-if="shapes.length === 0" class="flex items-center gap-3 text-neutral-400 dark:text-neutral-500 italic text-sm w-full justify-center opacity-70">
          <UIcon name="i-ph-pencil-simple-slash" class="text-xl" />
          <span>Agrega figuras al lienzo para construir tu ecuación...</span>
        </div>

        <!-- Constructor de Ecuación -->
        <div v-else class="flex items-center gap-2 px-4 min-w-max">
          
          <template v-for="(shape, idx) in shapes" :key="shape.id">
            
            <!-- Operador (+ o -) -->
            <div v-if="idx > 0" class="text-2xl font-black px-2 flex items-center">
               <span v-if="shape.sign === 1" class="text-neutral-300 dark:text-neutral-600">+</span>
               <span v-else class="text-red-300 dark:text-red-700">-</span>
            </div>
            <div v-else-if="shape.sign === -1" class="text-2xl font-black text-red-300 dark:text-red-700 px-2">-</div>

            <!-- Mini Tarjeta de Fracción -->
            <div 
              class="flex flex-col items-center px-4 py-2 rounded-xl border-2 transition-all hover:scale-105"
              :class="shape.sign === 1 
                ? 'bg-neutral-50 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700' 
                : 'bg-red-50/50 border-red-100 dark:bg-red-900/20 dark:border-red-800'"
            >
              <span class="text-xl font-bold font-mono" :class="shape.sign === 1 ? 'text-neutral-700 dark:text-neutral-200' : 'text-red-500'">
                {{ getActiveCount(shape.slices) }}
              </span>
              <div class="w-8 h-0.5 bg-neutral-300 dark:bg-neutral-600 my-1 rounded-full"></div>
              <span class="text-xl font-bold font-mono text-neutral-700 dark:text-neutral-200">
                {{ shape.denominator }}
              </span>
            </div>

          </template>

          <!-- Igual -->
          <div class="text-3xl font-black text-neutral-300 px-6">=</div>

          <!-- Caja de Resultado -->
          <div class="flex items-center gap-6 bg-primary-50 dark:bg-primary-900/20 px-8 py-3 rounded-2xl border-2 border-primary-200 dark:border-primary-800 shadow-sm animate-pulse">
            
            <!-- Fracción Simplificada -->
            <div class="flex flex-col items-center">
              <span class="text-3xl font-black font-mono text-primary-600 dark:text-primary-400">
                {{ totalFraction.n }}
              </span>
              <div class="w-10 h-1 bg-primary-500 my-1 rounded-full"></div>
              <span class="text-3xl font-black font-mono text-primary-600 dark:text-primary-400">
                {{ totalFraction.d }}
              </span>
            </div>
            
            <!-- Separador Vertical -->
            <div class="h-12 w-px bg-primary-200 dark:bg-primary-800"></div>
            
            <!-- Valor Decimal -->
            <div class="flex flex-col">
              <span class="text-[10px] uppercase font-bold text-primary-400 tracking-wider">Decimal</span>
              <span class="text-xl font-mono font-bold text-primary-700 dark:text-primary-300">
                {{ resultDecimal }}
              </span>
            </div>
          </div>

          <!-- Botón Ver Pasos (solo si hay operación) -->
          <button
            v-if="hasOperation"
            @click="showSteps = !showSteps"
            class="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary-200 dark:border-primary-800 bg-white dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-primary-600 dark:text-primary-400 font-semibold text-sm"
          >
            <UIcon :name="showSteps ? 'i-ph-caret-up-bold' : 'i-ph-caret-down-bold'" class="text-lg" />
            <span>{{ showSteps ? 'Ocultar' : 'Ver' }} Pasos</span>
          </button>

        </div>
      </div>
    </div>

    <!-- Panel de Pasos (Colapsable) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[600px]"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 max-h-[600px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showSteps && hasOperation" class="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
        <div class="px-6 py-6 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
          
          <h3 class="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <UIcon name="i-ph-list-numbers-bold" class="text-primary-500" />
            Pasos de la Solución
          </h3>

          <!-- Paso 1: Fracciones Originales -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">1</div>
              <h4 class="font-semibold text-neutral-700 dark:text-neutral-300">Fracciones originales:</h4>
            </div>
            <div class="ml-10 bg-white dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
              <p class="font-mono text-lg text-neutral-800 dark:text-neutral-200">{{ steps.original }}</p>
            </div>
          </div>

          <!-- Paso 2: Denominador Común -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">2</div>
              <h4 class="font-semibold text-neutral-700 dark:text-neutral-300">Encontrar el denominador común (MCM):</h4>
            </div>
            <div class="ml-10 bg-white dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
              <p class="text-neutral-600 dark:text-neutral-400 mb-2">{{ steps.mcmExplanation }}</p>
              <p class="font-mono text-lg font-bold text-primary-600 dark:text-primary-400">MCM = {{ steps.commonDenom }}</p>
            </div>
          </div>

          <!-- Paso 3: Convertir Fracciones -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">3</div>
              <h4 class="font-semibold text-neutral-700 dark:text-neutral-300">Convertir cada fracción al denominador común:</h4>
            </div>
            <div class="ml-10 space-y-2">
              <div v-for="(conversion, idx) in steps.conversions" :key="idx" class="bg-white dark:bg-neutral-900 rounded-lg p-3 border border-neutral-200 dark:border-neutral-800">
                <p class="font-mono text-neutral-800 dark:text-neutral-200">{{ conversion }}</p>
              </div>
            </div>
          </div>

          <!-- Paso 4: Sumar Numeradores -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">4</div>
              <h4 class="font-semibold text-neutral-700 dark:text-neutral-300">Sumar/restar los numeradores:</h4>
            </div>
            <div class="ml-10 bg-white dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
              <p class="font-mono text-lg text-neutral-800 dark:text-neutral-200 mb-2">{{ steps.numeratorSum }}</p>
              <p class="font-mono text-lg font-bold text-primary-600 dark:text-primary-400">{{ steps.beforeSimplify }}</p>
            </div>
          </div>

          <!-- Paso 5: Simplificar -->
          <div v-if="steps.simplified" class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">5</div>
              <h4 class="font-semibold text-neutral-700 dark:text-neutral-300">Simplificar el resultado:</h4>
            </div>
            <div class="ml-10 bg-white dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
              <p class="text-neutral-600 dark:text-neutral-400 mb-2">{{ steps.simplifyExplanation }}</p>
              <p class="font-mono text-2xl font-bold text-green-600 dark:text-green-400">{{ steps.finalResult }}</p>
            </div>
          </div>

          <!-- Resultado Final (si no se simplificó) -->
          <div v-else>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
              <h4 class="font-semibold text-green-600 dark:text-green-400">Resultado final:</h4>
            </div>
            <div class="ml-10 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
              <p class="font-mono text-2xl font-bold text-green-600 dark:text-green-400">{{ steps.finalResult }}</p>
            </div>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>
