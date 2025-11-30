import { useState } from 'react';

export const useMoveViewport = (
	viewportX: number,
	viewportY: number,
	width: number,
	height: number,
	onMoving: (offsetX: number, offsetY: number) => void,
) => {
	const [deltaX, setDeltaX] = useState(0);
	const [deltaY, setDeltaY] = useState(0);

	const onViewportMoveStart = (offsetX: number, offsetY: number) => {
		setDeltaX(viewportX + Math.floor(width / 2) - offsetX);
		setDeltaY(Math.floor(height / 2) - viewportY - offsetY);
	};

	const onViewportMoving = (offsetX: number, offsetY: number) => {
		onMoving(
			offsetX + deltaX - Math.floor(width / 2),
			Math.floor(height / 2) - offsetY - deltaY,
		);
	};

	const onViewportMoveEnd = () => {
		setDeltaX(0);
		setDeltaY(0);
	};

	return {
		onViewportMoveStart,
		onViewportMoving,
		onViewportMoveEnd,
	};
};
