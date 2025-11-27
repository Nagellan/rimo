import { useRef, useEffect } from 'react';

import type { Entities } from '../types/entities';

type Props = {
	width: number;
	height: number;
	entities: Entities;
};

export const Canvas = ({ width, height, entities }: Props) => {
	const ref = useRef<HTMLCanvasElement>(null);

	const centerX = width / 2;
	const centerY = height / 2;

	const draw = () => {
		if (!ref.current) return;

		const ctx = ref.current.getContext('2d');

		if (!ctx) return;

		for (const id in entities) {
			const entity = entities[id];

			switch (entity.type) {
				case 'rectangle': {
					const { x, y, width, height, color } = entity.payload;

					ctx.beginPath();
					ctx.rect(centerX + x, centerY - y, width, height);

					if (color) {
						ctx.fillStyle = color;
						ctx.fill();
					}

					break;
				}
				case 'circle': {
					const { x, y, radius, color } = entity.payload;

					ctx.beginPath();
					ctx.arc(
						centerX + x,
						centerY - y,
						radius,
						0,
						2 * Math.PI,
						false,
					);

					if (color) {
						ctx.fillStyle = color;
						ctx.fill();
					}

					break;
				}
				default: {
					throw new Error('Unknown entity type found!');
				}
			}
		}
	};

	const onMount = () => {
		draw();
	};

	useEffect(() => {
		draw();
	});

	return (
		<canvas
			ref={(r) => {
				ref.current = r;
				onMount();
			}}
			width={width}
			height={height}
			style={{ display: 'block' }}
		/>
	);
};
