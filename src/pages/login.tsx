import type { NextPage } from 'next'
import Head from 'next/head'
import WithUsernamePassword from '@/components/Login/WithUsernamePassword'
import Divider from '@/components/Login/Divider'
import Github from '@/components/Login/Github'
import WithGoogle from '@/components/Login/WithGoogle'
import Header from '@/components/Login/Header'

const Login: NextPage = () => {
    return (
        <>
            <Head>
                <title>Login | CS-LAB</title>
            </Head>
            <div className="fixed w-screen bg-white dark:bg-primary-1">
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center w-full max-w-md p-4">
                        <Header />
                        <div className="flex flex-col items-center w-full gap-6 mt-6">
                            <WithGoogle />
                            <Divider />
                            <WithUsernamePassword />
                        </div>
                        {/* <Github /> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
