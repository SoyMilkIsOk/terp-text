
import React from 'react';
import Modal from 'react-modal';
import { CloseButton } from "@chakra-ui/react";
import { FaRegCircleXmark } from "react-icons/fa6";

export function AddStrainModal ( { modalIsOpen, closeModal, dispensaryName } ) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
    >
      <CloseButton onClick={closeModal} />
      <div>I am a modal</div>
    </Modal>
  );
};

export default AddStrainModal;
