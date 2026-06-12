import { useRef } from 'react';

import type { Widget } from '../entities/widgets/Widget';

export const useMoveWidget = (onMoving: (x: number, y: number) => void) => {
	const deltaXRef = useRef(0);
	const deltaYRef = useRef(0);

	const onWidgetMoveStart = (widget: Widget, x: number, y: number) => {
		deltaXRef.current = widget.x - x;
		deltaYRef.current = widget.y - y;
	};

	const onWidgetMoving = (x: number, y: number) => {
		onMoving(x + deltaXRef.current, y + deltaYRef.current);
	};

	const onWidgetMoveEnd = () => {
		deltaXRef.current = 0;
		deltaYRef.current = 0;
	};

	return {
		onWidgetMoveStart,
		onWidgetMoving,
		onWidgetMoveEnd,
	};
};
