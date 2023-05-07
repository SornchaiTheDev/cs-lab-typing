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
            className="flex items-center justify-center w-full gap-3 py-3 text-gray-700 border rounded-lg hover:bg-sand-4 hover:dark:bg-secondary-1/70 bg-sand-3 dark:bg-secondary-1 border-zinc-200 dark:border-secondary-2 dark:text-white"
        >
            <FcGoogle size="1.5rem" />
            เข้าสู่ระบบด้วย Google
        </button>
    )
}

export default WithGoogle
