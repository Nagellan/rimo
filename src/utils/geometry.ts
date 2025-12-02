export const isInsideCircle = (
	x: number,
	y: number,
	centerX: number,
	centerY: number,
	radius: number,
) => {
	return (x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2;
};
