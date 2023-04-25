export const signInWithUsernameAndPassword = async ({
    username,
    password,
}: {
    username: string
    password: string
}): Promise<{ status: 'success' | 'failed' }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'sornchai.som' && password === '1234567') {
                resolve({ status: 'success' })
            } else {
                resolve({ status: 'failed' })
            }
        }, 1000)
    })
}
