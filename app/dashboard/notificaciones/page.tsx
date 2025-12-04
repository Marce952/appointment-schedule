'use client'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import { Check, X } from 'lucide-react'
import React, { useState } from 'react'

const page = () => {
  const [modalContent, setModalContent] = useState<{ title: string; date: string; note: string } | null>(null)
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const handleModal = (item: { title: string; date: string; note: string }) => {
    setModalContent(item);
    onOpen();
  }

  const turnos = [
    { name: "Marcelo Garrido", pet: "Rocco", date: "10/12/25 15:30", note: "Mi mascota no come..." },
    { name: "Luz Garrido", pet: "Kitty", date: "15/12/25 15:30", note: "Mi mascota mea computadoras..." }
  ]

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onCloseFromModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{modalContent?.title || 'Modal Title'}</ModalHeader>
              <ModalBody>
                <p className="text-sm"><strong>Fecha:</strong> {modalContent?.date || '-'}</p>
                <p className="mt-2 text-sm"><strong>Nota:</strong></p>
                <p className="text-xs text-gray-600">{modalContent?.note || 'Sin contenido'}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => { onCloseFromModal(); setModalContent(null); }}>
                  Close
                </Button>
                <Button color="primary" onPress={() => { onCloseFromModal(); setModalContent(null); }}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div>
        {
          turnos.map((item, index) => (
            <div
              key={index}
              onClick={() => handleModal({ title: `👨 ${item.name} | 🐶 ${item.pet}`, date: item.date, note: item.note })}
              className='flex justify-between items-center bg-white rounded-2xl shadow-sm py-4 px-6 m-4 w-[50%]'
            >
              <div className='flex flex-col'>
                <h2 className='font-bold'>👨 {item.name} | 🐶 {item.pet}</h2>
                <h3>{item.date}</h3>
                <p className='text-xs text-gray-400'>{item.note}</p>
              </div>

              <div className='flex gap-4'>
                <button className='bg-green-500 rounded-full cursor-pointer p-1 text-white'>
                  <Check />
                </button>
                
                <button className='bg-red-500 rounded-full cursor-pointer p-1 text-white'>
                  <X />
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default page