import { useState } from 'react';

import { CanvasRenderer } from '../entities/renderers/CanvasRenderer';
import type { Widget } from '../entities/widgets/Widget';

type Props = {
	widgets: Record<string, Widget>;
	selectedWidgetIds: string[];
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
	onClick: (x: number, y: number, offsetX: number, offsetY: number) => void;
};

export const Canvas = ({
	widgets,
	selectedWidgetIds,
	width,
	height,
	viewportX,
	viewportY,
	dpr,
	onMoveStart,
	onMoving,
	onMoveEnd,
	onClick,
}: Props) => {
	const [renderer, setRenderer] = useState<CanvasRenderer | null>(null);

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
		renderer.setViewportX(viewportX);
		renderer.setViewportY(viewportY);
		renderer.setWidth(width);
		renderer.setHeight(height);
		renderer.setDpr(dpr);

		renderer.clear();
		for (const id in widgets) {
			const widget = widgets[id];
			widget.accept(renderer);
			if (selectedWidgetIds.includes(id)) {
				renderer.select(widget);
			}
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
			onPointerDown={(event) => {
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
			onPointerMove={(event) => {
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
			onPointerUp={(event) => {
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
			onClick={(event) => {
				onClick(
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
