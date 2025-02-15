import { ReactElement } from "react";
import { FunctionNode } from "../types";

export const lineProps = {
  stroke: "#0066FF",
  strokeOpacity: "0.3",
  strokeWidth: "7",
  strokeLinecap: "round" as const,
  fill: "none",
};

interface RenderConnectionsProps {
  functions: Record<number, FunctionNode>;
  svgRef: React.RefObject<SVGSVGElement>;
}

export const renderConnections = ({
  functions,
  svgRef,
}: RenderConnectionsProps): ReactElement[] => {
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

        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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

    connections.push(
      <path
        key="chain-input-connection"
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
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
      const y2 = chainOutputRect.top + chainOutputRect.height / 2 - svgRect.top;

      connections.push(
        <path
          key="chain-output-connection"
          d={`M ${x1} ${y1} L ${x2} ${y2}`}
          {...lineProps}
        />
      );
    }
  }

  return connections;
};
