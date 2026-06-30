export default function CategoryIcon({
  icon,
  className = "w-5 h-5",
}: {
  icon: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      className={className}
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}