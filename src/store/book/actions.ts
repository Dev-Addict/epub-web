import {BookData} from '../../utils';
import {BookActionTypes, SET_CHAPTERS_NAMES, SET_CURRENT_CHAPTER, SET_DATA} from './types';

export const setData = (data?: BookData): BookActionTypes => ({
	type: SET_DATA,
	payload: data,
});

export const setCurrentChapter = (currentChapter: number): BookActionTypes => ({
	type: SET_CURRENT_CHAPTER,
	payload: currentChapter,
});

export const setChaptersNames = (chaptersNames: string[]): BookActionTypes => ({
	type: SET_CHAPTERS_NAMES,
	payload: chaptersNames
});
