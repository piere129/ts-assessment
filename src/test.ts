import { AnnotationConverter } from './annotation-converter';
import { EntityConverter } from './entity-converter';
import input from './input.json'; // This import style requires "esModuleInterop", see "side notes"
import { Annotation, Entity } from './types/input';

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
