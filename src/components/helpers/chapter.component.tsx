import {useSelector} from 'react-redux';
import ReactHtmlParser, {
	convertNodeToElement,
	Transform,
} from 'react-html-parser';
import styled, {css} from 'styled-components';

import {useChapterData, useWindowSize} from '../../hooks';
import {Color} from '../../store/settings/types';
import {RootState} from '../../store';

interface ContentContainerProps {
	background: Color;
	color: Color;
	fontSize: number;
	width: number;
	rtl?: boolean;
}

const ContentContainer = styled.div<ContentContainerProps>`
  background: ${({background}) => background};
  transition: all 336ms;
  color: ${({color}) => color};
  font-size: ${({fontSize}) => 1 + fontSize / 10}em;
  padding: ${({width}) => {
    const side = width > 1000 ? (width - 800) / 2 : 20;

    return `80px ${side}px 160px ${side}px`;
  }};
  direction: ltr;

  ${({rtl}) => rtl && css`
    direction: rtl;
  `}
`;

const transform: Transform = (node, index) => {
	const removeNodes = [
		'img',
		'header',
	];
	const turnNodes = [
		'html',
		'body',
	];

	if (removeNodes.includes(node.name)) return null;
	if (turnNodes.includes(node.name)) {
		node.name = 'div';
		return convertNodeToElement(node, index, transform);
	}
};

export const Chapter = () => {
	const {
		settings: {theme: {foreground, background}, fontSize},
	} = useSelector((state: RootState) => state);

	const {width} = useWindowSize();
	const {isLoading, html} = useChapterData();

	return (
		<ContentContainer fontSize={fontSize} color={foreground} background={background} width={width}
											rtl={/[\u0591-\u07FF]/.test(html)}>
			{
				isLoading ?
					'Loading...' :
					ReactHtmlParser(html, {
						transform,
					})
			}
		</ContentContainer>
	);
};
