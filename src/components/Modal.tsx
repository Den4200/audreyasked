import { Dispatch, SetStateAction } from 'react';

import { Dialog } from '@headlessui/react';

import Button from './Button';

type ModalProps = {
  title: string;
  description: string;
  body: string;
  submitText: string;
  onSubmit: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const Modal = (props: ModalProps) => {
  return (
    <Dialog
      className="flex justify-center items-center fixed z-50 inset-0 overflow-y-auto"
      open={props.open}
      onClose={() => props.setOpen(false)}
    >
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

      <div className="relative bg-white m-4 p-4 rounded border-2 border-pink-400 max-w-lg shadow-xl">
        <Dialog.Title className="text-2xl font-semibold">
          {props.title}
        </Dialog.Title>
        <Dialog.Description className="text-gray-500 text-sm">
          {props.description}
        </Dialog.Description>
        <p className="border-y border-gray-200 my-2 py-2">{props.body}</p>
        <div className="float-right mt-2 space-x-3">
          <Button onClick={() => props.setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              props.onSubmit();
              props.setOpen(false);
            }}
          >
            {props.submitText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
