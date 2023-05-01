export type section = {
  name: string;
  text: string;
  images: FileList;
};

export type newSection = {
  name: string;
  text: string;
  images?: FileList;
};

export enum Template {
  blank = "blank",
  janina = "janina",
  flo = "flo",
}
