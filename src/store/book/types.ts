import {BookData, TocItem} from '../../utils';

export interface BookState {
	data?: BookData;
	currentChapter: number;
	toc: TocItem[];
}

export const SET_DATA = 'BOOK-SET_DATA';
export const SET_CURRENT_CHAPTER = 'BOOK-SET_CURRENT_CHAPTER';
export const SET_TOC = 'BOOK-SET_TOC';

interface SetData {
	type: typeof SET_DATA;
	payload?: BookData;
}

interface SetCurrentChapter {
	type: typeof SET_CURRENT_CHAPTER;
	payload: number;
}

interface SetToc {
	type: typeof SET_TOC;
	payload: TocItem[];
}

export type BookActionTypes = SetData | SetCurrentChapter | SetToc;
