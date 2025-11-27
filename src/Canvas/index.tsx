import { useState, useEffect, useRef } from 'react';

import { CanvasRenderer } from '../entities/renderers/CanvasRenderer';
import type { Widget } from '../entities/widgets/Widget';

type Props = {
	widgets: Record<string, Widget>;
	width: number;
	height: number;
	x: number;
	y: number;
	onMove: (
		startX: number,
		startY: number,
		endX: number,
		endY: number,
	) => void;
};

export const Canvas = ({ widgets, width, height, x, y, onMove }: Props) => {
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

	const startXRef = useRef(0);
	const startYRef = useRef(0);

	return (
		<canvas
			ref={onRef}
			width={width}
			height={height}
			style={{ display: 'block' }}
			onMouseDown={(event) => {
				startXRef.current = event.nativeEvent.offsetX - (width / 2 + x);
				startYRef.current = height / 2 - y - event.nativeEvent.offsetY;
			}}
			onMouseUp={(event) => {
				const endX = event.nativeEvent.offsetX - (width / 2 + x);
				const endY = height / 2 - y - event.nativeEvent.offsetY;
				onMove(startXRef.current, startYRef.current, endX, endY);
			}}
		/>
	);
};
