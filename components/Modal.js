import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'

export default function Modal({ isOpen, setIsOpen, children }) {
    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <Dialog.Backdrop className="fixed inset-0 bg-black/75" />
            <Dialog.Panel className="mx-auto w-full max-w-lg p-8 rounded-lg bg-slate-700">
                {children}
                {/*             <button onClick={() => setIsOpen(false)} className="btn btn-icon">
                <XMarkIcon className="h-text" />
            </button>*/}
            </Dialog.Panel>
        </Dialog>
    )
}