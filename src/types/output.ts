import { EntityClass, EntityType, Index } from './input';

export interface Output {
  documents: Array<ConvertedDocument>;
}

interface ConvertedDocument {
  id: string;
  entities: ConvertedEntity[];
  annotations: ConvertedAnnotation[];
}

export interface ConvertedItem<X> {
  id: string;
  children: ConvertedItem<X>[];
}

export interface ConvertedAnnotation extends ConvertedItem<ConvertedAnnotation> {
  entity: { id: string; name: string };
  value: string | number | null;
  index: number;
}

export interface ConvertedEntity extends ConvertedItem<ConvertedEntity> {
  name: string;
  type: EntityType;
  class: EntityClass;
}
export interface ConvertedAnnotationDataObject extends ConvertedAnnotation {
  indices: Index[];
}
