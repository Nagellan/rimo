import { useState, useEffect } from 'react';

import { Canvas } from '../Canvas';
import { Tools } from '../Tools';
import type { Widget } from '../../entities/widgets/Widget';
import { Rectangle } from '../../entities/widgets/Rectangle';
import { Circle } from '../../entities/widgets/Circle';
import { Style } from '../../entities/styles/Style';
import type { Dispatch } from '../../types/events';
import { EVENT } from '../../constants/events';
import { useWindowSize } from './useWindowSize';
import { useDevicePixelRatio } from './useDevicePixelRatio';

const style = new Style().fill('#ffffff').stroke('#000000', 1);

export const Board = () => {
	const { width, height } = useWindowSize();
	const dpr = useDevicePixelRatio();

	const [viewportX, setViewportX] = useState(0);
	const [viewportY, setViewportY] = useState(0);

	const [widgets, setWidgets] = useState<Record<string, Widget>>({});
	const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>([]);

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

	const dispatch: Dispatch = (event) => {
		switch (event.type) {
			case EVENT.MOVE_VIEWPORT: {
				const { x, y } = event.payload;
				setViewportX(x);
				setViewportY(y);
				break;
			}
			case EVENT.MOVE_WIDGET: {
				const { id, x, y } = event.payload;
				const widget = widgets[id];
				const newWidget = widget.clone();
				newWidget.reposition(x, y);
				setWidgets((prev) => ({
					...prev,
					[newWidget.id]: newWidget,
				}));
				break;
			}
			case EVENT.SELECT_WIDGET: {
				const { id, add } = event.payload;
				if (id === null) {
					setSelectedWidgetIds([]);
				} else {
					if (add) {
						setSelectedWidgetIds((prev) => {
							if (prev.includes(id))
								return prev.filter((_id) => _id !== id);
							return [...prev, id];
						});
					} else {
						setSelectedWidgetIds([id]);
					}
				}
				break;
			}
			case EVENT.RESIZE_WIDGET: {
				const { id, x, y, width, height } = event.payload;
				const widget = widgets[id];
				const newWidget = widget.clone();
				newWidget.reposition(x, y);
				newWidget.resize(width, height);
				setWidgets((prev) => ({
					...prev,
					[newWidget.id]: newWidget,
				}));
				break;
			}
			default: {
				throw new Error('Unknown event type!');
			}
		}
	};

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'Backspace': {
					setSelectedWidgetIds([]);
					setWidgets((prev) => {
						const next = { ...prev };
						for (const id of selectedWidgetIds) {
							delete next[id];
						}
						return next;
					});
					break;
				}
				case 'Escape': {
					setSelectedWidgetIds([]);
					break;
				}
				case 'd': {
					if (
						!selectedWidgetIds.length ||
						(!event.metaKey && !event.ctrlKey)
					)
						break;
					const newWidgets = selectedWidgetIds.map((id) => {
						const newWidget = widgets[id].duplicate();
						newWidget.reposition(
							newWidget.x + newWidget.width + 20,
							newWidget.y,
						);
						return newWidget;
					});
					setWidgets((prev) => {
						const next = { ...prev };
						for (const widget of newWidgets) {
							next[widget.id] = widget;
						}
						return next;
					});
					setSelectedWidgetIds(newWidgets.map((widget) => widget.id));
					break;
				}
			}
		};
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [selectedWidgetIds, widgets]);

	return (
		<>
			<Tools onRectangle={addRectangle} onCircle={addCircle} />
			<Canvas
				widgets={widgets}
				selectedWidgetIds={selectedWidgetIds}
				width={width}
				height={height}
				viewportX={viewportX}
				viewportY={viewportY}
				dpr={dpr}
				dispatch={dispatch}
			/>
		</>
	);
};
