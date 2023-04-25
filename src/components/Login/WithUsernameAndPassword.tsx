import { FormEvent, useState, useRef, useEffect, ChangeEvent } from 'react'
import { BsArrowRightCircle } from 'react-icons/bs'
import { BiLoaderCircle } from 'react-icons/bi'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { signInWithUsernameAndPassword } from '@/services/signin'

function WithEmail() {
    const [step, setStep] = useState<'username' | 'password'>('username')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleOnSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (step != 'password') {
            return setStep('password')
        }

        setIsSubmit(true)
        signInWithUsernameAndPassword({ username, password })
            .then(({ status }) => {
                if (status === 'failed') {
                    setIsSubmit(false)
                    return setError(true)
                }

                router.push('/')
            })
            .catch((e) => console.log(e))
    }

    useEffect(() => {
        if (step === 'password') passwordRef.current?.focus()
    }, [step])

    return (
        <form onSubmit={handleOnSubmit} className="w-full">
            <div className="relative w-full">
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ชื่อผู้ใช้"
                    className={clsx(
                        'py-3 px-4 w-full border outline-none focus:ring-1 dark:bg-secondary-1 dark:text-ascent-1',
                        step === 'username' ? 'rounded-lg' : 'rounded-t-lg',
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'dark:border-secondary-2'
                    )}
                />
                {step === 'username' && (
                    <button
                        type="submit"
                        className="absolute top-1/2 -translate-y-1/2 right-3 rounded-full"
                    >
                        <BsArrowRightCircle className="text-lg text-ascent-1" />
                    </button>
                )}
            </div>

            {step === 'password' && (
                <>
                    <div className="relative w-full">
                        <input
                            ref={passwordRef}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="รหัสผ่าน"
                            className={clsx(
                                'py-3 px-4 w-full border outline-none dark:bg-secondary-1 dark:text-ascent-1 rounded-b',
                                error
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'dark:border-secondary-2'
                            )}
                        />

                        <button
                            type="submit"
                            className="absolute top-1/2 -translate-y-1/2 right-3 rounded-full"
                        >
                            {isSubmit ? (
                                <BiLoaderCircle className="text-lg text-ascent-1 animate-spin" />
                            ) : (
                                <BsArrowRightCircle className="text-lg text-ascent-1" />
                            )}
                        </button>
                    </div>

                    {error && (
                        <p className="text-sm my-2 text-red-500">
                            ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
                        </p>
                    )}
                </>
            )}
        </form>
    )
}

export default WithEmail
