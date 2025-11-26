import { useRef } from 'react'

import type { Entities } from '../types/entities';

type Props = {
    width: number;
    height: number;
    entities: Entities
}

export const Canvas = ({ width, height, entities }: Props) => {
    const ref = useRef<HTMLCanvasElement>(null)

    const draw = () => {
        if (!ref.current) return;

        const ctx = ref.current.getContext('2d');

        if (!ctx) return;

        for (const id in entities) {
            const entity = entities[id];
            switch (entity.type) {
                case 'rectangle': {
                    const { x, y, width, height, color } = entity.payload;

                    ctx.fillStyle = color ?? 'transparent';
                    ctx.fillRect(x, y, width, height)

                    break;
                }
                case 'circle': {
                    const { x, y, radius, color } = entity.payload;

                    ctx.fillStyle = color ?? 'transparent';
                    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)

                    break;
                }
                default: {
                    throw new Error('Entity is now handled!')
                }
            }
        }
    }

    const onMount = () => {
        draw()
    }

    draw()

    return (
        <canvas
            ref={r => {
                ref.current = r;
                onMount()
            }}
            width={width}
            height={height}
            style={{ display: 'block' }}
        />
    )
}