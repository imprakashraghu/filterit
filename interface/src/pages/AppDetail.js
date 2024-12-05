import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tab } from '@headlessui/react'
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import baseUrl from '../baseUrl'
import toast from 'react-hot-toast'
import Header from '../components/Header'
import numeral from 'numeral'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function AppDetail() {

    const router = useNavigate()
    const [app, setApp] = useState(null)
    const [showAppC, setShowAppC] = useState(false)
    const [history, setHistory] = useState([])
    const [selected, setSelected] = useState(null)

      console.log(selected);

    async function getMyApps() {
        fetch(baseUrl+'/get_apps', {
            method: 'GET',
            headers: { 'Authorization': localStorage.getItem('token') }
        }).then(res => res.json())
        .then(response => {
            setApp(response?.apps?.filter(i => i._id === '674e5bfba6741bc26fe1c422')[0]||null)
        }).catch(err => toast.error('Failed to get apps'))
    }

    async function getAppHistory() {
        fetch(baseUrl+'/get_user_uploads', {
            method: 'GET',
            headers: { 'Authorization': localStorage.getItem('token') }
        }).then(res => res.json())
        .then(response => {
            setHistory(response?.uploads)
        }).catch(err => toast.error('Failed to get apps'))
    }

    useEffect(() => {
        getMyApps()
        getAppHistory()
        return () => {}
    }
    , [])

  return (
    <>
        <Header />
        <div className='bg-white h-[calc(100vh_-_100px)] w-full px-10 pb-4 flex flex-col items-start overflow-y-auto'>
            <h1 className='w-full text-black font-semibold text-left text-md pb-4 flex flex-row items-center space-x-2'>
                <span onClick={() => router('/apps')} className='text-rose-500 hover:cursor-pointer hover:underline'>My Apps</span>
                <span>{'>'}</span>
                <span>{app?.name||'App Name'}</span>
            </h1>
            <Tab.Group defaultIndex={2} className='w-full'>
                <Tab.List className="w-[400px] flex space-x-1 rounded-md bg-gray-500/20 p-1">
                <Tab
                    className={({ selected }) =>
                    classNames(
                        'w-full rounded-md py-2 px-4 text-sm font-medium leading-5',
                        'ring-white/60 ring-offset-2 ring-offset-rose-400 focus:outline-none focus:ring-2',
                        selected
                        ? 'bg-white text-rose-700 shadow'
                        : 'text-black hover:bg-white hover:text-black'
                    )
                    }
                >
                    Home
                </Tab>
                <Tab
                    className={({ selected }) =>
                    classNames(
                        'w-full rounded-md py-2 px-4 text-sm font-medium leading-5',
                        'ring-white/60 ring-offset-2 ring-offset-rose-400 focus:outline-none focus:ring-2',
                        selected
                        ? 'bg-white text-rose-700 shadow'
                        : 'text-black hover:bg-white hover:text-black'
                    )
                    }
                >
                    Settings
                </Tab>
                </Tab.List>
                <Tab.Panels className="w-full mt-2">
                    <Tab.Panel
                    className={classNames(
                        'w-full rounded-xl bg-white p-3',
                        'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2'
                    )}
                    >
                        <table class="w-full outline-none overflow-y-auto max-w-[90%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        S.No
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Secured (approx.)
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Happened On
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Endpoint
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='max-h-[200px] overflow-y-auto'>              
                            {
                                history?.map((item, index) => (
                                    <tr 
                                        onClick={() => {
                                            setSelected(item)
                                            setShowAppC(true)
                                        }}
                                        class="cursor-pointer hover:bg-gray-100 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {index+1}.
                                        </th>
                                        <td class="px-6 py-2">
                                            Sensitive Data <span className={Object.keys(item.entity_mapping)?.length<5?'bg-green-500 text-white rounded-md p-1':Object.keys(item.entity_mapping)?.length>10?'bg-red-500 text-white rounded-md p-1':'bg-amber-500 text-white rounded-md p-1'}>{Object.keys(item.entity_mapping)?.length}</span>
                                        </td>
                                        <td className='px-6 py-2'>
                                            {numeral(Object.keys(item.entity_mapping)?.length*60.00).format('($ 0.00 a)')} USD
                                        </td>
                                        <td class="px-6 py-2">
                                            {new Date(item?.updatedAt||new Date())?.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium'})}
                                        </td>
                                        <td class="px-6 py-2">
                                            {app?.watch_endpoint||''}
                                        </td>
                                    </tr>
                                ))
                            }           
                            </tbody>
                        </table>
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                        'rounded-xl bg-white p-3',
                        'ring-white/60 ring-offset-2 ring-offset-rose-400 focus:outline-none focus:ring-2'
                        )}
                    >
                        {
                            app && (
                                <div className='w-full flex flex-col items-center h-full'>
                                    <label htmlFor='name' className='w-full text-black text-left text-xs py-1'>App Name <span className='text-red-500 text-sm'>*</span></label>
                                    <input 
                                        value={app?.name}
                                        // onChange={e => setEmail(e.target.value)}
                                        id='name'
                                        type='text'
                                        placeholder='AI Emailer'
                                        className='my-1 rounded-md outline-none focus:border-rose-400 border w-full text-left text-black text-xs px-3 py-2 mb-2'
                                    />
                                    <label htmlFor='description' className='w-full text-black text-left text-xs py-1'>Short Description <span className='text-red-500 text-sm'>*</span></label>
                                    <input 
                                        value={app?.description}
                                        // onChange={e => setEmail(e.target.value)}
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
                                        value={app?.watch_endpoint}
                                        // onChange={e => setEmail(e.target.value)}
                                        id='input_endpoint'
                                        type='url'
                                        placeholder='http://localhost:4200/api/getEmailContent'
                                        className='my-1 rounded-md outline-none focus:border-rose-400 border w-full text-left text-black text-xs px-3 py-2 mb-2'
                                    />
                                    <p className='w-full text-left text-gray-500 text-xs italic py-2'>
                                        Copy the following code and paste it in your target application's head tag
                                    </p>
                                    <div className='w-full bg-gray-100 rounded-md p-2 border max-h-[300px] overflow-y-scroll'>
                                        <code className='block overflow-x-scroll text-xs'>{app?.interceptor_code}</code>
                                    </div>
                                </div>
                            )
                        }
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
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
                        Review your incident
                    </DialogTitle>
                    {
                        selected && (
                            <div className='w-full flex flex-col items-center space-y-2 h-full'>
                                <p className='w-full text-left text-black text-sm'>
                                    Incident occured by {selected?.email}
                                </p>
                                <p className='w-full text-left text-black text-sm'>
                                    Sensitive Data Found 
                                </p>
                                {!!Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Personal Entity')?.length&&(<p className='w-full text-white text-sm bg-black rounded-md p-1'>Personal Information</p>)}
                                <div className='w-full flex-wrap flex items-center space-y-1 space-x-2'>
                                    {
                                        Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Personal Entity')?.map(item => (
                                            <span className='bg-gray-100 border text-black p-1 text-sm rounded-md'>{item?.value||''}</span>
                                        ))
                                    }
                                </div>
                                {!!Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Organizational Entity')?.length&&(<p className='w-full text-white text-sm bg-black rounded-md p-1'>Organisational Information</p>)}
                                <div className='w-full flex-wrap flex items-center space-y-1 space-x-2'>
                                    {
                                        Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Organizational Entity')?.map(item => (
                                            <span className='bg-gray-100 border text-black p-1 text-sm rounded-md'>{item?.value||''}</span>
                                        ))
                                    }
                                </div>
                                {!!Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Geo Entity')?.length&&(<p className='w-full text-white text-sm bg-black rounded-md p-1'>Geographical Information</p>)}
                                <div className='w-full flex-wrap flex items-center space-y-1 space-x-2'>
                                    {
                                        Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Geo Entity')?.map(item => (
                                            <span className='bg-gray-100 border text-black p-1 text-sm rounded-md'>{item?.value||''}</span>
                                        ))
                                    }
                                </div>
                                {!!Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Miscellaneous Entity')?.length&&(<p className='w-full text-white text-sm bg-black rounded-md p-1'>Miscellaneous Information</p>)}
                                <div className='w-full flex-wrap flex items-center space-y-1 space-x-2'>
                                    {
                                        Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Miscellaneous Entity')?.map(item => (
                                            <span className='bg-gray-100 border text-black p-1 text-sm rounded-md'>{item?.value||''}</span>
                                        ))
                                    }
                                </div>
                                {!!Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Custom Entity')?.length&&(<p className='w-full text-white text-sm bg-black rounded-md p-1'>Custom Information</p>)}
                                <div className='w-full flex-wrap flex items-center space-y-1 space-x-2'>
                                    {
                                        Object.values(selected?.entity_mapping)?.filter(item => item?.entity_type === 'Custom Entity')?.map(item => (
                                            <span className='bg-gray-100 border text-black p-1 text-sm rounded-md'>{item?.value||''}</span>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                    <div className="w-full text-left mt-4">
                        <button 
                            onClick={() => {
                                setShowAppC(false)
                                setSelected(null)
                            }}
                            className='transform active:scale-105 duration-200 bg-white px-4 py-2 text-black hover:bg-gray-100 text-center text-xs rounded-md mr-2'>Close</button>
                    </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    </>
  )

}

export default AppDetail