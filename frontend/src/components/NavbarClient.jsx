import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { GiSoccerKick } from 'react-icons/gi'
import {products} from '../utils/navbarData'

const NavbarClient = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className='shadow-md'>
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link to='/' className='-m-1.5 p-1.5'>
                        <span className="sr-only">FOOTBALL CORE</span>
                        <Link to='/' className='flex items-center space-x-2'>
                            <h1 className='text-3xl text-white'>
                                <span className='text-green-500'>F</span>OOT<span className='text-green-500'>B</span>ALL <span className='text-green-500'>C</span>ORE
                            </h1>
                        </Link>
                    </Link>
                </div>

                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>

                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-lg font-subtitle text-white">
                            SERVICIOS
                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                        </PopoverButton>

                        <PopoverPanel transition
                            className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-navbar shadow-lg ring-1 ring-blue-900 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in">
                            <div className="p-4">
                                {products.map((item) => (
                                <div
                                    key={item.name}
                                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-background">
                                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-navbar">
                                        <item.icon aria-hidden="true" className="size-6 text-white group-hover:text-light" />
                                    </div>
                                    <div className="flex-auto">
                                        <Link to={item.href} className="block text-lg font-subtitle text-white">
                                            {item.name}
                                            <span className="absolute inset-0" />
                                        </Link>
                                        <p className="mt-1 text-white font-subtitle">{item.description}</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover>

                    <Link to="#" className="text-lg font-subtitle text-white">
                        SOBRE NOSOTROS
                    </Link>
                    <Link to="#" className="text-lg font-subtitle text-white">
                        NUESTRO EQUIPO
                    </Link>
                    <Link to="#" className="text-lg font-subtitle text-white">
                        CONTÁCTANOS
                    </Link>
                </PopoverGroup>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Link to='/get-started' className="border border-light rounded-lg w-[150px] text-center text-lg text-white p-2 hover:bg-light transition duration-300">
                        Comenzar <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </nav>

            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-navbar px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-blue-900">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5 text-white">
                            <span className="sr-only">ScoreXpert</span>
                            <Link to="/" className='flex items-center space-x-2'>
                                <GiSoccerKick className="text-4xl text-white" />
                                <h1 className="text-3xl font-title text-white">
                                    SCORE<span className='text-light'>X</span>PERT
                                </h1>
                            </Link>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-white">
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-navbar">
                            <div className="space-y-2 py-6">
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-subtitle text-white hover:bg-background">
                                        SERVICIOS
                                        <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-[open]:rotate-180" />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">
                                        {[...products].map((item) => (
                                            <DisclosureButton
                                                key={item.name}
                                                as="a"
                                                href={item.href}
                                                className="block rounded-lg py-2 pl-6 pr-3 text-lg text-white hover:bg-background">
                                                {item.name}
                                            </DisclosureButton>
                                        ))}
                                    </DisclosurePanel>
                                </Disclosure>
                                <Link to="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-lg font-subtitle text-white hover:bg-background">
                                    SOBRE NOSOTROS
                                </Link>
                                <Link to="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-lg font-subtitle text-white hover:bg-background">
                                    NUESTRO EQUIPO
                                </Link>
                                <Link to="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-lg font-subtitle text-white hover:bg-background">
                                    CONTÁCTANOS
                                </Link>
                            </div>
                            <div className="py-6">
                                <Link to='/get-started'
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-lg font-subtitle text-white hover:bg-background">
                                    Comenzar
                                </Link>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}

export default NavbarClient