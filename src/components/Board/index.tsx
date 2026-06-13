import { useRef, useEffect, useReducer, type PointerEvent } from 'react';

import { Canvas } from '../Canvas';
import { Tools } from '../Tools';
import { Rectangle, Circle } from '../../entities/widgets';
import { Style } from '../../entities/styles/Style';
import { CanvasRenderer } from '../../entities/renderers/CanvasRenderer';
import {
	useWindowSize,
	useDevicePixelRatio,
	useResizeWidgets,
	useViewportPointerEvents,
	useWidgetsPointerEvents,
} from '../../hooks';
import {
	boardReducer,
	BOARD_INITIAL_STATE,
} from '../../features/board/reducers';
import { BOARD_ACTION_TYPE } from '../../features/board/actions';

const style = new Style().fill('#ffffff').stroke('#000000', 1);

export const Board = () => {
	const rendererRef = useRef<CanvasRenderer>(null);

	const [{ viewportX, viewportY, widgets, selectedWidgetIds }, dispatch] =
		useReducer(boardReducer, BOARD_INITIAL_STATE);

	const { width, height } = useWindowSize();
	const dpr = useDevicePixelRatio();

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
	}, [viewportX, viewportY, width, height, dpr, widgets, selectedWidgetIds]);

	const { onViewportMoveStart, onViewportMoving, onViewportMoveEnd } =
		useViewportPointerEvents(
			(offsetX, offsetY) => {
				dispatch({
					type: BOARD_ACTION_TYPE.MOVE_VIEWPORT,
					payload: { x: offsetX, y: offsetY },
				});
			},
			() => {
				dispatch({
					type: BOARD_ACTION_TYPE.RESET_WIDGET_SELECTION,
				});
			},
		);

	const { onWidgetsMoveStart, onWidgetsMoving, onWidgetsMoveEnd } =
		useWidgetsPointerEvents(
			(coordinates) => {
				dispatch({
					type: BOARD_ACTION_TYPE.MOVE_WIDGETS,
					payload: { coordinates },
				});
			},
			(event, id) => {
				if (event.shiftKey) {
					dispatch({
						type: BOARD_ACTION_TYPE.TOGGLE_WIDGET_SELECTION,
						payload: { id },
					});
				} else {
					dispatch({
						type: BOARD_ACTION_TYPE.SELECT_WIDGET,
						payload: { id },
					});
				}
			},
		);

	const { onWidgetResizeStart, onWidgetResizing, onWidgetResizeEnd } =
		useResizeWidgets((coordinates) => {
			dispatch({
				type: BOARD_ACTION_TYPE.RESIZE_WIDGETS,
				payload: { coordinates },
			});
		});

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'Backspace': {
					dispatch({
						type: BOARD_ACTION_TYPE.DELETE_WIDGETS,
						payload: { ids: selectedWidgetIds },
					});
					break;
				}
				case 'Escape': {
					dispatch({
						type: BOARD_ACTION_TYPE.RESET_WIDGET_SELECTION,
					});
					break;
				}
				case 'd': {
					if (
						!selectedWidgetIds.length ||
						(!event.metaKey && !event.ctrlKey)
					)
						break;
					dispatch({
						type: BOARD_ACTION_TYPE.DUPLICATE_WIDGETS,
						payload: { ids: selectedWidgetIds },
					});
					break;
				}
			}
		};
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [selectedWidgetIds, widgets]);

	function getCenteredCoordinates(
		offsetX: number,
		offsetY: number,
	): [number, number] {
		return [
			offsetX - (Math.floor(width / 2) + viewportX),
			Math.floor(height / 2) - viewportY - offsetY,
		];
	}

	function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
		const [x, y] = getCenteredCoordinates(
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
		);

		for (const widgetId of selectedWidgetIds) {
			const widget = widgets[widgetId];

			const widgetSelectionCorner =
				rendererRef.current?.getSelectionCorner(x, y, widget) ?? null;

			// pointer is down on widget selection corner
			if (widgetSelectionCorner !== null) {
				onWidgetResizeStart(
					selectedWidgetIds,
					widgets,
					widgetSelectionCorner,
					x,
					y,
				);
				return;
			}
		}

		for (const widget of Object.values(widgets)) {
			// pointer is down on widget
			if (widget.containsPoint(x, y)) {
				onWidgetsMoveStart(selectedWidgetIds, widgets, x, y, widget.id);
				return;
			}
		}

		// pointer is down on grid
		onViewportMoveStart(
			viewportX,
			viewportY,
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
		);
	}

	function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
		const [x, y] = getCenteredCoordinates(
			event.nativeEvent.offsetX,
			event.nativeEvent.offsetY,
		);

		onViewportMoving(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
		onWidgetsMoving(x, y);
		onWidgetResizing(x, y);
	}

	function handlePointerUp(event: PointerEvent<HTMLCanvasElement>) {
		onViewportMoveEnd();
		onWidgetsMoveEnd(event);
		onWidgetResizeEnd();
	}

	function handleAddRectangle() {
		const rect = new Rectangle(
			-50 - viewportX,
			25 - viewportY,
			100,
			50,
			style,
		);
		dispatch({
			type: BOARD_ACTION_TYPE.ADD_WIDGET,
			payload: { widget: rect },
		});
	}

	function handleAddCircle() {
		const circle = new Circle(-50 - viewportX, 50 - viewportY, 50, style);
		dispatch({
			type: BOARD_ACTION_TYPE.ADD_WIDGET,
			payload: { widget: circle },
		});
	}

	function setRef(el: HTMLCanvasElement | null) {
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
	}

	return (
		<>
			<Tools
				onRectangle={handleAddRectangle}
				onCircle={handleAddCircle}
			/>
			<Canvas
				ref={setRef}
				width={width}
				height={height}
				dpr={dpr}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
			/>
		</>
	);
};
