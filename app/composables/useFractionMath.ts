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

  // MCM de un array de números con pasos
  const lcmArray = (arr: number[]): number => {
    if (arr.length === 0) return 1;
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
      result = lcm(result, arr[i]);
    }
    return result;
  };

  // Calcular MCM con pasos detallados
  const calculateLCMWithSteps = (denominators: number[]) => {
    const steps: string[] = [];
    const uniqueDens = [...new Set(denominators)].sort((a, b) => a - b);
    
    if (uniqueDens.length === 1) {
      steps.push(`Como todos los denominadores son ${uniqueDens[0]}, el MCM es ${uniqueDens[0]}`);
      return { mcm: uniqueDens[0], steps };
    }

    // Factorización de cada denominador
    steps.push('Paso 2.1: Factorizar cada denominador');
    const factorizations: { [key: number]: number[] } = {};
    
    uniqueDens.forEach(den => {
      const factors: number[] = [];
      let n = den;
      let d = 2;
      
      while (n > 1) {
        while (n % d === 0) {
          factors.push(d);
          n = n / d;
        }
        d++;
      }
      
      factorizations[den] = factors;
      if (factors.length > 0) {
        steps.push(`${den} = ${factors.join(' × ')}`);
      } else {
        steps.push(`${den} = ${den} (número primo)`);
      }
    });

    // Calcular MCM
    const mcm = lcmArray(uniqueDens);
    
    steps.push('');
    steps.push('Paso 2.2: Calcular el MCM');
    steps.push(`MCM(${uniqueDens.join(', ')}) = ${mcm}`);
    steps.push('(El MCM es el menor número que es múltiplo de todos los denominadores)');

    return { mcm, steps };
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

  // Generar pasos SUPER detallados para llegar a la solución
  const getStepsToSolution = (shapes: Shape[]) => {
    if (shapes.length === 0) {
      return {
        original: '0',
        hasFractions: false,
        lcmSteps: [],
        commonDenom: 1,
        conversions: [],
        conversionDetails: [],
        numeratorSum: '',
        numeratorParts: [],
        beforeSimplify: '0/1',
        totalNumeratorValue: 0,
        needsSimplification: false,
        gcdValue: 1,
        gcdSteps: [],
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

    // Paso 2: Calcular MCM con detalles
    const dens = shapes.map(s => s.denominator);
    const lcmResult = calculateLCMWithSteps(dens);
    const commonDenom = lcmResult.mcm;

    // Paso 3: Conversiones detalladas
    const conversions: string[] = [];
    const conversionDetails: string[] = [];
    const convertedNumerators: number[] = [];

    shapes.forEach((s, idx) => {
      const activeCount = s.slices.filter(Boolean).length;
      const multiplier = commonDenom / s.denominator;
      const newNumerator = activeCount * multiplier;
      const signedNumerator = newNumerator * s.sign;
      convertedNumerators.push(signedNumerator);

      const signPrefix = s.sign === -1 ? '-' : (idx > 0 ? '+' : '');
      const signDisplay = s.sign === -1 ? '-' : '';
      
      if (multiplier === 1) {
        conversions.push(`${signPrefix}${activeCount}/${s.denominator} = ${signPrefix}${newNumerator}/${commonDenom}`);
        conversionDetails.push(`La fracción ${signDisplay}${activeCount}/${s.denominator} ya tiene el denominador común (${commonDenom}), no necesita conversión.`);
      } else {
        conversions.push(`${signPrefix}${activeCount}/${s.denominator} × (${multiplier}/${multiplier}) = ${signPrefix}${newNumerator}/${commonDenom}`);
        conversionDetails.push(
          `Para convertir ${signDisplay}${activeCount}/${s.denominator} al denominador ${commonDenom}:\n` +
          `• Dividimos: ${commonDenom} ÷ ${s.denominator} = ${multiplier}\n` +
          `• Multiplicamos numerador y denominador por ${multiplier}:\n` +
          `• Numerador: ${activeCount} × ${multiplier} = ${newNumerator}\n` +
          `• Denominador: ${s.denominator} × ${multiplier} = ${commonDenom}\n` +
          `• Resultado: ${signDisplay}${newNumerator}/${commonDenom}`
        );
      }
    });

    // Paso 4: Suma de numeradores detallada
    const numeratorParts: string[] = [];
    convertedNumerators.forEach((n, idx) => {
      if (idx === 0) {
        numeratorParts.push(n.toString());
      } else if (n >= 0) {
        numeratorParts.push(`(+${n})`);
      } else {
        numeratorParts.push(`(${n})`);
      }
    });
    
    const totalNumerator = convertedNumerators.reduce((a, b) => a + b, 0);
    const numeratorSum = `${numeratorParts.join(' ')} = ${totalNumerator}`;
    const beforeSimplify = `${totalNumerator}/${commonDenom}`;

    // Paso 5: Verificar si necesita simplificación
    let needsSimplification = false;
    let gcdValue = 1;
    let gcdSteps: string[] = [];
    let simplifyExplanation = '';
    let finalResult = beforeSimplify;

    if (totalNumerator === 0) {
      finalResult = '0';
      simplifyExplanation = 'Como el numerador es 0, el resultado es 0';
    } else {
      const absN = Math.abs(totalNumerator);
      gcdValue = gcd(absN, commonDenom);
      
      if (gcdValue > 1) {
        needsSimplification = true;
        
        // Calcular MCD con pasos
        gcdSteps.push(`Paso 5.1: Encontrar el MCD de ${absN} y ${commonDenom}`);
        
        // Método de factorización
        const factorizeForGCD = (num: number) => {
          const factors: number[] = [];
          let n = num;
          let d = 2;
          while (n > 1) {
            while (n % d === 0) {
              factors.push(d);
              n = n / d;
            }
            d++;
          }
          return factors;
        };

        const factors1 = factorizeForGCD(absN);
        const factors2 = factorizeForGCD(commonDenom);
        
        if (factors1.length > 0) {
          gcdSteps.push(`Factores de ${absN}: ${factors1.join(' × ')}`);
        }
        if (factors2.length > 0) {
          gcdSteps.push(`Factores de ${commonDenom}: ${factors2.join(' × ')}`);
        }
        gcdSteps.push(`MCD(${absN}, ${commonDenom}) = ${gcdValue}`);
        gcdSteps.push('');
        gcdSteps.push('Paso 5.2: Simplificar dividiendo numerador y denominador entre el MCD');
        
        const simplifiedN = totalNumerator / gcdValue;
        const simplifiedD = commonDenom / gcdValue;
        
        gcdSteps.push(`Numerador: ${totalNumerator} ÷ ${gcdValue} = ${simplifiedN}`);
        gcdSteps.push(`Denominador: ${commonDenom} ÷ ${gcdValue} = ${simplifiedD}`);
        
        simplifyExplanation = `La fracción ${totalNumerator}/${commonDenom} se puede simplificar dividiendo ambos términos entre ${gcdValue}`;
        finalResult = `${simplifiedN}/${simplifiedD}`;
      } else {
        simplifyExplanation = `La fracción ${totalNumerator}/${commonDenom} ya está en su forma más simple (MCD = 1)`;
      }
    }

    return {
      original,
      hasFractions: true,
      lcmSteps: lcmResult.steps,
      commonDenom,
      conversions,
      conversionDetails,
      numeratorSum,
      numeratorParts,
      beforeSimplify,
      totalNumeratorValue: totalNumerator,
      needsSimplification,
      gcdValue,
      gcdSteps,
      simplifyExplanation,
      finalResult
    };
  };

  // Generador de paths SVG para círculos (Slices)
  const getCirclePaths = (size: number, denominator: number) => {
    const paths: string[] = [];
    const r = size / 2;
    const c = size / 2;
    
    const getCoords = (p: number) => [
      c + r * Math.cos(2 * Math.PI * p),
      c + r * Math.sin(2 * Math.PI * p)
    ];

    for (let i = 0; i < denominator; i++) {
      const start = getCoords(i / denominator);
      const end = getCoords((i + 1) / denominator);
      const largeArc = (1 / denominator) > 0.5 ? 1 : 0;
      
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