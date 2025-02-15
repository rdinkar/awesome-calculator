import { useRef } from "react";
import ConnectionPointIcon from "../assets/connection-point.svg";

export default function FunctionChainInput({
  initialValue,
  setInitialValue,
}: {
  initialValue: number;
  setInitialValue: (value: number) => void;
}) {
  const inputValWrapperRef = useRef<HTMLDivElement>(null);
  return (
    <div className="function-chain-parameters chain-input">
      <label className="text-white font-md font-medium">
        Initial value of x
      </label>
      <div className="input-container">
        <div className="flex-1">
          <div ref={inputValWrapperRef} className="input-value-wrapper">
            {initialValue}
          </div>
          <input
            type="number"
            value={initialValue}
            onChange={(e) => setInitialValue(Number(e.target.value))}
            style={{
              width: Math.max(inputValWrapperRef.current?.clientWidth ?? 0, 40),
            }}
          />
        </div>
        <div className="disp-flex align-center justify-center connection-point-container">
          <img
            src={ConnectionPointIcon}
            alt="Connection Point"
            height={15}
            width={15}
            id={`function-chain-input`}
          />
        </div>
      </div>
    </div>
  );
}
