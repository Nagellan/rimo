import { useRef, type PointerEvent } from 'react';

const CLICK_THRESHOLD = 3;

export function useSelectPointerEvents(
	onSelecting: (
		event: PointerEvent<HTMLCanvasElement>,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
	) => void,
	onSelected: () => void,
	onClick: (event: PointerEvent<HTMLCanvasElement>) => void,
) {
	const selectingStartedRef = useRef(false);
	const selectedRef = useRef(false);
	const initialXRef = useRef(0);
	const initialYRef = useRef(0);

	const onSelectionStart = (x: number, y: number) => {
		selectingStartedRef.current = true;
		initialXRef.current = x;
		initialYRef.current = y;
	};

	const onSelectionMoving = (
		event: PointerEvent<HTMLCanvasElement>,
		x: number,
		y: number,
	) => {
		if (!selectingStartedRef.current) return;

		const dx = x - initialXRef.current;
		const dy = y - initialYRef.current;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < CLICK_THRESHOLD) return;

		selectedRef.current = true;
		onSelecting(event, initialXRef.current, initialYRef.current, x, y);
	};

	const onSelectionEnd = (event: PointerEvent<HTMLCanvasElement>) => {
		if (selectingStartedRef.current && !selectedRef.current) {
			onClick(event);
		}

		onSelected();

		selectingStartedRef.current = false;
		selectedRef.current = false;
		initialXRef.current = 0;
		initialYRef.current = 0;
	};

	return {
		onSelectionStart,
		onSelectionMoving,
		onSelectionEnd,
	};
}
