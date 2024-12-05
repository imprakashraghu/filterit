import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import baseUrl from '../baseUrl'
import toast from 'react-hot-toast'
import Header from '../components/Header'

function Apps() {

    const router = useNavigate()
    
    const [showAppC, setShowAppC] = useState(false)
    const [apps, setApps] = useState([])

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [endpoint, setEndPoint] = useState('')
    const [code, setCode] = useState(null)

    async function getMyApps() {
        fetch(baseUrl+'/get_apps', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') }
        }).then(res => res.json())
        .then(response => {
            setApps(response?.apps||[])
        }).catch(err => toast.error('Failed to get apps'))
    }
    useEffect(() => {
        getMyApps()
    }, [])
    
    const createApp = () => {
        fetch(baseUrl+'/create_app', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem('token') },
            body: JSON.stringify({
                name,
                description,
                watch_endpoint: endpoint,
                interceptor_code: code
            })
        }).then(res => res.json())
        .then(response => {
            toast.success("App created successfully")
            setShowAppC(false)
            getMyApps()
        }).catch(err => toast.error("Failed to create app"))
    }

    useEffect(() => {
        if (endpoint) {
            setCode(`(function() {const originalFetch = window.fetch;const originalXhrOpen = XMLHttpRequest.prototype.open;function processPayload(payload) {if (!payload) {return "No payload";}if (payload instanceof FormData) {const formDataObject = {};payload.forEach((value, key) => {formDataObject[key] = value;});return { type: "FormData", data: formDataObject };}if (typeof payload === "string") {try {return { type: "JSON", data: JSON.parse(payload) };} catch (e) {return { type: "Text", data: payload };}}return { type: "Unknown", data: payload };}window.fetch = async function(input, init) {try {const url = typeof input === "string" ? input : input.url;if (url.includes("${endpoint}")) {console.log("Intercepted fetch request:", url);let payload = init?.body;const processedPayload = processPayload(payload);console.log("Payload:", processedPayload);}} catch (error) {console.error("Error intercepting fetch request:", error);}return originalFetch.apply(this, arguments);};XMLHttpRequest.prototype.open = function(method, url, async, user, password) {this.addEventListener("readystatechange", function() {if (this.readyState === XMLHttpRequest.DONE && url.includes("${endpoint}")) {console.log("Intercepted XMLHttpRequest:", url);try {const processedPayload = processPayload(this._requestBody);console.log("Payload:", processedPayload);} catch (error){console.error("Error logging XMLHttpRequest payload:", error);}}});const originalSend = this.send;this.send = function(body) {this._requestBody = body;originalSend.apply(this, arguments);};originalXhrOpen.apply(this, arguments);};})();`)
        }
    }, [endpoint])

  return (
    <>
        <Header />
        <div className='bg-white h-[calc(100vh_-_100px)] w-full px-10 pb-4 flex flex-col items-center overflow-hidden relative'>
            <h1 className='w-full text-black font-semibold text-left text-md pb-4 flex flex-row items-center space-x-2'>
                <span>My Apps</span>
                <button 
                    onClick={() => setShowAppC(true)}
                    className='transform active:scale-105 duration-200 rounded-md text-xs font-medium text-black border-black border bg-white hover:bg-black hover:text-white text-center px-3 py-1 flex items-center space-x-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Create App</span>
                </button>
            </h1>        
            <div className='w-full grid grid-rows-4 grid-cols-4 gap-4 py-4'>
                {
                    apps?.map(app => (
                        <div
                            onClick={() => router('/app/'+app._id)}
                            key={app?.name}
                            className='max-w-[300px] cursor-pointer hover:shadow-md hover:border-rose-600 rounded-md border border-black p-3 flex flex-col items-start space-y-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <h2 className='w-full text-left text-md text-black font-semibold'>
                                {app.name}
                            </h2>
                            <p className='text-sm text-gray-500 text-left w-full'>{app.description}</p>
                        </div>
                    ))
                }
            </div>
            <Dialog open={showAppC} as="div" className="relative z-10 focus:outline-none" onClose={() => {}}>
                <DialogBackdrop className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 z-10 w-full overflow-hidden">
                    <div className="flex w-full min-h-full items-center justify-end">
                        <DialogPanel
                            transition
                            className="w-1/3 h-screen flex flex-col items-center justify-between bg-white px-4 py-6 backdrop-blur-2xl duration-100 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                        <DialogTitle as="h3" className="w-full text-left text-md mb-2 font-semibold text-black pb-4">
                            Create an app
                        </DialogTitle>
                        <div className='w-full flex flex-col items-center h-full'>
                            <label htmlFor='name' className='w-full text-black text-left text-xs py-1'>App Name <span className='text-red-500 text-sm'>*</span></label>
                            <input 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                id='name'
                                type='text'
                                placeholder='AI Emailer'
                                className='my-1 rounded-md outline-none focus:border-rose-400 border w-full text-left text-black text-xs px-3 py-2 mb-2'
                            />
                            <label htmlFor='description' className='w-full text-black text-left text-xs py-1'>Short Description <span className='text-red-500 text-sm'>*</span></label>
                            <input 
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                id='description'
                                type='text'
                                placeholder='Email tool to create bulk emails and schedule them'
                                className='my-1 rounded-md outline-none focus:border-rose-400 border w-full text-left text-black text-xs px-3 py-2 mb-2'
                            />
                            <p className='w-full text-left text-gray-500 text-xs italic py-2'>
                                Enter your http request endpoint which handles request to public llm (openai, claudeai)
                            </p>
                            <label htmlFor='input_endpoint' className='w-full text-black text-left text-xs py-1'>Watch Endpoint <span className='text-red-500 text-sm'>*</span></label>
                            <input 
                                value={endpoint}
                                onChange={e => setEndPoint(e.target.value)}
                                id='input_endpoint'
                                type='url'
                                placeholder='http://localhost:4200/api/getEmailContent'
                                className='my-1 rounded-md outline-none focus:border-rose-400 border w-full text-left text-black text-xs px-3 py-2 mb-2'
                            />
                        </div>
                        <div className="w-full text-left mt-4">
                            <button 
                                onClick={() => createApp()}
                                className='transform active:scale-105 duration-200 bg-black px-4 py-2 text-white text-center text-xs rounded-md mr-2'>Create</button>
                            <button 
                                onClick={() => setShowAppC(false)}
                                className='transform active:scale-105 duration-200 bg-white px-4 py-2 text-black hover:bg-gray-100 text-center text-xs rounded-md mr-2'>Cancel</button>
                        </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    </>
  )
}

export default Apps