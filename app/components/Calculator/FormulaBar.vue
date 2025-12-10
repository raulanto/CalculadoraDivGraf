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
            <span>{{ showSteps ? 'Ocultar' : 'Ver' }} Pasos Detallados</span>
          </button>

        </div>
      </div>
    </div>

    <!-- Panel de Pasos (Colapsable) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[800px]"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 max-h-[800px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showSteps && hasOperation" class="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
        <div class="px-6 py-6 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
          
          <h3 class="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 flex items-center gap-3">
            <UIcon name="i-ph-graduation-cap-fill" class="text-2xl text-primary-500" />
            Solución Paso a Paso
          </h3>

          <!-- Paso 1: Fracciones Originales -->
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">1</div>
              <h4 class="text-lg font-bold text-neutral-800 dark:text-neutral-200">Identificar las fracciones</h4>
            </div>
            <div class="ml-13 bg-white dark:bg-neutral-900 rounded-xl p-5 border-2 border-neutral-200 dark:border-neutral-800 shadow-sm">
              <p class="text-neutral-600 dark:text-neutral-400 mb-3">Operación a resolver:</p>
              <p class="font-mono text-2xl font-bold text-neutral-800 dark:text-neutral-200">{{ steps.original }}</p>
            </div>
          </div>

          <!-- Paso 2: Denominador Común (MCM) -->
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">2</div>
              <h4 class="text-lg font-bold text-neutral-800 dark:text-neutral-200">Encontrar el Mínimo Común Múltiplo (MCM)</h4>
            </div>
            <div class="ml-13 space-y-3">
              <!-- Explicación del MCM -->
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                <div class="flex gap-2 items-start">
                  <UIcon name="i-ph-info-fill" class="text-blue-500 text-xl mt-0.5 flex-shrink-0" />
                  <p class="text-sm text-blue-700 dark:text-blue-300">
                    <strong>¿Por qué necesitamos el MCM?</strong><br>
                    Para sumar o restar fracciones, todas deben tener el mismo denominador. El MCM nos da el denominador común más pequeño posible.
                  </p>
                </div>
              </div>

              <!-- Pasos del MCM -->
              <div class="bg-white dark:bg-neutral-900 rounded-xl p-5 border-2 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
                <p v-for="(step, idx) in steps.lcmSteps" :key="idx" 
                   class="font-mono text-neutral-700 dark:text-neutral-300"
                   :class="{ 'font-bold text-primary-600 dark:text-primary-400 text-lg mt-2': step.includes('MCM =') }"
                >
                  {{ step }}
                </p>
              </div>
            </div>
          </div>

          <!-- Paso 3: Convertir Fracciones -->
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">3</div>
              <h4 class="text-lg font-bold text-neutral-800 dark:text-neutral-200">Convertir al denominador común</h4>
            </div>
            <div class="ml-13 space-y-3">
              <!-- Explicación de la conversión -->
              <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
                <div class="flex gap-2 items-start">
                  <UIcon name="i-ph-info-fill" class="text-purple-500 text-xl mt-0.5 flex-shrink-0" />
                  <p class="text-sm text-purple-700 dark:text-purple-300">
                    <strong>¿Cómo convertimos?</strong><br>
                    Multiplicamos el numerador y denominador por el mismo número para mantener el valor de la fracción. Este número es: MCM ÷ denominador_original.
                  </p>
                </div>
              </div>

              <!-- Cada conversión detallada -->
              <div v-for="(detail, idx) in steps.conversionDetails" :key="idx" 
                   class="bg-white dark:bg-neutral-900 rounded-xl p-5 border-2 border-neutral-200 dark:border-neutral-800 shadow-sm">
                <p class="font-mono text-lg font-bold text-primary-600 dark:text-primary-400 mb-3">
                  {{ steps.conversions[idx] }}
                </p>
                <div class="pl-4 border-l-4 border-neutral-200 dark:border-neutral-700 space-y-1">
                  <p v-for="(line, lineIdx) in detail.split('\n')" :key="lineIdx" 
                     class="text-neutral-600 dark:text-neutral-400"
                     :class="{ 'font-semibold': line.startsWith('•') }"
                  >
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Paso 4: Sumar/Restar Numeradores -->
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">4</div>
              <h4 class="text-lg font-bold text-neutral-800 dark:text-neutral-200">Sumar/restar los numeradores</h4>
            </div>
            <div class="ml-13 space-y-3">
              <!-- Explicación -->
              <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-800">
                <div class="flex gap-2 items-start">
                  <UIcon name="i-ph-info-fill" class="text-amber-500 text-xl mt-0.5 flex-shrink-0" />
                  <p class="text-sm text-amber-700 dark:text-amber-300">
                    <strong>¿Por qué solo sumamos numeradores?</strong><br>
                    Como todas las fracciones ya tienen el mismo denominador ({{ steps.commonDenom }}), solo necesitamos operar con los numeradores. El denominador se mantiene igual.
                  </p>
                </div>
              </div>

              <div class="bg-white dark:bg-neutral-900 rounded-xl p-5 border-2 border-neutral-200 dark:border-neutral-800 shadow-sm">
                <p class="text-neutral-600 dark:text-neutral-400 mb-2">Operación con numeradores:</p>
                <p class="font-mono text-xl text-neutral-800 dark:text-neutral-200 mb-4">{{ steps.numeratorSum }}</p>
                
                <div class="h-px bg-neutral-200 dark:bg-neutral-700 my-4"></div>
                
                <p class="text-neutral-600 dark:text-neutral-400 mb-2">Fracción resultante:</p>
                <p class="font-mono text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ steps.beforeSimplify }}
                </p>
              </div>
            </div>
          </div>

          <!-- Paso 5: Simplificar (si aplica) -->
          <div v-if="steps.needsSimplification" class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">5</div>
              <h4 class="text-lg font-bold text-neutral-800 dark:text-neutral-200">Simplificar el resultado</h4>
            </div>
            <div class="ml-13 space-y-3">
              <!-- Explicación MCD -->
              <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
                <div class="flex gap-2 items-start">
                  <UIcon name="i-ph-info-fill" class="text-green-500 text-xl mt-0.5 flex-shrink-0" />
                  <p class="text-sm text-green-700 dark:text-green-300">
                    <strong>¿Cómo simplificamos?</strong><br>
                    Encontramos el Máximo Común Divisor (MCD) del numerador y denominador, luego dividimos ambos entre este número.
                  </p>
                </div>
              </div>

              <!-- Pasos del MCD y simplificación -->
              <div class="bg-white dark:bg-neutral-900 rounded-xl p-5 border-2 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
                <p v-for="(step, idx) in steps.gcdSteps" :key="idx" 
                   class="text-neutral-700 dark:text-neutral-300"
                   :class="{ 
                     'font-bold text-lg mt-3 mb-2': step.startsWith('Paso'),
                     'font-mono': !step.startsWith('Paso') && !step.startsWith('Factores'),
                     'text-primary-600 dark:text-primary-400 font-semibold': step.includes('MCD(')
                   }"
                >
                  {{ step }}
                </p>
              </div>

              <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800">
                <p class="text-neutral-600 dark:text-neutral-400 mb-2">{{ steps.simplifyExplanation }}</p>
              </div>
            </div>
          </div>

          <!-- No necesita simplificación -->
          <div v-else-if="steps.totalNumeratorValue !== 0" class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">5</div>
              <h4 class="text-lg font-bold text-neutral-800 dark:text-neutral-200">Verificar simplificación</h4>
            </div>
            <div class="ml-13 bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800">
              <p class="text-green-700 dark:text-green-300">
                {{ steps.simplifyExplanation }}
              </p>
            </div>
          </div>

          <!-- Resultado Final -->
          <div class="border-t-4 border-primary-200 dark:border-primary-800 pt-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                ✓
              </div>
              <h4 class="text-2xl font-bold text-green-600 dark:text-green-400">Respuesta Final</h4>
            </div>
            <div class="ml-15 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border-4 border-green-300 dark:border-green-700 shadow-lg">
              <div class="flex items-center justify-center gap-8">
                <div class="text-center">
                  <p class="text-sm text-green-600 dark:text-green-400 mb-2 font-semibold uppercase tracking-wider">Fracción</p>
                  <p class="font-mono text-5xl font-black text-green-700 dark:text-green-300">
                    {{ steps.finalResult }}
                  </p>
                </div>
                <div class="h-20 w-px bg-green-300 dark:bg-green-700"></div>
                <div class="text-center">
                  <p class="text-sm text-green-600 dark:text-green-400 mb-2 font-semibold uppercase tracking-wider">Decimal</p>
                  <p class="font-mono text-5xl font-black text-green-700 dark:text-green-300">
                    {{ resultDecimal }}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>