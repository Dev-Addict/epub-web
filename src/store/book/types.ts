import {BookData} from '../../utils';

export interface BookState {
	data?: BookData;
	currentChapter: number;
	chaptersNames?: string[];
}

export const SET_DATA = 'BOOK-SET_DATA';
export const SET_CURRENT_CHAPTER = 'BOOK-SET_CURRENT_CHAPTER';
export const SET_CHAPTERS_NAMES = 'BOOK-SET_CHAPTERS_NAMES';

interface SetData {
	type: typeof SET_DATA;
	payload?: BookData;
}

interface SetCurrentChapter {
	type: typeof SET_CURRENT_CHAPTER;
	payload: number;
}

interface SetChaptersNames {
	type: typeof SET_CHAPTERS_NAMES;
	payload: string[];
}

export type BookActionTypes = SetData | SetCurrentChapter | SetChaptersNames;
