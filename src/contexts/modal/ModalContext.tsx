import React, { createContext, useContext, useState, ReactNode } from 'react';

type ModalType = 
  | 'planSelection'
  | 'planRequired'
  | 'planInfo'
  | 'planChange'
  | 'notification'
  | 'fullscreenDebug'
  | 'cart'
  | 'orderTracking';

interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data?: any;
}

interface ModalContextType {
  modalState: ModalState;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  isModalOpen: (type: ModalType) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal deve ser usado dentro de um ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: undefined,
  });

  const openModal = (type: ModalType, data?: any) => {
    setModalState({
      isOpen: true,
      type,
      data,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      data: undefined,
    });
  };

  const isModalOpen = (type: ModalType) => {
    return modalState.isOpen && modalState.type === type;
  };

  const value = {
    modalState,
    openModal,
    closeModal,
    isModalOpen,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};
