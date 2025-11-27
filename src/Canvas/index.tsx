import { useState, useEffect } from 'react';

import { CanvasRenderer } from '../entities/renderers/CanvasRenderer';
import type { Widget } from '../entities/widgets/Widget';

type Props = {
	width: number;
	height: number;
	widgets: Record<string, Widget>;
};

export const Canvas = ({ width, height, widgets }: Props) => {
	const [renderer, setRenderer] = useState<CanvasRenderer | null>(null)

	useEffect(() => {
		if (!renderer) return;
		renderer.setWidth(width)
		renderer.setHeight(height);
	}, [renderer, width, height])

	const onRef = (el: HTMLCanvasElement | null) => {
		if (!el) return;
		const ctx = el.getContext('2d');
		if (!ctx) return;
		setRenderer(new CanvasRenderer(ctx, width, height))
	}

	if (renderer) {
		for (const id in widgets) {
			widgets[id].accept(renderer)
		}
	}

	return (
		<canvas
			ref={onRef}
			width={width}
			height={height}
			style={{ display: 'block' }}
		/>
	);
};
