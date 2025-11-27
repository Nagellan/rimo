import { useState } from 'react';
import type { MouseEventHandler } from 'react';

export const useCanvasMove = (
	onMove: (deltaX: number, deltaY: number) => void,
) => {
	const [downX, setDownX] = useState(0);
	const [downY, setDownY] = useState(0);

	const onMouseDown: MouseEventHandler<HTMLCanvasElement> = (event) => {
		setDownX(event.nativeEvent.offsetX);
		setDownY(event.nativeEvent.offsetY);
	};

	const onMouseUp: MouseEventHandler<HTMLCanvasElement> = (event) => {
		onMove(
			event.nativeEvent.offsetX - downX,
			event.nativeEvent.offsetY - downY,
		);
	};

	return {
		onMouseDown,
		onMouseUp,
	};
};
