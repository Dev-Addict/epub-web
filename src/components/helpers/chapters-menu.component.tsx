import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled, {css} from 'styled-components';

import {Color, FontFamily} from '../../store/settings/types';
import {RootState} from '../../store';
import {Close, Menu} from '../../assets';
import {useWindowSize} from '../../hooks';
import {setCurrentChapter} from '../../store/book/actions';

const Container = styled.div`
  width: 100vw;
`;

interface OpenButtonProps {
	shadow: boolean;
	background: Color;
}

const OpenButton = styled.div<OpenButtonProps>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: all 336ms;
  background: ${({background}) => background};
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);

  &:hover {
    opacity: 0.7;
    transform: scale(1.05) translateX(-50%);
  }

  ${({shadow}) => shadow && css`
    box-shadow: 0 3px 20px 0 #00000029;
  `}
`;

interface PanelProps {
	background: Color;
	color: Color;
	shadow: boolean;
	active: boolean;
	height: number;
}

const Panel = styled.div<PanelProps>`
  width: 100vw;
  position: fixed;
  top: -20px;
  background: ${({background}) => background};
  transition: all 336ms;
  left: ${({active}) => active ? '0' : '-100vw'};
  color: ${({color}) => color};
  z-index: 3;
  height: ${({height}) => height}px;
  overflow-y: auto;

  ${({shadow}) => shadow && css`
    box-shadow: 0 10px 30px 0 #00000029;
  `}
`;

interface CloseControllerContainerProps {
	color: Color;
}

const CloseControllerContainer = styled.div<CloseControllerContainerProps>`
  padding: 20px;
  text-align: center;
  transition: all 336ms;
  border-bottom: 2px solid ${({color}) => color};

  &:hover {
    opacity: 0.7;
  }
`;

interface ChapterControllerProps {
	fontFamily: FontFamily;
	color: Color;
	borderColor: Color;
	selected: boolean;
}

const ChapterContainer = styled.div<ChapterControllerProps>`
  padding: 20px;
  text-align: center;
  transition: all 336ms;
  font-size: 18px;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
  color: ${({color}) => color};
  border-bottom: 1px solid ${({borderColor}) => borderColor};

  &:hover {
    opacity: 0.7;
    background-color: ${({color}) => color}22;
  }

  ${({selected, color}) => selected && css`
    background-color: ${color}11;
    opacity: 0.7;
  `}
`;

export const ChaptersMenu = () => {
	const dispatch = useDispatch();
	const {
		book: {data, currentChapter, toc},
		settings: {theme: {secondaryBackground, shadow, foreground, accent}, fontFamily},
	} = useSelector((state: RootState) => state);

	const [isOpen, setOpen] = useState(false);

	const {height} = useWindowSize();

	const onOpenButtonClick = () => () => setOpen(isOpen => !isOpen);
	const onChapterClick = (id: string) => () => {
		const index = data?.content?.chapters?.findIndex(({idref}) => idref === id) || 0;
		dispatch(setCurrentChapter(index));
		setOpen(false);
	};

	const currentChapterData = data?.content?.chapters && data?.content?.chapters[currentChapter];
	const currentChapterId = currentChapterData?.idref;

	const renderChapters = () => toc.map(({label, id}) => (
		<ChapterContainer fontFamily={fontFamily} color={foreground} selected={currentChapterId === id}
											onClick={onChapterClick(id)} borderColor={accent}>
			{label}
		</ChapterContainer>
	));

	return (
		<Container>
			<OpenButton shadow={shadow} background={secondaryBackground} onClick={onOpenButtonClick()}>
				<Menu color={foreground} />
			</OpenButton>
			<Panel background={secondaryBackground} active={isOpen} shadow={shadow} color={foreground} height={height - 80}>
				<CloseControllerContainer onClick={onOpenButtonClick()} color={foreground}>
					<Close color={foreground} />
				</CloseControllerContainer>
				{renderChapters()}
			</Panel>
		</Container>
	);
};
