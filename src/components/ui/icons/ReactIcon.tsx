import { Icons } from './icons';

interface Path {
  d: string;
  class?: string;
}

interface IconProps {
  name: string;
  stroke?: string;
  strokeWidth?: string;
  fill?: string;
  class?: string;
}

const Icon = ({
  name,
  stroke,
  strokeWidth,
  fill,
  class: className,
}: IconProps) => {
  let icon = (Icons as any)[name] || {};
  let paths: Path[] = icon.paths || [];

  let strokeVal = stroke || icon.stroke || 'currentColor';
  let strokeWidthVal = strokeWidth || icon.strokeWidth || '2';
  let fillVal = fill || icon.fill || 'none';
  let classVal = className || icon.class || '';

  return Object.keys(icon).length > 0 ? (
    <svg
      className={classVal}
      height={icon.height}
      viewBox={icon.viewBox}
      width={icon.width}
      fill={fillVal}
      clip-rule={icon.clipRule}
      fill-rule={icon.fillRule}
      stroke={strokeVal}
      stroke-width={strokeWidthVal}
      stroke-linecap={icon.strokeLinecap}
      stroke-linejoin={icon.strokeLinejoin}
    >
      <title>{icon.title}</title>
      {paths.map((path, index) => (
        <path key={index} d={path.d} className={path.class || ''} />
      ))}
    </svg>
  ) : null;
};

export default Icon;
