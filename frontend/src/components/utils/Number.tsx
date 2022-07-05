import classNames from "classnames";
import React, { memo, useMemo } from "react";

export type NumberProps = {
  className?: string;
  diff?: boolean;
  value: number;
};

const Number: React.FC<NumberProps> = memo(props => {
  const { className, diff, value } = props;

  const op = useMemo(() => {
    if (!diff) return null;
    if (value === 0) return <>&plusmn;</>;
    if (value > 0) return <>&#043;</>;
    return null;
  }, [value]);

  return (
    <span
      className={classNames(className, {
        "text-red-600": diff && value < 0,
        "text-green-600": diff && value > 0,
      })}
    >
      {op}
      {value.toLocaleString()}
    </span>
  );
});

Number.displayName = "Number";

export default Number;
