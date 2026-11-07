import React from 'react';
import { Modal, type ModalProps } from '../../../shared/components/ui/Modal';

export type AdminModalProps = ModalProps;

export const AdminModal: React.FC<ModalProps> = (props) => {
  return <Modal {...props} />;
};
