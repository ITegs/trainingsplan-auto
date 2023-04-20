import { type section, Template } from "./types";
import { jsPDF } from "jspdf";
import loadImage from "blueimp-load-image";

import "../lib/Abel-Regular-normal";
import "../lib/SourceCodePro-Regular-normal";

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
        canvas: true,
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

let primaryColor: number[];
let secondaryColor: number[];

function configColor(template: Template) {
  if (template === Template.blank) {
    primaryColor = [21, 122, 110];
    secondaryColor = [0, 0, 0];
  } else if (template === Template.janina) {
    primaryColor = [229, 89, 55];
    secondaryColor = [34, 124, 157];
  } else if (template === Template.flo) {
    primaryColor = [107, 94, 98];
    secondaryColor = [80, 140, 164];
  }
}

export async function generatePDF(
  name: string,
  title: string,
  sections: section[],
  template: Template
) {
  const doc = new jsPDF();
  configColor(template);

  // Add title
  doc.setFont("SourceCodePro-Regular");
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Trainingsplan", 10, 20);
  doc.setFont("Abel-Regular");
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(name, 75, 20);
  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.line(10, 25, 40, 25);

  // Add plan title
  doc.setFontSize(20);
  doc.text(title, 13, 40);
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(10, 32, 185, 10);

  // Add sections
  let y = 55;
  let i = 1;
  let xname = 0;
  for (const section of sections) {
    doc.setFont("SourceCodePro-Regular");
    doc.setFontSize(13);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Übung " + i + ":", 20, y);
    doc.setFont("Abel-Regular");
    doc.setFontSize(20);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(section.name, 43 + xname, y);
    doc.line(20, y + 5, 60, y + 5);

    y += 10;

    if (section.images !== undefined) {
      let x = 23;
      for (const image of section.images) {
        // get format of image
        const format = image.name.split(".").pop() as string;
        format.toUpperCase();
        console.log(format);

        const data = (await parseImages(image)) as string;

        const ratio = (await getImageRatio(data)) as number;

        doc.addImage(data, format, x, y, 40 / ratio, 40, "", "FAST");
        x += 40 / ratio + 5;
      }

      y += 50;
    }

    doc.setFontSize(13);
    doc.text(section.text, 20, y);

    // get the number of lines
    const lines = doc.splitTextToSize(section.text, 150);
    y += lines.length * 5 + 10;

    if (y > 220) {
      if (template === Template.janina) {
        doc.setFontSize(13);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("Janina Erlacher", 75, 290);
        doc.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        doc.text("- Body Poetry Yoga", 103, 290);
        doc.addPage();
        y = 20;
      } else if (template === Template.flo) {
        doc.setFontSize(13);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("Florian Mayer", 79, 290);
        doc.setTextColor(
          secondaryColor[0],
          secondaryColor[1],
          secondaryColor[2]
        );
        doc.text("- Osteopathie", 104, 290);
        y = 20;
        doc.addPage();
        y = 20;
      } else {
        doc.addPage();
        y = 20;
      }
    }

    i++;
    if (i > 9) {
      xname = 3;
    }
  }

  if (template === Template.janina) {
    doc.setFontSize(13);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Janina Erlacher", 75, 290);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("- Body Poetry Yoga", 103, 290);
    y = 20;
  } else if (template === Template.flo) {
    doc.setFontSize(13);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Florian Mayer", 79, 290);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("- Osteopathie", 104, 290);
    y = 20;
  }

  doc.save("Trainingsplan-" + name + ".pdf");

  return doc;
}
