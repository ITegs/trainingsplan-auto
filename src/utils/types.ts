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
  janina = "janina",
  flo = "flo",
  blank = "blank",
}
