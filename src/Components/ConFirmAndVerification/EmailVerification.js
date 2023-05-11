import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { verifyUserEmail } from '../../Api/Auth';
import { toast } from 'react-hot-toast';




const OTP_LENGTH = 4;


const EmailVerification = () => {

    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''))
    const [activeOtpIndex, setActiveOtpIndex] = useState(0)
    // console.log(activeOtpIndex,"active")
    const inputRef = useRef()
    const { state } = useLocation()
    const user = state?.user
    console.log(user, 'user')
    
    const navigate = useNavigate()

    const focusNextInputField = (index) => {
        setActiveOtpIndex(index + 1)
    }
    const focusPreviousInputField = (index) => {
        let nextIndex;
        const diff = index - 1
        nextIndex = diff !== 0 ? diff : 0
        setActiveOtpIndex(nextIndex)
    }
    const handleOtp = (e, index) => {
        // console.log(e,"handleIndex")
        // console.log(e.target.value)
        const newOtp = [...otp]
        newOtp[index] = e.target.value.substring(e.target.value.length - 1, e.target.value.length)


        console.log(e.target.value)
        if (!e.target.value) {
            focusPreviousInputField(index)
        }
        else {
            focusNextInputField(index)

        }
        setOtp([...newOtp])
    }

    const handleKeyDown = ({ key }, index) => {

        if (key === 'Backspace') {
            focusPreviousInputField(index)
        }

    }
    useEffect(() => {

        inputRef.current?.focus()
        console.log(inputRef, 'inputRef')
    }, [activeOtpIndex])

    useEffect(() => {

        if (!user) {
            navigate('/not-found')
        }
    }, [user])
    const isValidOTP = (otp) => {
        let valid = false;

        for (let val of otp) {
            valid = !isNaN(parseInt(val))
            if (!valid) {
                break
            }
        }

        return valid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isValidOTP(otp)) {
            return toast.error('invalid-otp')
        }

        const  {error,message}  = await verifyUserEmail({
            OTP: otp.join(''),
            userId: user.id
        })

        if (error) {
         toast.error(error)
        }
        else {
            toast.success(message)
        }
        console.log(otp)
    }
    return (
        <div className='fixed inset-0 dark:bg-slate-900 -z-10 flex justify-center items-center'>

            <div className=' max-w-screen-xl mx-auto '>

                <form onSubmit={handleSubmit} className='dark:bg-[#272727] bg-white drop-shadow-lg rounded p-6  space-y-6'>
                    <div>
                        <h1 className=' text-xl text-black dark:text-white text-center'>Please enter the OTP to verify your account</h1>
                        <p className='text-center text-slate-500 dark:text-slate-300 mt-4 text-sm'>OTP has been sent to your email</p>
                    </div>


                    <div className='flex justify-center items-center space-x-4'>
                        {
                            otp.map((_, index) => {
                                return <input type='number'
                                    ref={activeOtpIndex === index ? inputRef : null}
                                    key={index}
                                    value={otp[index] || ""}
                                    onChange={(e) => handleOtp(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className='w-12 h-12 border-2 border-[#a48f8f] dark:focus:border-white rounded bg-transparent 
                                    focus:border-black
                                    outline-none text-center dark:text-white text-black font-semibold text-xl
                        spin-button-none'/>
                            })
                        }
                    </div>

                    <input type='submit'
                        value='verify Account'
                        className='w-full rounded bg-black text-white hover:bg-opacity-90 transition font-semibold text-lg  mt-4 cursor-pointer
                    p-1'/>


                </form>

            </div>

        </div>
    );
};

export default EmailVerification;