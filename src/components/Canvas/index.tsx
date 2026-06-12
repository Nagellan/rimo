import { useState, useRef, useEffect } from 'react';

import { CanvasRenderer } from '../../entities/renderers/CanvasRenderer';
import type { Widget } from '../../entities/widgets';
import {
	BOARD_ACTION_TYPE,
	type BoardActionDispatch,
} from '../../features/board/actions';
import { useMoveViewport, useMoveWidget } from '../../hooks';

type Props = {
	widgets: Record<string, Widget>;
	selectedWidgetIds: string[];
	width: number;
	height: number;
	viewportX: number;
	viewportY: number;
	dpr: number;
	dispatch: BoardActionDispatch;
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
	const rendererRef = useRef<CanvasRenderer>(null);

	const [moving, setMoving] = useState(false);
	const [movingWidgetId, setMovingWidgetId] = useState<string | null>(null);
	const [selectionCorner, setSelectionCorner] = useState<string | null>(null);
	const [w, setW] = useState(0);
	const [h, setH] = useState(0);
	const [uX, setUX] = useState(0);
	const [uY, setUY] = useState(0);
	const [sX, setSX] = useState(0);
	const [sY, setSY] = useState(0);

	useEffect(() => {
		if (!rendererRef.current) return;

		rendererRef.current.setViewportX(viewportX);
		rendererRef.current.setViewportY(viewportY);
		rendererRef.current.setWidth(width);
		rendererRef.current.setHeight(height);
		rendererRef.current.setDpr(dpr);

		rendererRef.current.clear();
		for (const id in widgets) {
			const widget = widgets[id];
			widget.accept(rendererRef.current);
		}
		for (const id of selectedWidgetIds) {
			const widget = widgets[id];
			rendererRef.current.select(widget);
		}
	}, [dpr, height, selectedWidgetIds, viewportX, viewportY, widgets, width]);

	const { onViewportMoveStart, onViewportMoving, onViewportMoveEnd } =
		useMoveViewport(viewportX, viewportY, width, height, (x, y) => {
			dispatch({
				type: BOARD_ACTION_TYPE.MOVE_VIEWPORT,
				payload: { x, y },
			});
		});

	const { onWidgetMoveStart, onWidgetMoving, onWidgetMoveEnd } =
		useMoveWidget((x, y) => {
			if (!movingWidgetId) return;
			dispatch({
				type: BOARD_ACTION_TYPE.MOVE_WIDGET,
				payload: { id: movingWidgetId, x, y },
			});
		});

	const onRef = (el: HTMLCanvasElement | null) => {
		if (!el) return;
		const ctx = el.getContext('2d');
		if (!ctx) return;
		rendererRef.current = new CanvasRenderer(
			ctx,
			width,
			height,
			viewportX,
			viewportY,
			dpr,
		);
	};

	const getCenteredCoordinates = (x: number, y: number): [number, number] => {
		return [
			x - (Math.floor(width / 2) + viewportX),
			Math.floor(height / 2) - viewportY - y,
		];
	};

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
							type: BOARD_ACTION_TYPE.SELECT_WIDGET,
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
					const selectionCorner =
						rendererRef.current?.getSelectionCorner(x, y, widget);
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
						type: BOARD_ACTION_TYPE.SELECT_WIDGET,
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
							type: BOARD_ACTION_TYPE.RESIZE_WIDGET,
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
