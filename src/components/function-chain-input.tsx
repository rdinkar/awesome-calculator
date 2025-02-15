import ConnectionPointIcon from "../assets/connection-point.svg";

export default function FunctionChainInput({
  initialValue,
  setInitialValue,
}: {
  initialValue: number;
  setInitialValue: (value: number) => void;
}) {
  return (
    <div className="function-chain-parameters chain-input">
      <label className="text-white font-md font-medium">
        Initial value of x
      </label>
      <div className="input-container">
        <div className="flex-1">
          <input
            type="number"
            value={initialValue}
            onChange={(e) => setInitialValue(Number(e.target.value))}
            style={{
              maxWidth: "100%",
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
