import { useState } from 'react';

import { CanvasRenderer } from '../../entities/renderers/CanvasRenderer';
import type { Widget } from '../../entities/widgets/Widget';
import type { Dispatch } from '../../types/events';
import { EVENT } from '../../constants/events';
import { useMoveViewport } from './useMoveViewport';
import { useMoveWidget } from './useMoveWidget';

type Props = {
	widgets: Record<string, Widget>;
	selectedWidgetId: string | null;
	width: number;
	height: number;
	viewportX: number;
	viewportY: number;
	dpr: number;
	dispatch: Dispatch;
};

export const Canvas = ({
	widgets,
	selectedWidgetId,
	width,
	height,
	viewportX,
	viewportY,
	dpr,
	dispatch,
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

	// const getOffsetCoordinates = (x: number, y: number): [number, number] => {
	// 	return [
	// 		Math.floor(width / 2) + viewportX + x,
	// 		Math.floor(height / 2) - viewportY - y,
	// 	];
	// };

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
			if (id === selectedWidgetId) {
				renderer.select(widget);
			}
		}
	}

	const [moving, setMoving] = useState(false);
	const [movingWidgetId, setMovingWidgetId] = useState<string | null>(null);

	const { onViewportMoveStart, onViewportMoving, onViewportMoveEnd } =
		useMoveViewport(viewportX, viewportY, width, height, (x, y) => {
			dispatch({
				type: EVENT.MOVE_VIEWPORT,
				payload: { x, y },
			});
		});

	const { onWidgetMoveStart, onWidgetMoving, onWidgetMoveEnd } =
		useMoveWidget((x, y) => {
			if (!movingWidgetId) return;
			dispatch({
				type: EVENT.MOVE_WIDGET,
				payload: { id: movingWidgetId, x, y },
			});
		});

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
				const [x, y] = getCenteredCoordinates(
					event.nativeEvent.offsetX,
					event.nativeEvent.offsetY,
				);
				let selected = null;
				for (const id in widgets) {
					const widget = widgets[id];
					if (widget.containsPoint(x, y)) {
						selected = id;
						dispatch({
							type: EVENT.SELECT_WIDGET,
							payload: { id },
						});
						onWidgetMoveStart(
							widget,
							...getCenteredCoordinates(
								event.nativeEvent.offsetX,
								event.nativeEvent.offsetY,
							),
						);
						break;
					}
				}
				if (!selected) {
					dispatch({
						type: EVENT.SELECT_WIDGET,
						payload: { id: null },
					});
					onViewportMoveStart(
						event.nativeEvent.offsetX,
						event.nativeEvent.offsetY,
					);
				}
				setMovingWidgetId(selected);
			}}
			onPointerMove={(event) => {
				if (!moving) return;
				if (movingWidgetId) {
					onWidgetMoving(
						...getCenteredCoordinates(
							event.nativeEvent.offsetX,
							event.nativeEvent.offsetY,
						),
					);
				} else {
					onViewportMoving(
						event.nativeEvent.offsetX,
						event.nativeEvent.offsetY,
					);
				}
			}}
			onPointerUp={() => {
				setMoving(false);
				setMovingWidgetId(null);
				onWidgetMoveEnd();
				onViewportMoveEnd();
			}}
		/>
	);
};
