export interface Input {
  documents: Array<Document>; // pay attention to this property

  // props below you don't need
  status: 'IN_PROGRESS';
  step: 'OUTPUT';
  id: string;
  projectId: string;
  organisationId: string;
  pages: Array<Page>;
  files: Array<File>;
  metadata: Record<string, unknown>;
  createdAt: string;
  completedAt: string | null;
}

interface File {
  id: string;
  name: string;
  url: string | null;
  pageIds: string[];
}

interface Page {
  id: string;
  fileId: string;
  text: string;
  index: number;
  height: number;
  width: number;
}

export interface Document {
  id: string;
  entities: Entity[]; // pay attention to this property
  annotations: Annotation[]; // pay attention to this property

  // props below you don't need
  status: 'DONE';
  language: string;
  name: string;
  documentType: DocumentType;
  pageIds: string[];
  step: 'DOCUMENT_CLASSIFICATION' | 'ENTITY_EXTRACTION';
  createdAt: string;
  completedAt: string | null;
}

export interface Entity {
  id: string;
  name: string;
  threshold: number | null;
  type: EntityType;
  class: EntityClass;
  refs: Array<Entity['id']>; // refs is a list of parent entity ids. "article details" has 1 ref, namely the "article" entityId.
}

export enum EntityType {
  REGULAR = 'REGULAR',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
}

export enum EntityClass {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  COMPOSITE = 'COMPOSITE',
  PARAGRAPH = 'PARAGRAPH',
  REGEX = 'REGEX',
  CHECKBOX = 'CHECKBOX',
  RELATION = 'RELATION',
}

export interface Annotation {
  id: string;
  entityId: Entity['id'];
  refs: Array<Annotation['id']>; // refs is a list of parent annotation ids. "article details" has 1 ref, namely the "article" annotationId.
  value: string | number | null;
  indices: Array<Index> | null;

  // props below you don't need
  entityExtractionConfidence: number | null;
  ocrConfidence: number | null;
  confidence: number | null;
  rawValue: string | null;
  parsedValue: string | number | null;
  source: 'MANUAL' | 'HUMAN' | 'AI';
  user: User | null;
  checked: boolean | null;
  image: string | null;
  coords: Coords | null;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Index {
  pageId: string;
  start: number;
  end: number;
}

interface Coords {
  pageId: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

interface DocumentType {
  id: string;
  name: string;
  threshold: number | null;
  confidence: number | null;
}
