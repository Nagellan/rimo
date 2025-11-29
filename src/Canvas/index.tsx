import { useState, useEffect } from 'react';

import { CanvasRenderer } from '../entities/renderers/CanvasRenderer';
import type { Widget } from '../entities/widgets/Widget';

type Props = {
	widgets: Record<string, Widget>;
	width: number;
	height: number;
	viewportX: number;
	viewportY: number;
	dpr: number;
	onMoveStart: (
		x: number,
		y: number,
		offsetX: number,
		offsetY: number,
	) => void;
	onMoving: (x: number, y: number, offsetX: number, offsetY: number) => void;
	onMoveEnd: (x: number, y: number, offsetX: number, offsetY: number) => void;
};

export const Canvas = ({
	widgets,
	width,
	height,
	viewportX,
	viewportY,
	dpr,
	onMoveStart,
	onMoving,
	onMoveEnd,
}: Props) => {
	const [renderer, setRenderer] = useState<CanvasRenderer | null>(null);

	useEffect(() => {
		if (!renderer) return;
		renderer.setViewportX(viewportX);
		renderer.setViewportY(viewportY);
	}, [renderer, viewportX, viewportY]);

	useEffect(() => {
		if (!renderer) return;
		renderer.setWidth(width);
		renderer.setHeight(height);
	}, [renderer, width, height]);

	useEffect(() => {
		if (!renderer) return;
		renderer.setDpr(dpr);
	}, [renderer, dpr]);

	const onRef = (el: HTMLCanvasElement | null) => {
		if (!el) return;
		const ctx = el.getContext('2d');
		if (!ctx) return;
		setRenderer(
			new CanvasRenderer(ctx, width, height, viewportX, viewportY, dpr),
		);
	};

	const getCenteredCoordinates = (x: number, y: number): [number, number] => {
		return [
			x - (Math.floor(width / 2) + viewportX),
			Math.floor(height / 2) - viewportY - y,
		];
	};

	if (renderer) {
		renderer.clear();
		for (const id in widgets) {
			widgets[id].accept(renderer);
		}
	}

	const [moving, setMoving] = useState(false);

	return (
		<canvas
			ref={onRef}
			width={width * dpr}
			height={height * dpr}
			style={{
				display: 'block',
				width: `${width}px`,
				height: `${height}px`,
			}}
			onMouseDown={(event) => {
				setMoving(true);
				onMoveStart(
					...getCenteredCoordinates(
						event.nativeEvent.offsetX,
						event.nativeEvent.offsetY,
					),
					event.nativeEvent.offsetX,
					event.nativeEvent.offsetY,
				);
			}}
			onMouseMove={(event) => {
				if (!moving) return;
				onMoving(
					...getCenteredCoordinates(
						event.nativeEvent.offsetX,
						event.nativeEvent.offsetY,
					),
					event.nativeEvent.offsetX,
					event.nativeEvent.offsetY,
				);
			}}
			onMouseUp={(event) => {
				setMoving(false);
				onMoveEnd(
					...getCenteredCoordinates(
						event.nativeEvent.offsetX,
						event.nativeEvent.offsetY,
					),
					event.nativeEvent.offsetX,
					event.nativeEvent.offsetY,
				);
			}}
		/>
	);
};
