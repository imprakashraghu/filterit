import React, { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import Typewriter from 'typewriter-effect/dist/core'
import baseUrl from '../baseUrl'

function Home() {

    const fileRef = useRef(null)
    const router = useNavigate()

    const [openAuthDialog, setOpenAuthDialog] = useState(false)
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [isNew, setIsNew] = useState(false)
    const [qrCode, setQrCode] = useState(null)

    const handleAuth = () => {
        if (!email) {
            return toast.error('Invalid Email Address')
        }

        if (qrCode) {
            setQrCode(null)
            setIsNew(true)
            return
        }

        if (isNew && !code) {
            return toast.error('Enter a 6 digit valid code')
        }

        if (!qrCode && isNew && code) {
            fetch(baseUrl+'/signin', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email: email, token: code })
            })
            .then(res => res.json())
            .then(response => {
                if (response.error) {
                    toast.error(response.error)
                    return
                } else {
                    toast.success(response.message)
                    localStorage.setItem('token', response.token)
                    setOpenAuthDialog(false)
                    setQrCode(null)
                    setCode('')
                    setIsNew(false)
                    setEmail('')
                    return
                }
            })
            .catch(err => toast.error('Authentication Failed'))
            return
        }

        fetch(baseUrl+'/signup', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email: email })
        })
        .then(res => res.json())
        .then(response => {
            if (response.error === 'Email already exists.') {
                setIsNew(true)
            } else {
                setQrCode(response.qr_code_base64||null)
            }
        })
        .catch(err => toast.error('Authentication Failed'))
        // setOpenAuthDialog(false)
    }

    useEffect(() => {
        new Typewriter('#subtext', {
            strings: ['information', 'John', '123-445-3422', 'windsor', 'oullette avenue'],
            autoStart: true,
            loop: true,
            cursorClassName: 'text-white',
            pauseFor: 3000
          });
    }, [])

    useEffect(() => {
        new Typewriter('#subtext2', {
            strings: ['health information and medical records', 'personal information', 'account credentials', 'physical locations'],
            autoStart: true,
            loop: true,
            cursorClassName: 'text-rose-600',
            pauseFor: 2000
          });
    }, [])

  return (
    <div className='bg-white h-screen overflow-hidden w-full flex flex-row items-center justify-between relative'>
        <div className='w-[60%] h-full flex flex-col items-start space-y-1 p-10'>
            <div className='flex items-center space-x-2'>
                <img 
                    src='/logo.png'
                    alt='logo'
                    className='contain h-[30px]'
                />
                <Link to='/' className='flex items-center space-x-2'>
                    <h1 className='tracking-tighter text-2xl text-left text-black font-bold'>filterIt</h1>
                    <span className='font-light text-sm'>for</span>
                    <h2 className='text-transparent bg-clip-text blue-grad font-extrabold tracking-tighter text-xl'>HospitalX</h2>
                </Link>
            </div>
            <br/><br/><br/><br/>
            <h2 className='w-full text-left text-black text-4xl leading-tight font-semibold tracking-tighter mb-2'>
                Protect your valuable {'{ '}<span className='text-3xl' id='subtext'></span>{'}'} <br/>from AI <span className=''>Text Generation Tools</span>
            </h2>
            <p className='text-left w-full max-w-[80%] text-black text-md'>Let us protect your exisiting or new AI application with no-code integration in less than a minute.</p>
            <br />
            {
                localStorage.getItem('token') ? (
                <button 
                    onClick={() => router('/apps')}
                    className='transform active:scale-105 duration-200 rounded-md text-xs font-medium text-white bg-black hover:bg-gray-700 text-center px-3 py-2 flex items-center space-x-1'>
                        <span>View Apps</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                        </svg>
                </button>
                ) : (
                <button 
                    onClick={() => setOpenAuthDialog(true)}
                    className='transform active:scale-105 duration-200 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-700 text-center px-3 py-2 flex items-center space-x-1'>
                        <span>Get Started</span>
                </button>
                )
            }
            {/* <div 
                onClick={() => sessionStorage.getItem('token')?router('/process'):toast.error("Authenticate to continue")}
                className='max-w-[300px] cursor-pointer hover:shadow-md hover:border-rose-600 rounded-md border border-black p-3 flex flex-col items-start space-y-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <h2 className='w-full text-left text-md text-black font-semibold'>
                    Summarizer
                </h2>
                <p className='text-sm text-gray-500 text-left w-full'>Summarize your reports, audits and other documents or texts</p>
            </div> */}
        </div>
        <div className='w-[40%] h-[100vh] absolute right-0 grad__animate flex items-center justify-center'>
            <div className='rounded-xl bg-white min-h-[60%] shadow w-[60%] p-6 space-y-4'>
                <div className='w-[80px] h-[80px] bg-gray-300'></div>
                <div className='w-[50%] bg-gray-300 h-[10px]'></div>
                <h1 className='text-3xl font-regular text-left text-black'>
                    As per studies, one word of your <span className='' id='subtext2'></span> <br/>is worth almost<br/> <span className='font-black'>$60 United States Dollar</span>.
                </h1>
                <p className='text-gray-400 text-sm py-2'>trendmicro.com</p>
            </div>
        </div>
        {/* <div className='relative flex flex-row items-center'>
            <div className='rounded-md flex flex-col items-center justify-center p-1 space-y-1 w-[100px] h-[100px]'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500 mb-2">
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
                <p className='w-full text-center text-xs text-gray-600'>Record.pdf</p>
            </div>
            <div className='rounded-md flex flex-col items-center justify-center p-1 space-y-1 w-[100px] h-[100px]'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500 mb-2">
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
                <p className='w-full text-center text-xs text-gray-600'>Record.docx</p>
            </div>
            <div className='rounded-md flex flex-col items-center justify-center p-1 space-y-1 w-[100px] h-[100px]'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500 mb-2">
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
                <p className='w-full text-center text-xs text-gray-600'>Record.txt</p>
            </div>
            <img
                src='./right-arrow.png'
                className='contain h-[30px] mx-4'
            />
            <div className='rounded-md ml-2 text-xs px-2 py-2 w-[150px] text-center border border-gray-400 border-dashed flex flex-col items-center justify-center bg-white shadow-sm'>
                <p>extracted file content here for further process</p>
            </div>
            <img
                src='./right-arrow.png'
                className='contain h-[30px] mx-4'
            />
            <div className='w-[100px] relative bg-black bottom-2'>
                <img src='./py.jpeg' className='rounded-full bg-white w-[30px] h-[30px] absolute -top-4' />
                <img src='./spacy.png' className='rounded-full bg-white w-[40px] h-[40px] absolute left-7 -top-1' />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rounded-full text-sky-500 absolute top-4 left-2">
                    <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" />
                    <path fillRule="evenodd" d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z" clipRule="evenodd" />
                </svg>
            </div>
            <img src='./right-d-arrow.png' className='contain h-[70px] mr-2' />
            <div className='relative flex flex-col items-start space-y-1 px-2'>
                <span className='rounded-md text-xs text-black flex flex-row items-center space-x-1 text-left'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Personal</span>
                </span>
                <span className='rounded-md text-xs text-black flex flex-row items-center space-x-1 text-left'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Organisation</span>
                </span>
                <span className='rounded-md text-xs text-black flex flex-row items-center space-x-1 text-left'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>Custom</span>
                </span>
            </div>
            <img
                src='./right-arrow.png'
                className='contain h-[30px] mx-4'
            />
            <div className='flex flex-row items-center space-x-2'>
                <img src='./openai.png' className='rounded-full bg-white w-[40px] h-[40px] border border-gray-400' />
                <img src='./mongodb.webp' className='rounded-full bg-white w-[40px] h-[40px] p-1 border border-gray-400' />
                
            </div>
            <div className='relative'>
                <img
                    src='./right-arrow.png'
                    className='contain h-[30px] mx-4 transform rotate-[-30deg] absolute -top-10'
                />
                <img
                    src='./right-arrow.png'
                    className='contain h-[30px] mx-4 transform'
                />
            </div>
            <div className='rounded-md flex flex-row items-center justify-center p-1 space-x-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-500">
                    <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
                <p className='text-center text-xs text-gray-600'>Protected-Record.pdf</p>
            </div>
            <div className='relative'>
                <div className='rounded-md flex flex-row items-center justify-center p-1 space-x-1 absolute -top-14 -right-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-500">
                        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                    </svg>
                    <p className='text-center text-xs text-gray-600 whitespace-nowrap'>Summarized-Content.pdf</p>
                </div>
            </div>
            
        </div> */}
        <Dialog open={openAuthDialog} as="div" className="relative z-10 focus:outline-none" onClose={() => {}}>
                <DialogBackdrop className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 mt-10">
                        <DialogPanel
                            transition
                            className="w-full max-w-lg rounded-md bg-white p-4 backdrop-blur-2xl duration-100 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                        <DialogTitle as="h3" className="text-md mb-2 font-semibold text-black">
                            Authentication
                        </DialogTitle>
                        <label htmlFor='email' className='text-gray-500 text-left text-xs'>Organisation Email Address</label>
                        <input 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            id='email'
                            type='email'
                            placeholder='user@company.com'
                            className='my-1 rounded-md outline-none border w-full text-left text-black text-xs px-3 py-2 mb-2'
                        />
                        {
                            qrCode ? (
                                <div className='flex flex-col space-y-1'>
                                    <p className='w-full text-sm text-gray-600 text-left'>Scan the QR Code with Authenticator app to continue</p>
                                    <img src={qrCode} className='w-40 h-40 contain' alt='qrcode' />
                                </div>
                            ) : (!qrCode && isNew) ? (
                                <>
                                    <label htmlFor='code' className='text-gray-500 text-left text-xs'>Verification Code</label>
                                    <input 
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        id='code'
                                        type='number'
                                        placeholder='6 digit code'
                                        className='my-1 rounded-md outline-none border w-full text-left text-black text-xs px-3 py-2'
                                    />
                                </>
                            ) : null
                        }
                        <div className="mt-4">
                            <button 
                                onClick={() => handleAuth()}
                                className='transform active:scale-105 duration-200 bg-black px-2 py-1 text-white text-center text-xs rounded-md mr-2'>Continue</button>
                            <button 
                                onClick={() => {
                                    setQrCode(null)
                                    setEmail('')
                                    setCode('')
                                    setIsNew(false)
                                    setOpenAuthDialog(false)
                                }}
                                className='transform active:scale-105 duration-200 bg-white px-2 py-1 text-black hover:bg-gray-100 text-center text-xs rounded-md mr-2'>Cancel</button>
                        </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        <Toaster
            position="top-center"
            reverseOrder={false}
        />
    </div>
  )
}

export default Home
