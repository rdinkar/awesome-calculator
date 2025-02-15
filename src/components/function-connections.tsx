import { useRef, useEffect } from "react";
import { FunctionNode } from "../types";
import { renderConnections } from "../utils/line-renderer";

interface FunctionConnectionsProps {
  functions: Record<number, FunctionNode>;
  setFunctions: (functions: Record<number, FunctionNode>) => void;
}

const FunctionConnections = ({
  functions,
  setFunctions,
}: FunctionConnectionsProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const init = useRef(false);

  useEffect(() => {
    // force re-render to update connection lines
    if (!init.current) {
      init.current = true;
      setFunctions({ ...functions });
    }

    const handleResize = () => {
      setFunctions({ ...functions });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [functions]);

  return (
    <svg ref={svgRef} className="connections">
      {renderConnections({ functions, svgRef: svgRef })}
    </svg>
  );
};

export default FunctionConnections;
