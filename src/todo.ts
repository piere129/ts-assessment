import { Annotation, Entity, Input } from './types/input';
import { ConvertedAnnotation, ConvertedEntity, Output } from './types/output';

// TODO: Convert Input to the Output structure. Do this in an efficient and generic way.
export const convertInput = (input: Input): Output => {
  const documents = input.documents.map((document) => {
    // TODO: map the entities to the new structure and sort them based on the property "name"
    // Make sure the nested children are also mapped and sorted
    const entities = document.entities.map(convertEntity).sort(sortEntities);

    // TODO: map the annotations to the new structure and sort them based on the property "index"
    // Make sure the nested children are also mapped and sorted
    const annotations = document.annotations.map(convertAnnotation).sort(sortAnnotations);
    return { id: document.id, entities, annotations };
  });

  return { documents };
};

// HINT: you probably need to pass extra argument(s) to this function to make it performant.
const convertEntity = (entity: Entity): ConvertedEntity => {
  throw new Error('Not implemented');
};

// HINT: you probably need to pass extra argument(s) to this function to make it performant.
const convertAnnotation = (annotation: Annotation): ConvertedAnnotation => {
  throw new Error('Not implemented');
};

const sortEntities = (entityA: ConvertedEntity, entityB: ConvertedEntity) => {
  throw new Error('Not implemented');
};

const sortAnnotations = (annotationA: ConvertedAnnotation, annotationB: ConvertedAnnotation) => {
  throw new Error('Not implemented');
};

