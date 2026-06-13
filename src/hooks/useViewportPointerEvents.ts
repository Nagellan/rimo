import { useRef } from 'react';

export const useViewportPointerEvents = (
	onMoving: (offsetX: number, offsetY: number) => void,
	onClick: () => void,
) => {
	const movingStartedRef = useRef(false);
	const movedRef = useRef(false);
	const initialViewportXRef = useRef(0);
	const initialViewportYRef = useRef(0);
	const initialOffsetXRef = useRef(0);
	const initialOffsetYRef = useRef(0);

	const onViewportMoveStart = (
		viewportX: number,
		viewportY: number,
		offsetX: number,
		offsetY: number,
	) => {
		movingStartedRef.current = true;
		movedRef.current = false;
		initialViewportXRef.current = viewportX;
		initialViewportYRef.current = viewportY;
		initialOffsetXRef.current = offsetX;
		initialOffsetYRef.current = offsetY;
	};

	const onViewportMoving = (offsetX: number, offsetY: number) => {
		if (!movingStartedRef.current) return;
		movedRef.current = true;
		onMoving(
			initialViewportXRef.current + offsetX - initialOffsetXRef.current,
			initialViewportYRef.current - offsetY + initialOffsetYRef.current,
		);
	};

	const onViewportMoveEnd = () => {
		if (movingStartedRef.current && !movedRef.current) {
			onClick();
		}

		movingStartedRef.current = false;
		movedRef.current = false;
		initialViewportXRef.current = 0;
		initialViewportYRef.current = 0;
		initialOffsetXRef.current = 0;
		initialOffsetYRef.current = 0;
	};

	return {
		onViewportMoveStart,
		onViewportMoving,
		onViewportMoveEnd,
	};
};
