import JSZip, {JSZipObject, loadAsync} from 'jszip';
import xmlParser from 'fast-xml-parser';

const xmlOptions = {
	parseAttributeValue: true,
	attrNodeName: 'attr',
	textNodeName: '#text',
	ignoreNameSpace: false,
	allowBooleanAttributes: true,
	trimValues: true,
	cdataTagName: '_c',
	cdataPositionChar: '\\c',
	parseTrueNumberOnly: true,
	arrayMode: false,
	attributeNamePrefix: '',
	ignoreAttributes: false,
};

const arrayXmlOptions = {
	...xmlOptions,
	textNodeName: 'text',
	arrayMode: true,
};

export interface Content {
	meta: {
		title?: string;
		author?: string;
		publisher?: string;
	};
	items: {
		href: string;
		id: string;
		'meta-type': string;
	}[];
	chapters: {
		idref: string;
	}[];
}

export interface TocItem {
	href: string;
	label: string;
	id: string;
}

export interface BookData {
	result: JSZip;
	content: Content;
}

export interface EpubData {
	book: BookData;
	toc: TocItem[];
}

const getRootFile = async (file: JSZipObject | null): Promise<string> => {
	if (!file) throw new Error('Invalid Epub file.');
	const content = await file.async('string');

	const data = xmlParser.parse(content, xmlOptions);

	const rootFileData = data?.container?.rootfiles?.rootfile?.attr;

	if (!rootFileData) throw new Error('Invalid Epub file.');

	if (!rootFileData['full-path']) throw new Error('Invalid Epub file.');

	return rootFileData['full-path'];
};

const parseMetadata = (metadata: {[key: string]: any}) => {
	const title = metadata['dc:title'] as string;

	let author = metadata['dc:creator'] as string;
	if (typeof author === 'object') author = author['text'] as string;

	const publisher = metadata['dc:publisher'] as string;

	return {
		title,
		author,
		publisher,
	};
};

const parseContentData = async (contentFile: JSZipObject | null) => {
	if (!contentFile) throw new Error('Invalid Epub file.');

	const contentData = await xmlParser.parse(await contentFile.async('string'), arrayXmlOptions);

	return {
		meta: parseMetadata(contentData.package[0].metadata[0]),
		items: contentData.package[0].manifest[0].item.map(
			({attr}: {attr: string}) => attr,
		),
		chapters: contentData.package[0].spine[0].itemref.map(
			({attr}: {attr: string}) => attr,
		),
	};
};

const parseToc = async (tocFile: JSZipObject | null, {items}: Content) => {
	if (!tocFile)
		return [];

	const result: TocItem[] = [];

	const tocData = await xmlParser.parse(await tocFile.async('string'), arrayXmlOptions);
	const ncx = tocData?.ncx && tocData.ncx[0];
	const navMap = ncx?.navMap && ncx.navMap[0];
	const navPoint = navMap?.navPoint;

	(navPoint || []).forEach(({content, navLabel}: any) => {
		const contentDetail = content && content[0];
		const navLabelDetail = navLabel && navLabel[0];

		const href = contentDetail?.attr?.src || '';
		const id = items.find((item) => item.href === href)?.id || '';

		result.push({
			href,
			label: navLabelDetail?.text || '',
			id
		});
	});

	return result;
};

export const epubParser = async (file: File): Promise<EpubData> => {
	try {
		const result = await loadAsync(file);

		const rootFilePath = await getRootFile(
			result.file('META-INF/container.xml'),
		);

		const contentFile = result.file(rootFilePath);

		const content = await parseContentData(contentFile);

		const toc = await parseToc(result.file('toc.ncx'), content);

		return {
			book: {
				result,
				content,
			},
			toc
		};
	} catch (err) {
		throw new Error('Invalid Epub file.');
	}
};
