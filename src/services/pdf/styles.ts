import { StyleDictionary } from "pdfmake/interfaces";

export const docStyles: StyleDictionary = {
    header: {
      fontSize: 18,
      bold: true,
      color: '#000000',
    },
    subheader: {
      fontSize: 12,
      bold: false,
      color: '#9e9e9e',
    },
    treasures: {
      fontSize: 16,
      bold: true,
      color: '#656164',
    },
    apply: {
      fontSize: 16,
      bold: true,
      color: '#a56803',
    },
    life: {
      fontSize: 16,
      bold: true,
      color: '#99131e',
    },
    weekend: {
      fontSize: 16,
      bold: true,
      color: '#808080',
    },
    label: {
      fontSize: 12,
      bold: false,
      color: '#808080',
    },
    part: {
      fontSize: 12,
      bold: false,
      color: '#000000',
    },
    partValue: {
      fontSize: 12,
      bold: true,
      color: '#000000',
      alignment: 'right',
    },
    value: {
      fontSize: 12,
      bold: true,
      color: '#000000',
      margin: [0, 2],
    },
  };
export const partStyles: StyleDictionary = {
    title: {
      fontSize: 12,
      bold: true,
      alignment: 'center',
      color: '#000000',
    },
    label: {
      fontSize: 10,
      bold: true,
      color: '#000000',
    },
    info: {
      fontSize: 6,
      bold: true,
      color: '#000000',
    },
    note: {
      fontSize: 8,
      bold: false,
      color: '#9E9E9D',
    },
    noteLabel: {
      fontSize: 8,
      bold: true,
      color: '#9E9E9D',
    },
    value: {
      fontSize: 12,
      bold: false,
      color: '#000000',
    },
  };