import { useState } from 'react';

import { CanvasRenderer } from '../../entities/renderers/CanvasRenderer';
import type { Widget } from '../../entities/widgets/Widget';
import type { Dispatch } from '../../types/events';
import { EVENT } from '../../constants/events';
import { useMoveViewport } from './useMoveViewport';
import { useMoveWidget } from './useMoveWidget';

type Props = {
	widgets: Record<string, Widget>;
	selectedWidgetIds: string[];
	width: number;
	height: number;
	viewportX: number;
	viewportY: number;
	dpr: number;
	dispatch: Dispatch;
};

export const Canvas = ({
	widgets,
	selectedWidgetIds,
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
		}
		for (const id of selectedWidgetIds) {
			const widget = widgets[id];
			renderer.select(widget);
		}
	}

	const [moving, setMoving] = useState(false);
	const [movingWidgetId, setMovingWidgetId] = useState<string | null>(null);
	const [selectionCorner, setSelectionCorner] = useState<string | null>(null);
	const [w, setW] = useState(0);
	const [h, setH] = useState(0);
	const [uX, setUX] = useState(0);
	const [uY, setUY] = useState(0);
	const [sX, setSX] = useState(0);
	const [sY, setSY] = useState(0);

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
							payload: { id, add: event.shiftKey },
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
					const selectionCorner = renderer?.getSelectionCorner(
						x,
						y,
						widget,
					);
					if (selectionCorner) {
						selected = id;
						setSelectionCorner(selectionCorner);
						setW(widget.width);
						setH(widget.height);
						setUX(widget.x);
						setUY(widget.y);
						setSX(x);
						setSY(y);
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
					if (selectionCorner) {
						const [x, y] = getCenteredCoordinates(
							event.nativeEvent.offsetX,
							event.nativeEvent.offsetY,
						);
						let newX = widgets[movingWidgetId].x;
						let newY = widgets[movingWidgetId].y;
						let newWidth = widgets[movingWidgetId].width;
						let newHeight = widgets[movingWidgetId].height;
						if (selectionCorner === 'top-left') {
							newX = uX + x - sX;
							newY = uY + y - sY;
							newWidth = w - x + sX;
							newHeight = h - sY + y;
						} else if (selectionCorner === 'top-right') {
							newY = uY + y - sY;
							newWidth = w + x - sX;
							newHeight = h - sY + y;
						} else if (selectionCorner === 'bottom-right') {
							newWidth = w + x - sX;
							newHeight = h + sY - y;
						} else if (selectionCorner === 'bottom-left') {
							newX = uX + x - sX;
							newWidth = w - x + sX;
							newHeight = h + sY - y;
						}
						if (newHeight < 40 || newWidth < 40) return;
						dispatch({
							type: EVENT.RESIZE_WIDGET,
							payload: {
								id: movingWidgetId,
								x: newX,
								y: newY,
								width: newWidth,
								height: newHeight,
							},
						});
					} else {
						onWidgetMoving(
							...getCenteredCoordinates(
								event.nativeEvent.offsetX,
								event.nativeEvent.offsetY,
							),
						);
					}
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
				setSelectionCorner(null);
				setW(0);
				setH(0);
				setUX(0);
				setUY(0);
				setSX(0);
				setSY(0);
			}}
		/>
	);
};
