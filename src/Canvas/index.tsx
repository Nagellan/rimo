import { useState, useEffect } from 'react';

import { CanvasRenderer } from '../entities/renderers/CanvasRenderer';
import type { Widget } from '../entities/widgets/Widget';
import { useCanvasMove } from './useCanvasMove';

type Props = {
	width: number;
	height: number;
	widgets: Record<string, Widget>;
};

export const Canvas = ({ width, height, widgets }: Props) => {
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [renderer, setRenderer] = useState<CanvasRenderer | null>(null);

	useEffect(() => {
		if (!renderer) return;
		renderer.setX(x);
		renderer.setY(y);
	}, [renderer, x, y]);

	useEffect(() => {
		if (!renderer) return;
		renderer.setWidth(width);
		renderer.setHeight(height);
	}, [renderer, width, height]);

	const { onMouseDown, onMouseUp } = useCanvasMove((deltaX, deltaY) => {
		setX((prev) => prev + deltaX);
		setY((prev) => prev + deltaY);
	});

	const onRef = (el: HTMLCanvasElement | null) => {
		if (!el) return;
		const ctx = el.getContext('2d');
		if (!ctx) return;
		setRenderer(new CanvasRenderer(ctx, width, height, x, y));
	};

	if (renderer) {
		renderer.clear();
		for (const id in widgets) {
			widgets[id].accept(renderer);
		}
	}

	return (
		<canvas
			ref={onRef}
			width={width}
			height={height}
			style={{ display: 'block' }}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
		/>
	);
};
