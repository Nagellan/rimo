import { useState } from 'react'

import { Canvas } from '../Canvas'
import { Tools } from '../Tools'
import type { Entities } from '../types/entities'
import { useWindowSize } from './useWindowSize'

let counter = 0;

export const Board = () => {
    const [entities, setEntities] = useState<Entities>(() => ({}))

    const { width, height } = useWindowSize()

    const addRectangle = () => {
        setEntities(prev => ({ ...prev, [++counter]: { id: counter, type: 'rectangle', payload: { x: -50, y: 25, width: 100, height: 50, color: '#000000' } } }))
    }

    const addCircle = () => {
        setEntities(prev => ({ ...prev, [++counter]: { id: counter, type: 'circle', payload: { x: 0, y: 0, radius: 50, color: '#000000' } } }))
    }

    return (
        <>
            <Tools onRectangle={addRectangle} onCircle={addCircle} />
            <Canvas entities={entities} width={width} height={height} />
        </>
    )
}