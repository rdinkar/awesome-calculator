import { useState, useEffect, useRef, ReactElement } from "react";
import {
  FunctionCard,
  FunctionChainInput,
  FunctionChainOutput,
} from "./components";
import { FUNCTION_CHAIN } from "./constants";

interface FunctionNode {
  id: number;
  equation: string;
  nextFunction: number | null;
}

const lineProps = {
  stroke: "#0066FF",
  strokeOpacity: "0.3",
  strokeWidth: "7",
  strokeLinecap: "round" as const,
  fill: "none",
};

const validateEquation = (equation: string): boolean => {
  // Allow numbers, x, basic operators (+,-,*,/,^) and whitespace
  const validPattern = /^[0-9x\s\+\-\*\/\^]+$/;
  return validPattern.test(equation);
};

const evaluateEquation = (equation: string, x: number): number => {
  // Replace x^n with Math.pow(x,n)
  const powReplaced = equation.replace(/x\^(\d+)/g, `Math.pow(x,$1)`);
  // Replace x with the actual value
  const xReplaced = powReplaced.replace(/x/g, x.toString());
  try {
    // eslint-disable-next-line no-eval
    return eval(xReplaced);
  } catch (error) {
    console.error("Error evaluating equation:", error);
    return 0;
  }
};

const App = () => {
  const [functions, setFunctions] = useState<Record<number, FunctionNode>>(() =>
    FUNCTION_CHAIN.reduce<Record<number, FunctionNode>>((acc, func) => {
      acc[func.id] = func;
      return acc;
    }, {})
  );
  const [initialValue, setInitialValue] = useState<number>(2);
  const [finalOutput, setFinalOutput] = useState<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const updateEquation = (id: number, newEquation: string) => {
    if (!validateEquation(newEquation)) return;

    setFunctions((prev) => ({
      ...prev,
      [id]: { ...prev[id], equation: newEquation },
    }));
  };

  const calculateResult = () => {
    let currentValue = initialValue;
    let currentFunctionId: number | null = 1;

    while (currentFunctionId !== null) {
      const currentFunction: FunctionNode = functions[currentFunctionId];
      if (!currentFunction) break;

      currentValue = evaluateEquation(currentFunction.equation, currentValue);
      currentFunctionId = currentFunction.nextFunction;
    }

    setFinalOutput(currentValue);
  };

  useEffect(() => {
    calculateResult();
  }, [initialValue, functions]);

  const renderConnections = (): ReactElement[] => {
    const connections: ReactElement[] = [];

    // Connect function cards
    Object.values(functions).forEach((func) => {
      if (func.nextFunction) {
        const outputPoint = document.getElementById(
          `function-card-${func.id}-output`
        );
        const inputPoint = document.getElementById(
          `function-card-${func.nextFunction}-input`
        );
        const svgRect = svgRef.current?.getBoundingClientRect();

        if (outputPoint && inputPoint && svgRect) {
          const outputRect = outputPoint.getBoundingClientRect();
          const inputRect = inputPoint.getBoundingClientRect();

          const x1 = outputRect.left + outputRect.width / 2 - svgRect.left;
          const y1 = outputRect.top + outputRect.height / 2 - svgRect.top;
          const x2 = inputRect.left + inputRect.width / 2 - svgRect.left;
          const y2 = inputRect.top + inputRect.height / 2 - svgRect.top;

          const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
          );
          let pathD = "";

          if (distance < 100) {
            // Straight line
            pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
          } else if (distance < 500) {
            // Quadratic curve
            const isXFar = Math.abs(x1 - x2) > Math.abs(y1 - y2);
            const controlX = isXFar ? (x1 + x2) / 2 : Math.max(x1, x2) + 80;
            const controlY = isXFar ? Math.max(y1, y2) + 80 : (y1 + y2) / 2;
            pathD = `M ${x1} ${y1} Q ${controlX} ${controlY}, ${x2} ${y2}`;
          } else {
            // Cubic curve with more pronounced curvature
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const controlPoint1X = midX + 80;
            const controlPoint1Y = midY + 80;
            const controlPoint2X = midX - 80;
            const controlPoint2Y = midY - 80;
            pathD = `M ${x1} ${y1} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${x2} ${y2}`;
          }

          connections.push(
            <path
              key={`${func.id}-${func.nextFunction}`}
              d={pathD}
              {...lineProps}
            />
          );
        }
      }
    });

    // Connect initial input to first function
    const chainInput = document.getElementById("function-chain-input");
    const firstFunctionInput = document.getElementById("function-card-1-input");
    if (chainInput && firstFunctionInput && svgRef.current) {
      const inputRect = chainInput.getBoundingClientRect();
      const firstInputRect = firstFunctionInput.getBoundingClientRect();
      const svgRect = svgRef.current.getBoundingClientRect();

      const x1 = inputRect.left + inputRect.width / 2 - svgRect.left;
      const y1 = inputRect.top + inputRect.height / 2 - svgRect.top;
      const x2 = firstInputRect.left + firstInputRect.width / 2 - svgRect.left;
      const y2 = firstInputRect.top + firstInputRect.height / 2 - svgRect.top;

      const distance = Math.abs(x2 - x1);
      const controlPointOffset = distance * 0.2;

      connections.push(
        <path
          key="chain-input-connection"
          d={`M ${x1} ${y1} C ${x1 + controlPointOffset} ${y1}, ${
            x2 - controlPointOffset
          } ${y2}, ${x2} ${y2}`}
          {...lineProps}
        />
      );
    }

    // Connect last function to chain output
    const lastFunction = Object.values(functions).find((f) => !f.nextFunction);
    if (lastFunction) {
      const lastOutput = document.getElementById(
        `function-card-${lastFunction.id}-output`
      );
      const chainOutput = document.getElementById("function-chain-output");
      if (lastOutput && chainOutput && svgRef.current) {
        const outputRect = lastOutput.getBoundingClientRect();
        const chainOutputRect = chainOutput.getBoundingClientRect();
        const svgRect = svgRef.current.getBoundingClientRect();

        const x1 = outputRect.left + outputRect.width / 2 - svgRect.left;
        const y1 = outputRect.top + outputRect.height / 2 - svgRect.top;
        const x2 =
          chainOutputRect.left + chainOutputRect.width / 2 - svgRect.left;
        const y2 =
          chainOutputRect.top + chainOutputRect.height / 2 - svgRect.top;

        const distance = Math.abs(x2 - x1);
        const controlPointOffset = distance * 0.2;

        connections.push(
          <path
            key="chain-output-connection"
            d={`M ${x1} ${y1} C ${x1 + controlPointOffset} ${y1}, ${
              x2 - controlPointOffset
            } ${y2}, ${x2} ${y2}`}
            {...lineProps}
          />
        );
      }
    }

    return connections;
  };

  useEffect(() => {
    const handleResize = () => {
      // Force re-render to update connection lines
      setFunctions({ ...functions });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [functions]);

  return (
    <div className="function-chain">
      {/* SVG for connection lines */}
      <svg ref={svgRef} className="connections">
        {renderConnections()}
      </svg>

      {/* Initial Input */}
      <div className="flex-1 disp-flex justify-end" style={{ height: 293 }}>
        <FunctionChainInput
          initialValue={initialValue}
          setInitialValue={setInitialValue}
        />
      </div>

      {/* Function Cards */}
      <div className="function-cards">
        {FUNCTION_CHAIN.map(({ id }) => (
          <FunctionCard
            key={id}
            nodeData={functions[id]}
            updateEquation={updateEquation}
          />
        ))}
      </div>
      <div className="flex-1 disp-flex justify-start" style={{ height: 293 }}>
        <FunctionChainOutput initialValue={finalOutput} />
      </div>
    </div>
  );
};

export default App;
