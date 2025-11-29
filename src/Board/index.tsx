import { useState } from 'react';

import { Canvas } from '../Canvas';
import { Tools } from '../Tools';
import type { Widget } from '../entities/widgets/Widget';
import { Rectangle } from '../entities/widgets/Rectangle';
import { Circle } from '../entities/widgets/Circle';
import { Style } from '../entities/styles/Style';
import { useWindowSize } from './useWindowSize';
import { useDevicePixelRatio } from './useDevicePixelRatio';

const style = new Style().fill('#ffffff').stroke('#000000', 1);

export const Board = () => {
	const { width, height } = useWindowSize();
	const dpr = useDevicePixelRatio();

	const [viewportX, setViewportX] = useState(0);
	const [viewportY, setViewportY] = useState(0);

	const [widgets, setWidgets] = useState<Record<string, Widget>>(() => ({}));

	const addRectangle = () => {
		const rect = new Rectangle(
			-50 - viewportX,
			25 - viewportY,
			100,
			50,
			style,
		);
		setWidgets((prev) => ({ ...prev, [rect.id]: rect }));
	};

	const addCircle = () => {
		const circle = new Circle(-50 - viewportX, 50 - viewportY, 50, style);
		setWidgets((prev) => ({ ...prev, [circle.id]: circle }));
	};

	const [movingWidgetId, setMovingWidgetId] = useState<string | null>(null);
	const [movingCursorX, setMovingCursorX] = useState(0);
	const [movingCursorY, setMovingCursorY] = useState(0);

	const [deltaX, setDeltaX] = useState(0);
	const [deltaY, setDeltaY] = useState(0);

	const onMoveStart = (
		x: number,
		y: number,
		offsetX: number,
		offsetY: number,
	) => {
		for (const id in widgets) {
			if (widgets[id].containsPoint(x, y)) {
				setMovingWidgetId(id);
				setMovingCursorX(widgets[id].x - x);
				setMovingCursorY(widgets[id].y - y);
				break;
			}
		}

		if (!movingWidgetId) {
			setDeltaX(viewportX + Math.floor(width / 2) - offsetX);
			setDeltaY(Math.floor(height / 2) - viewportY - offsetY);
		}
	};

	const onMoving = (
		x: number,
		y: number,
		offsetX: number,
		offsetY: number,
	) => {
		if (!movingWidgetId) {
			setViewportX(offsetX + deltaX - Math.floor(width / 2));
			setViewportY(Math.floor(height / 2) - offsetY - deltaY);
		} else {
			const widget = widgets[movingWidgetId];
			const newWidget = widget.clone();
			newWidget.x = x + movingCursorX;
			newWidget.y = y + movingCursorY;
			setWidgets((prev) => ({
				...prev,
				[newWidget.id]: newWidget,
			}));
		}
	};

	const onMoveEnd = () => {
		setMovingWidgetId(null);
	};

	return (
		<>
			<Tools onRectangle={addRectangle} onCircle={addCircle} />
			<Canvas
				widgets={widgets}
				width={width}
				height={height}
				viewportX={viewportX}
				viewportY={viewportY}
				dpr={dpr}
				onMoveStart={onMoveStart}
				onMoving={onMoving}
				onMoveEnd={onMoveEnd}
			/>
		</>
	);
};
