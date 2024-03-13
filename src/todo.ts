import { EntityConverter, AnnotationConverter } from './converters';
import { sortAnnotationsByIndexAsc, sortEntitiesByNameAsc } from './sort-options';
import { Input, Output } from './types';

export const convertInput = (input: Input): Output => {
  const documents = input.documents.map((document) => {
    // convert entities
    const entityConverter = new EntityConverter();
    const entities = entityConverter
      .convertEntities(document.entities)
      .sortConvertedEntities(sortEntitiesByNameAsc)
      .getResult();

    // convert annotations
    const annotationConverter = new AnnotationConverter();
    const annotations = annotationConverter
      .convertAnnotations(document.annotations, entityConverter.getLatestEntityHashMap())
      .sortConvertedAnnotations(sortAnnotationsByIndexAsc)
      .getResults();

    return { id: document.id, entities, annotations };
  });

  return { documents };
};
