import type { section } from './types';
import { jsPDF } from 'jspdf';
import loadImage from 'blueimp-load-image';

import '../lib/Abel-Regular-normal.js';

function parseImages(image: Blob) {
	return new Promise((resolve) => {
		loadImage(
			image,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(canvas: any) => {
				resolve(canvas.toDataURL());
			},
			{
				maxWidth: 1000,
				maxHeight: 1000,
				orientation: true,
				canvas: true
			}
		);
	});
}

function getImageRatio(data: string) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = data;
		img.onload = () => {
			resolve(img.height / img.width);
		};
		img.onerror = (error) => {
			reject(error);
		};
	});
}

export async function generatePDF(name: string, title: string, sections: section[]) {
	const doc = new jsPDF();

	// Add title
	doc.setFont('Abel-Regular');
	doc.setFontSize(25);
	doc.setTextColor(229, 89, 55);
	doc.text('Trainingsplan', 10, 20);
	doc.setTextColor(34, 124, 157);
	doc.text(name, 60, 20);
	doc.setDrawColor(34, 124, 157);
	doc.line(10, 25, 40, 25);

	// Add plan title
	doc.setFontSize(20);
	doc.text(title, 13, 40);
	doc.setDrawColor(229, 89, 55);
	doc.rect(10, 32, 185, 10);

	// Add sections
	let y = 55;
	let i = 1;
	for (const section of sections) {
		doc.setFontSize(13);
		doc.setTextColor(229, 89, 55);
		doc.text('Übung ' + i + ':', 20, y);
		doc.setFontSize(20);
		doc.setTextColor(34, 124, 157);
		doc.text(section.name, 40, y);
		doc.line(20, y + 5, 60, y + 5);

		y += 10;

		if (section.images !== undefined) {
			let x = 23;
			for (const image of section.images) {
				// get format of image
				const format = image.name.split('.').pop() as string;
				format.toUpperCase();
				console.log(format);

				const data = (await parseImages(image)) as string;

				const ratio = (await getImageRatio(data)) as number;

				doc.addImage(data, format, x, y, 30 / ratio, 30, '', 'FAST');
				x += 30 / ratio + 5;
			}

			y += 40;
		}

		doc.setFontSize(17);
		doc.text(section.text, 20, y);

		// get the number of lines
		const lines = doc.splitTextToSize(section.text, 150);
		y += lines.length * 10 + 10;

		if (y > 250) {
			doc.setFontSize(13);
			doc.setTextColor(229, 89, 55);
			doc.text('Janina Erlacher', 75, 290);
			doc.setTextColor(34, 124, 157);
			doc.text('- Body Poetry Yoga', 103, 290);
			doc.addPage();
			y = 20;
		}

		i++;
	}

	doc.setFontSize(13);
	doc.setTextColor(229, 89, 55);
	doc.text('Janina Erlacher', 75, 290);
	doc.setTextColor(34, 124, 157);
	doc.text('- Body Poetry Yoga', 103, 290);
	doc.save('Trainingsplan-' + name + '.pdf');
}
