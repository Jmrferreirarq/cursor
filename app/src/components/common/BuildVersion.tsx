const BUILD_DATE = __BUILD_DATE__;

export default function BuildVersion() {
  return (
    <div className="fixed bottom-2 left-2 z-50 text-[10px] text-muted-foreground/40 pointer-events-none print:hidden">
      FA-360 · Atualizado {BUILD_DATE}
    </div>
  );
}
