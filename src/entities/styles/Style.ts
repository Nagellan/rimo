export class Style {
	public fillColor?: string;
	public strokeColor?: string;
	public strokeWidth?: number;
	public strokeLineDash?: number[];
	public shadowColor?: string;
	public shadowBlur?: number;
	public shadowOffsetX?: number;
	public shadowOffsetY?: number;

	public fill(color: string): this {
		this.fillColor = color;

		return this;
	}

	public stroke(color: string, width: number, lineDash: number[] = []): this {
		this.strokeColor = color;
		this.strokeWidth = width;
		this.strokeLineDash = lineDash;

		return this;
	}

	public shadow(color: string, blur = 0, offsetX = 0, offsetY = 0): this {
		this.shadowColor = color;
		this.shadowBlur = blur;
		this.shadowOffsetX = offsetX;
		this.shadowOffsetY = offsetY;

		return this;
	}

	public clone(): Style {
		const newStyle = new Style();
		if (this.fillColor) {
			newStyle.fill(this.fillColor);
		}
		if (this.strokeColor && this.strokeWidth && this.strokeLineDash) {
			newStyle.stroke(
				this.strokeColor,
				this.strokeWidth,
				this.strokeLineDash,
			);
		}
		if (
			this.shadowColor &&
			this.shadowBlur &&
			this.shadowOffsetX &&
			this.shadowOffsetY
		) {
			newStyle.shadow(
				this.shadowColor,
				this.shadowBlur,
				this.shadowOffsetX,
				this.shadowOffsetY,
			);
		}
		return newStyle;
	}
}
