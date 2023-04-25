import React from 'react'

function Divider() {
    return (
        <div className="flex items-center w-1/2 gap-4">
            <div className="h-[2px] bg-zinc-900 w-full"></div>
            <h5 className="text-sm dark:text-ascent-1">หรือ</h5>
            <div className="h-[2px] bg-zinc-900 w-full"></div>
        </div>
    )
}

export default Divider
