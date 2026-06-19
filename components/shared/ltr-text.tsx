export function LtrText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span dir="ltr" className={className} style={{ unicodeBidi: "isolate" }}>
      {children}
    </span>
  );
}
