import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify'

function WithGoogle() {
    const { query } = useRouter()

    useEffect(() => {
        if (query.error) {
            if (query.error === 'not-authorize') {
                toast('กรุณาเข้าสู่ระบบด้วย @ku.th !', {
                    type: 'error',
                })
            } else {
                toast('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', {
                    type: 'error',
                })
            }
        }
    }, [query])

    return (
        <button
            onClick={() =>
                signIn('google', {
                    redirect: false,
                    callbackUrl: `${
                        query.callbackUrl
                            ? query.callbackUrl
                            : window.location.origin
                    }`,
                })
            }
            className="flex justify-center items-center gap-3 hover:bg-zinc-100 hover:dark:bg-secondary-1/70 bg-zinc-50 dark:bg-secondary-1 border border-zinc-200 dark:border-secondary-2 text-gray-700 dark:text-white py-3 rounded-lg w-full"
        >
            <FcGoogle size="1.5rem" />
            เข้าสู่ระบบด้วย Google
        </button>
    )
}

export default WithGoogle
