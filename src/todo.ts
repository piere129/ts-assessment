import { EntityConverter, AnnotationConverter } from './converters';
import { Input, Output } from './types';

export const convertInput = (input: Input): Output => {
  const documents = input.documents.map((document) => {
    // convert entities
    const entityConverter = new EntityConverter();
    const entities = entityConverter.sortConvertedEntities(
      entityConverter.convertEntities(document.entities),
      entityConverter.sortEntitiesByNameAsc,
    );

    // convert annotations
    const annotationConverter = new AnnotationConverter();
    const annotations = annotationConverter.sortConvertedAnnotations(
      annotationConverter.convertAnnotations(document.annotations, entityConverter.getLatestEntityHashMap()),
      annotationConverter.sortAnnotationsByIndexAsc,
    );

    return { id: document.id, entities, annotations };
  });

  return { documents };
};
