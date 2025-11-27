export class Style {
	public fillColor?: string;
	public strokeColor?: string;
	public strokeWidth?: number;
	public shadowColor?: string;
	public shadowBlur?: number;
	public shadowOffsetX?: number;
	public shadowOffsetY?: number;

	public fill(color: string): this {
		this.fillColor = color;

		return this;
	}

	public stroke(color: string, width = 1): this {
		this.strokeColor = color;
		this.strokeWidth = width;

		return this;
	}

	public shadow(color: string, blur = 0, offsetX = 0, offsetY = 0): this {
		this.shadowColor = color;
		this.shadowBlur = blur;
		this.shadowOffsetX = offsetX;
		this.shadowOffsetY = offsetY;

		return this;
	}
}
