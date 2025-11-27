type EntityId = string;

type RectangleEntity = {
	id: EntityId;
	type: 'rectangle';
	payload: {
		x: number;
		y: number;
		width: number;
		height: number;
		color?: string;
	};
};

type CircleEntity = {
	id: EntityId;
	type: 'circle';
	payload: {
		x: number;
		y: number;
		radius: number;
		color?: string;
	};
};

export type Entity = RectangleEntity | CircleEntity;

export type Entities = Record<EntityId, Entity>;
