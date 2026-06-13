import type { Ref, PointerEventHandler } from 'react';

type Props = {
	ref: Ref<HTMLCanvasElement>;
	width: number;
	height: number;
	dpr: number;
	onPointerDown: PointerEventHandler<HTMLCanvasElement>;
	onPointerMove: PointerEventHandler<HTMLCanvasElement>;
	onPointerUp: PointerEventHandler<HTMLCanvasElement>;
};

export function Canvas({
	ref,
	width,
	height,
	dpr,
	onPointerDown,
	onPointerMove,
	onPointerUp,
}: Props) {
	return (
		<canvas
			ref={ref}
			width={width * dpr}
			height={height * dpr}
			style={{
				display: 'block',
				width: `${width}px`,
				height: `${height}px`,
			}}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
		/>
	);
}
