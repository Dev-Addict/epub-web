import React, {FunctionComponent, useEffect} from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {useTextSelection} from 'use-text-selection';
import ReactHtmlParser, {Transform} from 'react-html-parser';
import {Popover} from 'react-text-selection-popover';
import styled, {css} from 'styled-components';

import {BackHome, ChapterController, ChaptersMenu, Page, SelectStyle} from '../components';
import {RootState} from '../store';
import {Color} from '../store/settings/types';
import {useWindowSize} from '../hooks';

const Container = styled.div`
  width: 100vw;
`;

const SelectStyleContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  transition: all 336ms;
  z-index: 2;
`;

const BackHomeContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  transition: all 336ms;
  z-index: 2;
`;

const ChaptersMenuContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transition: all 336ms;
  transform: translateX(-50%);
  z-index: 2;
`;

const ContentContainer = styled.div`
`;

interface ContentProps {
	color: Color;
	fontSize: number;
}

const Content = styled.div<ContentProps>`
  width: 800px;
  margin: auto;
  padding: 80px 20px 160px 20px;

  & html > body * {
    color: ${({color}) => color} !important;
    font-size: ${({fontSize}) => 1 + fontSize / 10}em !important;
  }

  @media only screen and (max-width: 1000px) {
    width: 100%;
  }
`;

interface TextSelectionPopoverProps {
	left: number;
	width: number;
	top: number;
	shadow: boolean;
	background: Color;
}

const TextSelectionPopover = styled.div<TextSelectionPopoverProps>`
  position: absolute;
  left: ${({left, width}) => left + width / 2}px;
  top: ${({top}) => top - 50}px;
  margin-left: -35px;
  width: 70px;
  height: 40px;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  background: ${({background}) => background};

  ${({shadow}) => shadow && css`
    box-shadow: 0 10px 30px 0 #00000029;
  `}
`;

interface HighlightButtonProps {
	color: Color;
	background: Color;
}

const HighlightButton = styled.div<HighlightButtonProps>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${({color}) => color};
  position: relative;

  & > div {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    border: 3px solid ${({color}) => color};
    transform: translate(-50%, -50%);
    transition: all 336ms;
  }

  &:hover {
    & > div {
      border-color: ${({background}) => background};
    }
  }
`;

const renderTextSelection = (shadow: boolean, background: Color, onHighlightClick: (className: string, range: Range) => void): FunctionComponent<ReturnType<typeof useTextSelection>> => (
	{
		clientRect,
		isCollapsed,
	},
) => {
	if (!clientRect || isCollapsed) return null;

	const onHighlightButtonClick = (className: string) => () => {
		const range = window.getSelection()!.getRangeAt(0);

		onHighlightClick(className, range);
	};

	return (
		<TextSelectionPopover left={clientRect?.left || 0} top={clientRect?.top || 0} width={clientRect?.width || 0}
													shadow={shadow} background={background}>
			<HighlightButton color={Color.CORNSILK} background={background} onClick={onHighlightButtonClick('color_1')}>
				<div />
			</HighlightButton>
			<HighlightButton color={Color.TURQUOISE} background={background} onClick={onHighlightButtonClick('color_1')}>
				<div />
			</HighlightButton>
		</TextSelectionPopover>
	);
};

interface Highlight {
	range: Range;
	className: string;
}

export const Reader = () => {
	const history = useHistory();

	const {
		book: {data, currentChapter},
		settings: {theme: {foreground, secondaryBackground, shadow}, fontSize},
	} = useSelector((state: RootState) => state);

	const [isLoading, setLoading] = useState(false);
	const [html, setHtml] = useState('');
	const [highlights, setHighlights] = useState<Highlight[]>([]);

	useEffect(() => {
		if (!data)
			history.push('/');
	}, [data, history]);

	useEffect(() => {
		setLoading(true);
		if (data) {
			const currentChapterId = data.content.chapters[currentChapter].idref;

			const chapter = data.content.items.find(({id}) => id === currentChapterId);

			if (!chapter)
				return;

			data.result.file(chapter.href)?.async('string')?.then(data => {
				setHtml(data);
				setLoading(false);
			});
		}
	}, [currentChapter, data]);

	useEffect(() => {
		highlights.forEach(({range, className}) => {
			const span = document.createElement('span');

			span.className = `highlight ${className}`;
			span.appendChild(range.extractContents());
			range.insertNode(span);
		});
	});

	const transformImage: Transform = (node) => {
		if (node.name === 'img') return <></>;
	};

	const onHighlightClick = () => (className: string, range: Range) => {
		setHighlights(highlights => [...highlights, {
			range,
			className,
		}]);
	};

	return (
		<Page>
			<BackHomeContainer>
				<BackHome />
			</BackHomeContainer>
			<SelectStyleContainer>
				<SelectStyle />
			</SelectStyleContainer>
			<ChaptersMenuContainer>
				<ChaptersMenu />
			</ChaptersMenuContainer>
			<ChapterController />
			<Container>
				{
					isLoading ?
						<></> :
						<ContentContainer>
							<Content color={foreground} fontSize={fontSize}>
								<Popover render={renderTextSelection(shadow, secondaryBackground, onHighlightClick())} />
								{ReactHtmlParser(html, {
									transform: transformImage,
								})}
							</Content>
						</ContentContainer>
				}
			</Container>
		</Page>
	);
};
