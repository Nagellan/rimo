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

	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	const [widgets, setWidgets] = useState<Record<string, Widget>>(() => ({}));

	const addRectangle = () => {
		const rect = new Rectangle(-50, 25, 100, 50, style);
		setWidgets((prev) => ({ ...prev, [rect.id]: rect }));
	};

	const addCircle = () => {
		const circle = new Circle(-50, 50, 50, style);
		setWidgets((prev) => ({ ...prev, [circle.id]: circle }));
	};

	const onMove = (
		startX: number,
		startY: number,
		endX: number,
		endY: number,
	) => {
		let widget: Widget | null = null;

		for (const id in widgets) {
			if (widgets[id].containsPoint(startX, startY)) {
				widget = widgets[id];
				break;
			}
		}

		if (widget) {
			const newWidget = widget.clone();
			newWidget.x = endX - (startX - widget.x);
			newWidget.y = endY - (startY - widget.y);
			setWidgets((prev) => ({
				...prev,
				[newWidget.id]: newWidget,
			}));
		} else {
			setX((prev) => prev + endX - startX);
			setY((prev) => prev + endY - startY);
		}
	};

	return (
		<>
			<Tools onRectangle={addRectangle} onCircle={addCircle} />
			<Canvas
				widgets={widgets}
				width={width}
				height={height}
				x={x}
				y={y}
				dpr={dpr}
				onMove={onMove}
			/>
		</>
	);
};
