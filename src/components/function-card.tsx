import { FunctionNode } from "../types";
import { FUNCTION_CHAIN } from "../constants";
import DragIcon from "../assets/drag-symbol.svg";
import ConnectionPointIcon from "../assets/connection-point.svg";

export default function FunctionCard({
  nodeData,
  updateEquation,
}: {
  nodeData: FunctionNode;
  updateEquation: (id: number, equation: string) => void;
}) {
  return (
    <div className="function-card gap-4">
      <div className="disp-flex align-center gap-1">
        <img src={DragIcon} alt="Drag Icon" height={8} width={12} />
        <span className="text-gray font-medium font-lg">
          Function: {nodeData.id}
        </span>
      </div>
      <div className="disp-flex-col gap-1">
        <label className="font-md font-regular text-dark">Equation</label>
        <input
          type="text"
          value={nodeData.equation}
          onChange={(e) => updateEquation(nodeData.id, e.target.value)}
          placeholder="Enter equation (e.g., x^2+1)"
        />
      </div>
      <div className="disp-flex-col gap-1">
        <label className="font-md font-regular text-dark">Next function</label>
        <select
          disabled
          value={nodeData.nextFunction ?? ""}
          className="font-md"
        >
          <option value="">-</option>
          {FUNCTION_CHAIN.map((f) => (
            <option key={f.id} value={f.id}>
              Function: {f.id}
            </option>
          ))}
        </select>
      </div>
      <div className="disp-flex justify-space-between">
        <div className="disp-flex gap-1 align-center">
          <img
            src={ConnectionPointIcon}
            alt="Connection Point"
            height={15}
            width={15}
            id={`function-card-${nodeData.id}-input`}
          />
          <span className="font-sm font-regular text-gray-light">input</span>
        </div>
        <div className="disp-flex gap-1 align-center">
          <span className="font-sm font-regular text-gray-light">output</span>
          <img
            src={ConnectionPointIcon}
            alt="Connection Point"
            height={15}
            width={15}
            id={`function-card-${nodeData.id}-output`}
          />
        </div>
      </div>
    </div>
  );
}
