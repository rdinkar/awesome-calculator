import { useState, useMemo } from "react";
import {
  FunctionCard,
  FunctionChainInput,
  FunctionChainOutput,
  FunctionConnections,
} from "./components";
import { FUNCTION_CHAIN } from "./constants";
import { evaluateEquation, validateEquation } from "./utils/equation";
import type { FunctionNode } from "./types";

const App = () => {
  const [functions, setFunctions] = useState<Record<number, FunctionNode>>(() =>
    FUNCTION_CHAIN.reduce<Record<number, FunctionNode>>((acc, func) => {
      acc[func.id] = func;
      return acc;
    }, {})
  );
  const [initialValue, setInitialValue] = useState<number>(2);

  const finalOutput = useMemo(() => {
    let currentValue = initialValue;
    let currentFunctionId: number | null = 1;

    while (currentFunctionId !== null) {
      const currentFunction: FunctionNode | undefined =
        functions[currentFunctionId];
      if (!currentFunction) break;

      currentValue = evaluateEquation(currentFunction.equation, currentValue);
      currentFunctionId = currentFunction.nextFunction;
    }

    return currentValue;
  }, [initialValue, functions]);

  const updateEquation = (id: number, newEquation: string) => {
    if (!validateEquation(newEquation)) return;

    setFunctions((prev) => ({
      ...prev,
      [id]: { ...prev[id], equation: newEquation },
    }));
  };

  return (
    <div className="function-chain">
      <FunctionConnections functions={functions} setFunctions={setFunctions} />

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
