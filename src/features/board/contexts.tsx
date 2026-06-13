import { createContext, useContext } from 'react';

import { BOARD_INITIAL_STATE, type BoardState } from './reducers';
import type { BoardActionDispatch } from './actions';

const defaultDispatch: BoardActionDispatch = () => {};

export const BoardContext = createContext<[BoardState, BoardActionDispatch]>([
	BOARD_INITIAL_STATE,
	defaultDispatch,
]);

export function useBoardState() {
	return useContext(BoardContext);
}
