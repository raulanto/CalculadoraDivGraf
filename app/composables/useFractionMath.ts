import type { Shape } from '~/types';

export const useFractionMath = () => {
  // Máximo Común Divisor (Recursivo)
  const gcd = (a: number, b: number): number => {
    return b ? gcd(b, a % b) : Math.abs(a);
  };

  // Mínimo Común Múltiplo de dos números
  const lcm = (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  };

  // MCM de un array de números
  const lcmArray = (arr: number[]): number => {
    if (arr.length === 0) return 1;
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
      result = lcm(result, arr[i]);
    }
    return result;
  };

  // Calcular el resultado total de todas las figuras en el lienzo
  const calculateTotalFraction = (shapes: Shape[]) => {
    if (shapes.length === 0) return { n: 0, d: 1 };

    // 1. Encontrar denominador común
    const dens = shapes.map(s => s.denominator);
    const commonDenom = lcmArray(dens);

    // 2. Sumar numeradores ajustados
    let totalNumerator = 0;
    
    shapes.forEach(s => {
      const activeCount = s.slices.filter(Boolean).length;
      const multiplier = commonDenom / s.denominator;
      totalNumerator += (activeCount * multiplier) * s.sign;
    });

    // 3. Simplificar resultado
    if (totalNumerator === 0) return { n: 0, d: commonDenom };
    
    const absN = Math.abs(totalNumerator);
    const commonDivisor = gcd(absN, commonDenom);
    
    return {
      n: totalNumerator / commonDivisor,
      d: commonDenom / commonDivisor
    };
  };

  // Generar pasos detallados para llegar a la solución
  const getStepsToSolution = (shapes: Shape[]) => {
    if (shapes.length === 0) {
      return {
        original: '0',
        mcmExplanation: '',
        commonDenom: 1,
        conversions: [],
        numeratorSum: '',
        beforeSimplify: '0/1',
        simplified: false,
        simplifyExplanation: '',
        finalResult: '0'
      };
    }

    // Paso 1: Fracciones originales
    const fractionStrings = shapes.map((s, idx) => {
      const activeCount = s.slices.filter(Boolean).length;
      const sign = s.sign === -1 ? '-' : (idx > 0 ? '+' : '');
      return `${sign}${activeCount}/${s.denominator}`;
    });
    const original = fractionStrings.join(' ');

    // Paso 2: Encontrar MCM
    const dens = shapes.map(s => s.denominator);
    const commonDenom = lcmArray(dens);
    const mcmExplanation = `Denominadores: ${dens.join(', ')}`;

    // Paso 3: Convertir cada fracción
    const conversions: string[] = [];
    const convertedNumerators: number[] = [];

    shapes.forEach((s, idx) => {
      const activeCount = s.slices.filter(Boolean).length;
      const multiplier = commonDenom / s.denominator;
      const newNumerator = activeCount * multiplier * s.sign;
      convertedNumerators.push(newNumerator);

      const signPrefix = s.sign === -1 ? '-' : (idx > 0 ? '+' : '');
      
      if (multiplier === 1) {
        conversions.push(
          `${signPrefix}${activeCount}/${s.denominator} → ${signPrefix}${Math.abs(newNumerator)}/${commonDenom} (ya tiene el denominador común)`
        );
      } else {
        conversions.push(
          `${signPrefix}${activeCount}/${s.denominator} × ${multiplier}/${multiplier} = ${signPrefix}${Math.abs(newNumerator)}/${commonDenom}`
        );
      }
    });

    // Paso 4: Sumar numeradores
    const numeratorParts = convertedNumerators.map((n, idx) => {
      if (idx === 0) return n.toString();
      return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
    });
    const numeratorSum = `${numeratorParts.join(' ')} = ${convertedNumerators.reduce((a, b) => a + b, 0)}`;
    
    const totalNumerator = convertedNumerators.reduce((a, b) => a + b, 0);
    const beforeSimplify = `${totalNumerator}/${commonDenom}`;

    // Paso 5: Simplificar si es necesario
    let simplified = false;
    let simplifyExplanation = '';
    let finalResult = beforeSimplify;

    if (totalNumerator === 0) {
      finalResult = '0';
      simplified = false;
    } else {
      const absN = Math.abs(totalNumerator);
      const commonDivisor = gcd(absN, commonDenom);
      
      if (commonDivisor > 1) {
        simplified = true;
        const simplifiedN = totalNumerator / commonDivisor;
        const simplifiedD = commonDenom / commonDivisor;
        simplifyExplanation = `Dividimos numerador y denominador entre su MCD (${commonDivisor})`;
        finalResult = `${simplifiedN}/${simplifiedD}`;
      }
    }

    return {
      original,
      mcmExplanation,
      commonDenom,
      conversions,
      numeratorSum,
      beforeSimplify,
      simplified,
      simplifyExplanation,
      finalResult
    };
  };

  // Generador de paths SVG para círculos (Slices)
  const getCirclePaths = (size: number, denominator: number) => {
    const paths: string[] = [];
    const r = size / 2;
    const c = size / 2; // Centro local
    
    const getCoords = (p: number) => [
      c + r * Math.cos(2 * Math.PI * p),
      c + r * Math.sin(2 * Math.PI * p)
    ];

    for (let i = 0; i < denominator; i++) {
      const start = getCoords(i / denominator);
      const end = getCoords((i + 1) / denominator);
      const largeArc = (1 / denominator) > 0.5 ? 1 : 0;
      
      // Comando SVG: Move -> Line -> Arc -> Close
      const d = `M ${c} ${c} L ${start[0]} ${start[1]} A ${r} ${r} 0 ${largeArc} 1 ${end[0]} ${end[1]} Z`;
      paths.push(d);
    }

    return paths;
  };

  return {
    gcd,
    lcm,
    lcmArray,
    calculateTotalFraction,
    getStepsToSolution,
    getCirclePaths
  };
};