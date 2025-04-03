interface ModalOverlayProps {
  children: React.ReactNode;
}

function ModalOverlay({ children }: ModalOverlayProps) {
  return (
    <div className="bg-backdropColor fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center backdrop-blur-sm transition-all duration-500">
      {children}
    </div>
  );
}

export default ModalOverlay;
