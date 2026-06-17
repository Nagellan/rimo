export const isInsideCircle = (
	x: number,
	y: number,
	centerX: number,
	centerY: number,
	radius: number,
) => {
	return (x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2;
};

export const isInsideEllipse = (
	x: number,
	y: number,
	centerX: number,
	centerY: number,
	radiusX: number,
	radiusY: number,
) => {
	return (
		(x - centerX) ** 2 / radiusX ** 2 + (y - centerY) ** 2 / radiusY ** 2 <=
		1
	);
};
