import { generateJSON, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";

const extensions = [StarterKit, TextStyle, Color, Image, Placeholder];

export function htmlToJSON(html: string) {
  const json = generateJSON(html, extensions);
  return JSON.stringify(json);
}

export function jsonToHTML(jsonStr: string) {
  const json = JSON.parse(jsonStr);
  return generateHTML(json, extensions);
}
