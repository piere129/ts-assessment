import { AnnotationConverter } from './annotation-converter';
import { EntityConverter } from './entity-converter';
import { Input } from './types/input';
import { Output } from './types/output';

// TODO: Convert Input to the Output structure. Do this in an efficient and generic way.
export const convertInput = (input: Input): Output => {
  const documents = input.documents.map((document) => {
    // TODO: map the entities to the new structure and sort them based on the property "name"
    // Make sure the nested children are also mapped and sorted
    const entityConverter = new EntityConverter();
    const entities = entityConverter.sortConvertedEntities(
      entityConverter.convertEntities(document.entities),
      entityConverter.sortEntitiesByNameAsc,
    );

    // TODO: map the annotations to the new structure and sort them based on the property "index"
    // Make sure the nested children are also mapped and sorted
    const annotationConverter = new AnnotationConverter();
    const annotations = annotationConverter.sortConvertedAnnotations(
      annotationConverter.convertAnnotations(document.annotations, entityConverter.getLatestEntityHashMap()),
      annotationConverter.sortEntitiesByNameAsc,
    );
    return { id: document.id, entities, annotations };
  });

  return { documents };
};
