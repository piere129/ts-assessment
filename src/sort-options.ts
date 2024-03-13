import { ConvertedAnnotation, ConvertedEntity } from './types';

// CONVERTEDENTITY SORTING
export const sortEntitiesByNameAsc = (entityA: ConvertedEntity, entityB: ConvertedEntity): number => {
  return entityA.name.localeCompare(entityB.name);
};

export const sortAnnotationsByIndexAsc = (
  annotationA: ConvertedAnnotation,
  annotationB: ConvertedAnnotation,
): number => {
  return annotationA.index - annotationB.index;
};
