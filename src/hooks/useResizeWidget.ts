import { useRef, useState } from 'react';

import type { Widget } from '../entities/widgets/Widget';

export type ResizeCorner =
	| 'top-left'
	| 'top-right'
	| 'bottom-right'
	| 'bottom-left';

export const useResizeWidget = (
	onResizing: (x: number, y: number, width: number, height: number) => void,
) => {
	const [selectionCorner, setSelectionCorner] =
		useState<ResizeCorner | null>(null);
	const initialWidgetRef = useRef<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);
	const startXRef = useRef(0);
	const startYRef = useRef(0);

	const onWidgetResizeStart = (
		widget: Widget,
		corner: ResizeCorner,
		x: number,
		y: number,
	) => {
		setSelectionCorner(corner);
		initialWidgetRef.current = {
			x: widget.x,
			y: widget.y,
			width: widget.width,
			height: widget.height,
		};
		startXRef.current = x;
		startYRef.current = y;
	};

	const onWidgetResizing = (x: number, y: number) => {
		const initialWidget = initialWidgetRef.current;
		if (!initialWidget || !selectionCorner) return;

		let newX = initialWidget.x;
		let newY = initialWidget.y;
		let newWidth = initialWidget.width;
		let newHeight = initialWidget.height;

		switch (selectionCorner) {
			case 'top-left':
				newX = initialWidget.x + x - startXRef.current;
				newY = initialWidget.y + y - startYRef.current;
				newWidth = initialWidget.width - x + startXRef.current;
				newHeight = initialWidget.height - startYRef.current + y;
				break;
			case 'top-right':
				newY = initialWidget.y + y - startYRef.current;
				newWidth = initialWidget.width + x - startXRef.current;
				newHeight = initialWidget.height - startYRef.current + y;
				break;
			case 'bottom-right':
				newWidth = initialWidget.width + x - startXRef.current;
				newHeight = initialWidget.height + startYRef.current - y;
				break;
			case 'bottom-left':
				newX = initialWidget.x + x - startXRef.current;
				newWidth = initialWidget.width - x + startXRef.current;
				newHeight = initialWidget.height + startYRef.current - y;
				break;
		}

		if (newHeight < 40 || newWidth < 40) return;

		onResizing(newX, newY, newWidth, newHeight);
	};

	const onWidgetResizeEnd = () => {
		setSelectionCorner(null);
		initialWidgetRef.current = null;
		startXRef.current = 0;
		startYRef.current = 0;
	};

	return {
		selectionCorner,
		onWidgetResizeStart,
		onWidgetResizing,
		onWidgetResizeEnd,
	};
};
