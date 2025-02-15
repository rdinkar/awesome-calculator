import ConnectionPointIcon from "../assets/connection-point.svg";

export default function FunctionChainOutput({
  initialValue,
}: {
  initialValue: number;
}) {
  return (
    <div className="function-chain-parameters chain-output">
      <label className="text-white font-md font-medium">Final Output y</label>
      <div className="input-container">
        <div className="disp-flex align-center justify-center connection-point-container">
          <img
            src={ConnectionPointIcon}
            alt="Connection Point"
            height={15}
            width={15}
            id={`function-chain-output`}
          />
        </div>
        <div className="flex-1">
          <div className="output-value text-dark font-xl font-bold">
            {initialValue}
          </div>
        </div>
      </div>
    </div>
  );
}
