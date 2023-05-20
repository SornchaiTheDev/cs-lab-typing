import React from 'react'
import { BsGithub } from 'react-icons/bs'

function Github() {
    return (
        <a
            className="absolute bottom-4 flex items-center gap-2 underline dark:text-white"
            href="https://github.com/kucs37/cs-lab"
            target="_blank"
            rel="noreferrer"
        >
            <BsGithub size="1.25rem" />
            Github
        </a>
    )
}

export default Github
