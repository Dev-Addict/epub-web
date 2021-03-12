import {BookActionTypes, BookState, SET_CHAPTERS_NAMES, SET_CURRENT_CHAPTER, SET_DATA} from './types';

const initialState: BookState = {
	data: undefined,
	currentChapter: 0,
	chaptersNames: undefined,
};

export const bookReducer = (
	state = initialState,
	action: BookActionTypes,
): BookState => {
	switch (action.type) {
		case SET_DATA:
			return {...state, data: action.payload};
		case SET_CURRENT_CHAPTER:
			return {...state, currentChapter: action.payload};
		case SET_CHAPTERS_NAMES:
			return {...state, chaptersNames: action.payload};
		default:
			return state;
	}
};
