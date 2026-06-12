import { useRef } from 'react';

export const useMoveViewport = (
	viewportX: number,
	viewportY: number,
	width: number,
	height: number,
	onMoving: (offsetX: number, offsetY: number) => void,
) => {
	const deltaXRef = useRef(0);
	const deltaYRef = useRef(0);

	const onViewportMoveStart = (offsetX: number, offsetY: number) => {
		deltaXRef.current = viewportX + Math.floor(width / 2) - offsetX;
		deltaYRef.current = Math.floor(height / 2) - viewportY - offsetY;
	};

	const onViewportMoving = (offsetX: number, offsetY: number) => {
		onMoving(
			offsetX + deltaXRef.current - Math.floor(width / 2),
			Math.floor(height / 2) - offsetY - deltaYRef.current,
		);
	};

	const onViewportMoveEnd = () => {
		deltaXRef.current = 0;
		deltaYRef.current = 0;
	};

	return {
		onViewportMoveStart,
		onViewportMoving,
		onViewportMoveEnd,
	};
};
