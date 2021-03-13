import {BookData, TocItem} from '../../utils';
import {BookActionTypes, SET_CURRENT_CHAPTER, SET_DATA, SET_TOC} from './types';

export const setData = (data?: BookData): BookActionTypes => ({
	type: SET_DATA,
	payload: data,
});

export const setCurrentChapter = (currentChapter: number): BookActionTypes => ({
	type: SET_CURRENT_CHAPTER,
	payload: currentChapter,
});

export const setToc = (toc: TocItem[]): BookActionTypes => ({
	type: SET_TOC,
	payload: toc
});
