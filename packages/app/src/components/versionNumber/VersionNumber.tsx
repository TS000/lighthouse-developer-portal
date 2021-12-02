import React, { FC } from 'react'
import versionNumber from '../../version.json'

export const VersionNumber: FC = (): any => {
    const { version } = versionNumber
    return <p style={{margin: '0 auto', color: 'white'}}>{`v${version}`}</p>
}