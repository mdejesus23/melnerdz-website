import React, {
  cloneElement,
  createContext,
  useContext,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import { useOutsideClick } from '@/hooks/ useOutsideClick';

import ModalOverlay from './ModalOverlay';
import StyledModal from './StyledModal';

// Define the modal context type
interface ModalContextType {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

// Create the modal context with a default value
const ModalContext = createContext<ModalContextType>({
  openName: '',
  close: () => {},
  open: () => {},
});

// Props type for Modal component
interface ModalProps {
  children: React.ReactNode;
}

// Modal component
function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState<string>('');

  const close = () => setOpenName('');
  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

// Props type for Open component
interface OpenProps {
  children: React.ReactElement<{ onClick?: () => void }>;
  opens: string;
}

// Open component to trigger the modal
function Open({ children, opens }: OpenProps) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opens) });
}

// Props type for Window component
interface WindowProps {
  children: React.ReactElement<{ onCloseModal?: () => void }>;
  name: string;
}

// Window component (actual modal content)
function Window({ children, name }: WindowProps) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick<HTMLDivElement>(close, true);

  if (name !== openName) return null;

  return createPortal(
    <ModalOverlay>
      <StyledModal reference={ref as React.RefObject<HTMLDivElement>}>
        <button
          className="text-2xl' absolute right-2 top-2 text-neutral-700 underline-offset-1"
          onClick={close}
        >
          <HiXMark />
        </button>

        <div>
          {React.isValidElement(children) &&
            cloneElement(children, { onCloseModal: close })}
        </div>
      </StyledModal>
    </ModalOverlay>,
    document.body,
  );
}

// Attach sub-components to Modal
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
