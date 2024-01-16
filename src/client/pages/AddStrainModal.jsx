
import React from 'react';
import Modal from 'react-modal';
import { Button } from "@chakra-ui/react";
import { FaRegCircleXmark } from "react-icons/fa6";

export function AddStrainModal ( { modalIsOpen, closeModal, dispensaryName } ) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
    >
      <Button onClick={closeModal}>
        <FaRegCircleXmark />
      </Button>
      <div>I am a modal</div>
      <form>
        <input />
        <button>tab navigation</button>
        <button>stays</button>
        <button>inside</button>
        <button>the modal</button>
      </form>
    </Modal>
  );
};

export default AddStrainModal;
