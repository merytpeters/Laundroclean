type CornerRightArrowProps = {
  className?: string;
  size?: number;
  color?: string;
};

const CornerRightArrow = ({
  className,
  size = 24,
  color = "currentColor",
}: CornerRightArrowProps) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={5} y1={19} x2={19} y2={5} />
      <polyline points="12 5 19 5 19 12" />
    </svg>
  );
};

export default CornerRightArrow;