import { useState } from 'react';

import type { Widget } from '../../entities/widgets/Widget';

export const useMoveWidget = (onMoving: (x: number, y: number) => void) => {
	const [cursorX, setCursorX] = useState(0);
	const [cursorY, setCursorY] = useState(0);

	const onWidgetMoveStart = (widget: Widget, x: number, y: number) => {
		setCursorX(widget.x - x);
		setCursorY(widget.y - y);
	};

	const onWidgetMoving = (x: number, y: number) => {
		onMoving(x + cursorX, y + cursorY);
	};

	const onWidgetMoveEnd = () => {
		setCursorX(0);
		setCursorY(0);
	};

	return {
		onWidgetMoveStart,
		onWidgetMoving,
		onWidgetMoveEnd,
	};
};
