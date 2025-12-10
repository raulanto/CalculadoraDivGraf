import type { Shape, ToolId, ColorOption } from '~/types';

export const useCanvasState = () => {
  // Estado global compartido (useState para persistencia en navegación del lado del cliente)
  const shapes = useState<Shape[]>('canvas-shapes', () => []);
  const activeTool = useState<ToolId>('canvas-tool', () => 'draw_square');
  const selectedColor = useState<string>('canvas-color', () => 'green');
  const zoomLevel = useState<number>('canvas-zoom', () => 1.0);
  
  // Constantes
  const COLORS: ColorOption[] = [
    { value: 'green', hex: '#00DC82', label: 'Verde' },
    { value: 'blue', hex: '#3B82F6', label: 'Azul' },
    { value: 'orange', hex: '#F97316', label: 'Naranja' },
    { value: 'purple', hex: '#8B5CF6', label: 'Morado' },
    { value: 'red', hex: '#EF4444', label: 'Rojo' },
    { value: 'pink', hex: '#EC4899', label: 'Rosa' }
  ];

  // Acciones
  const addShape = (shape: Shape) => {
    shapes.value.push(shape);
  };

  const removeShape = (id: number) => {
    shapes.value = shapes.value.filter(s => s.id !== id);
  };

  const clearCanvas = () => {
    shapes.value = [];
  };

  const setTool = (tool: ToolId) => {
    activeTool.value = tool;
  };

  const changeZoom = (delta: number) => {
    const newZoom = zoomLevel.value + delta;
    if (newZoom >= 0.2 && newZoom <= 3.0) {
      zoomLevel.value = parseFloat(newZoom.toFixed(1));
    }
  };
  
  const resetZoom = () => {
    zoomLevel.value = 1.0;
  };

  // Helper de Color
  const getColorHex = (val: string) => COLORS.find(c => c.value === val)?.hex || '#00DC82';

  // Helper para cambiar tamaño cíclicamente
  const cycleShapeSize = (shape: Shape) => {
    const sizes = [120, 180, 240];
    const currentSize = shape.size;
    let nextIndex = 0;
    
    if (currentSize <= 120) nextIndex = 1;
    else if (currentSize <= 180) nextIndex = 2;
    else nextIndex = 0;

    shape.size = sizes[nextIndex];
  };

  return {
    shapes,
    activeTool,
    selectedColor,
    zoomLevel,
    COLORS,
    addShape,
    removeShape,
    clearCanvas,
    setTool,
    changeZoom,
    resetZoom,
    getColorHex,
    cycleShapeSize
  };
};