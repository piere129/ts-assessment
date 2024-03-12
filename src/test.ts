import { EntityConverter, AnnotationConverter } from './converters';
import input from './input.json';
import { Entity, Annotation } from './types';

const entityConverter = new EntityConverter();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const entities = entityConverter.sortConvertedEntities(
  entityConverter.convertEntities(input.documents[0].entities as Entity[]),
  entityConverter.sortEntitiesByNameAsc,
);

// TODO: map the annotations to the new structure and sort them based on the property "index"
// Make sure the nested children are also mapped and sorted
const annotationConverter = new AnnotationConverter();
const annotations = annotationConverter.sortConvertedAnnotations(
  annotationConverter.convertAnnotations(
    input.documents[0].annotations as Annotation[],
    entityConverter.getLatestEntityHashMap(),
  ),
  annotationConverter.sortAnnotationsByIndexAsc,
);

console.log(JSON.stringify(annotations));
