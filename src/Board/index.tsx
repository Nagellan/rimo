import { useState } from 'react'

import { Canvas } from '../Canvas'
import type { Entities } from '../types/entities'
import { useWindowSize } from './useWindowSize'

export const Board = () => {
    const [entities, setEntities] = useState<Entities>(() => ({
        '1': {
            id: '1',
            type: 'rectangle',
            payload: {
                x: 10,
                y: 10,
                width: 100,
                height: 100,
                color: '#000000'
            }
        }
    }))

    const { width, height } = useWindowSize()

    return <Canvas entities={entities} width={width} height={height} />
}