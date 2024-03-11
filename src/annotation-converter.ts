import { Annotation } from './types/input';
import { ConvertedItemMap } from './types/other';
import { ConvertedAnnotation, ConvertedEntity } from './types/output';

export class AnnotationConverter {
  public mapAnnotationPropsToConvertedAnnotation(
    annotation: Annotation,
    entityHashMap: ConvertedItemMap<ConvertedEntity>,
  ): ConvertedAnnotation {
    return {
      id: annotation.id,
      value: annotation.value,
      entity: { id: annotation.entityId, name: entityHashMap[annotation.entityId].name },
      index: annotation.indices && annotation.indices.length > 0 ? annotation.indices[0].start : -1,
      children: [],
    };
  }

  // HINT: you probably need to pass extra argument(s) to this function to make it performant.
  public convertAnnotations(
    annotations: Annotation[],
    entityHashMap: ConvertedItemMap<ConvertedEntity>,
  ): ConvertedAnnotation[] {
    // make a hashTable to keep track of all unique entities in their converted format
    const convertedAnnotationHashTable: ConvertedItemMap<ConvertedAnnotation> = Object.create(null);
    annotations.forEach((annotation: Annotation) => {
      convertedAnnotationHashTable[annotation.id] = this.mapAnnotationPropsToConvertedAnnotation(
        annotation,
        entityHashMap,
      );
    });

    const convertAnnotations: ConvertedAnnotation[] = [];
    annotations.forEach((annotation: Annotation) => {
      if (annotation.refs.length > 0) {
        // if entity has parentIds, add the entity to the children array of that parent in the hashmap
        annotation.refs.forEach((parentId: string) => {
          convertedAnnotationHashTable[parentId].children.push(convertedAnnotationHashTable[annotation.id]);
        });
      }

      // Always push item itself onto output as well. (Could be added within else-clause if u don't want duplicates)
      convertAnnotations.push(convertedAnnotationHashTable[annotation.id]);
    });

    return convertAnnotations;
  }

  public sortEntitiesByNameAsc(annotationA: ConvertedAnnotation, annotationB: ConvertedAnnotation): number {
    return annotationA.id.localeCompare(annotationB.id);
  }

  public sortConvertedAnnotations = (
    annotations: ConvertedAnnotation[],
    sortFunc: (annotationA: ConvertedAnnotation, annotationB: ConvertedAnnotation) => number,
  ): ConvertedAnnotation[] => {
    annotations.sort(sortFunc);
    return annotations;
  };
}
