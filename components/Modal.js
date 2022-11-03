import { Dialog } from '@headlessui/react'

export default function Modal({ isOpen, setIsOpen, children }) {
	return (
		<Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
			<Dialog.Backdrop className="fixed inset-0 bg-black/75" />
			<div className="fixed flex justify-center items-start inset-0 overflow-auto">
				<Dialog.Panel className="mx-auto w-full max-w-lg m-16 p-8 rounded-lg bg-slate-800">
					{children}
				</Dialog.Panel>
			</div>
		</Dialog>
	)
}