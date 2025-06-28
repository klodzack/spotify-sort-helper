// Type definitions for wtf_wikipedia
// Project: https://github.com/spencermountain/wtf_wikipedia
// Definitions by: Copilot

// Main module
declare module 'wtf_wikipedia' {
  // Main entry point
  function wtf(wikitext: string): WtfDocument;
  namespace wtf {
    function fetch(
      titleOrUrl: string | number,
      langOrOptions?: string | FetchOptions,
      options?: FetchOptions
    ): Promise<WtfDocument | null>;
    function fetch(
      titleOrUrl: (string | number)[],
      langOrOptions?: string | FetchOptions,
      options?: FetchOptions
    ): Promise<WtfDocument[]>;
    function extend(plugin: (models: any, templates?: any, infoboxes?: any) => void): void;
    // Plugins may add more methods
  }

  export interface FetchOptions {
    lang?: string;
    wiki?: string;
    domain?: string;
    path?: string;
    follow_redirects?: boolean;
    [key: string]: any;
  }

  export interface WtfDocument {
    title(): string;
    pageID(): number | undefined;
    wikidata(): string | undefined;
    domain(): string | undefined;
    url(): string | undefined;
    lang(): string | undefined;
    namespace(): string | undefined;
    isRedirect(): boolean;
    redirectTo(): string | undefined;
    isDisambiguation(): boolean;
    isStub(): boolean;
    categories(): string[];
    sections(): Section[];
    paragraphs(): Paragraph[];
    sentences(): Sentence[];
    images(): Image[];
    links(): Link[];
    lists(): List[];
    tables(): Table[];
    templates(): Template[];
    infoboxes(): Infobox[];
    references(): Reference[];
    coordinates(): Coordinate[];
    text(): string;
    json(): any;
    wikitext(): string;
    description(): string | undefined;
    pageImage(): string | undefined;
    revisionID?(): string | undefined;
    timestamp?(): string | undefined;
  }

  export interface Section {
    title(): string;
    index(): number;
    indentation(): number;
    sentences(): Sentence[];
    paragraphs(): Paragraph[];
    links(): Link[];
    tables(): Table[];
    templates(): Template[];
    infoboxes(): Infobox[];
    coordinates(): Coordinate[];
    lists(): List[];
    interwiki(): Link[];
    images(): Image[];
    references(): Reference[];
    remove(): void;
    nextSibling(): Section | undefined;
    lastSibling(): Section | undefined;
    children(): Section[];
    parent(): Section | undefined;
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface Paragraph {
    sentences(): Sentence[];
    references(): Reference[];
    lists(): List[];
    images(): Image[];
    links(): Link[];
    interwiki(): Link[];
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface Sentence {
    links(): Link[];
    bolds(): string[];
    italics(): string[];
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface Image {
    url(): string;
    thumbnail(size?: number): string;
    links(): Link[];
    format(): string;
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface Link {
    page(): string;
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface Template {
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface Infobox {
    links(): Link[];
    keyValue(): { [key: string]: string };
    image(): Image | undefined;
    get(key: string): any;
    template(): string;
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface List {
    lines(): string[];
    links(): Link[];
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface Reference {
    title(): string;
    links(): Link[];
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface Table {
    links(): Link[];
    keyValue(): { [key: string]: string }[];
    text(): string;
    json(): any;
    wikitext(): string;
  }

  export interface Coordinate {
    lat: number;
    lon: number;
    json(): any;
  }

  export = wtf;
}
