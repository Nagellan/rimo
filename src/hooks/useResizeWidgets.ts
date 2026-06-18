import { useRef } from 'react';

import type { Widget } from '../entities/widgets/Widget';
import type { BoundingBox } from '../features/board/types';

export type ResizeCorner =
	| 'top-left'
	| 'top-right'
	| 'bottom-right'
	| 'bottom-left';

type BoundingBoxes = Record<string, BoundingBox>;

function getBoundingBox(boundingBoxes: BoundingBoxes) {
	let top = -Infinity;
	let right = -Infinity;
	let bottom = Infinity;
	let left = Infinity;

	for (const id in boundingBoxes) {
		const { x, y, width, height } = boundingBoxes[id];

		top = Math.max(top, y);
		right = Math.max(right, x + width);
		bottom = Math.min(bottom, y - height);
		left = Math.min(left, x);
	}

	return { top, right, bottom, left };
}

export function useResizeWidgets(
	onResizing: (boundingBoxes: BoundingBoxes) => void,
) {
	const resizingStarted = useRef(false);
	const cornerRef = useRef<ResizeCorner>(null);
	const initialBoundingBoxesRef = useRef<BoundingBoxes>({});
	const startXRef = useRef(0);
	const startYRef = useRef(0);

	const onWidgetResizeStart = (
		selectedWidgets: Widget[],
		corner: ResizeCorner,
		x: number,
		y: number,
	) => {
		resizingStarted.current = true;
		cornerRef.current = corner;
		const boundingBoxes: BoundingBoxes = {};
		for (const widget of selectedWidgets) {
			boundingBoxes[widget.id] = {
				x: widget.x,
				y: widget.y,
				width: widget.width,
				height: widget.height,
			};
		}
		initialBoundingBoxesRef.current = boundingBoxes;
		startXRef.current = x;
		startYRef.current = y;
	};

	const onWidgetResizing = (x: number, y: number) => {
		if (!resizingStarted.current) return;

		const initialBoundingBoxes = initialBoundingBoxesRef.current;
		const corner = cornerRef.current;

		const dx = x - startXRef.current;
		const dy = y - startYRef.current;

		const bbox = getBoundingBox(initialBoundingBoxes);
		const newBbox = { ...bbox };

		// Top edge moves with corner that has "top", bottom edge moves with "bottom"
		// Both just add dy directly since cursor y and widget y are in the same space
		if (corner === 'top-left' || corner === 'top-right')
			newBbox.top = bbox.top + dy;
		if (corner === 'bottom-left' || corner === 'bottom-right')
			newBbox.bottom = bbox.bottom + dy;
		if (corner === 'top-left' || corner === 'bottom-left')
			newBbox.left = bbox.left + dx;
		if (corner === 'top-right' || corner === 'bottom-right')
			newBbox.right = bbox.right + dx;

		// Normalize: in Y-up space top > bottom, so flip if top drops below bottom
		if (newBbox.left > newBbox.right)
			[newBbox.left, newBbox.right] = [newBbox.right, newBbox.left];
		if (newBbox.bottom > newBbox.top)
			[newBbox.bottom, newBbox.top] = [newBbox.top, newBbox.bottom];

		const oldW = bbox.right - bbox.left;
		const oldH = bbox.top - bbox.bottom; // positive because top > bottom in Y-up
		const newW = newBbox.right - newBbox.left;
		const newH = newBbox.top - newBbox.bottom;

		const scaleX = oldW === 0 ? 1 : newW / oldW;
		const scaleY = oldH === 0 ? 1 : newH / oldH;

		const boundingBoxes: BoundingBoxes = {};
		for (const id in initialBoundingBoxes) {
			const { x, y, width, height } = initialBoundingBoxes[id];
			const relX = x - bbox.left;
			const relY = bbox.top - y; // distance from bounding top, always positive
			boundingBoxes[id] = {
				x: newBbox.left + relX * scaleX,
				y: newBbox.top - relY * scaleY, // place from new top, going down
				width: width * scaleX,
				height: height * scaleY,
			};
		}
		onResizing(boundingBoxes);
	};

	const onWidgetResizeEnd = () => {
		resizingStarted.current = false;
		cornerRef.current = null;
		initialBoundingBoxesRef.current = {};
		startXRef.current = 0;
		startYRef.current = 0;
	};

	return { onWidgetResizeStart, onWidgetResizing, onWidgetResizeEnd };
}
