import { Annotation, Index } from './types/input';
import { ConvertedItemMap } from './types/other';
import { ConvertedAnnotation, ConvertedEntity } from './types/output';

interface ConvertedAnnotationDataObject extends ConvertedAnnotation {
  indices?: null | Index[];
  id: string;
  entity: { id: string; name: string };
  value: string | number | null;
  index: number;
  children: ConvertedAnnotation[];
}

export class AnnotationConverter {
  private mapAnnotationPropsToConvertedAnnotationDataObject(
    annotation: Annotation,
    entityHashMap: ConvertedItemMap<ConvertedEntity>,
  ): ConvertedAnnotationDataObject {
    return {
      id: annotation.id,
      value: annotation.value,
      entity: { id: annotation.entityId, name: entityHashMap[annotation.entityId].name },
      index: annotation.indices && annotation.indices.length > 0 ? annotation.indices[0].start : -1,
      indices: annotation.indices,
      children: [],
    };
  }

  private mapAnnotationDataObjectToConvertedAnnotation(
    annotationDO: ConvertedAnnotationDataObject,
  ): ConvertedAnnotation {
    return {
      id: annotationDO.id,
      entity: annotationDO.entity,
      index: annotationDO.index,
      value: annotationDO.value,
      children: annotationDO.children,
    };
  }

  private findIndexRecursive(dataobject: ConvertedAnnotationDataObject): number {
    if (dataobject.indices !== null && dataobject.indices !== undefined && dataobject.indices.length > 0) {
      return dataobject.indices[0].start;
    }

    if (dataobject.children.length > 0) {
      return Math.min(
        ...dataobject.children.map((value: ConvertedAnnotationDataObject) => this.findIndexRecursive(value)),
      );
    }

    return Number.MAX_SAFE_INTEGER;
  }

  // HINT: you probably need to pass extra argument(s) to this function to make it performant.
  public convertAnnotations(
    annotations: Annotation[],
    entityHashMap: ConvertedItemMap<ConvertedEntity>,
  ): ConvertedAnnotation[] {
    // make a hashTable to keep track of all unique entities in their converted format
    const convertedAnnotationHashTable: ConvertedItemMap<ConvertedAnnotationDataObject> = Object.create(null);
    const convertedAnnotationHashTableNested: ConvertedItemMap<ConvertedAnnotationDataObject> = Object.create(null);
    annotations.forEach((annotation: Annotation) => {
      convertedAnnotationHashTable[annotation.id] = this.mapAnnotationPropsToConvertedAnnotationDataObject(
        annotation,
        entityHashMap,
      );
      convertedAnnotationHashTableNested[annotation.id] = this.mapAnnotationPropsToConvertedAnnotationDataObject(
        annotation,
        entityHashMap,
      );
    });

    const noIndiceAnnotationIds: string[] = [];
    const indiceAnnotationIds: string[] = [];

    annotations.forEach((annotation: Annotation) => {
      if (annotation.refs.length > 0) {
        // if entity has parentIds, add the entity to the children array of that parent in the hashmap
        annotation.refs.forEach((parentId: string) => {
          convertedAnnotationHashTableNested[parentId].children.push(convertedAnnotationHashTable[annotation.id]);
        });
      }

      if (annotation.indices?.length === 0) {
        noIndiceAnnotationIds.push(annotation.id);
      } else if (annotation.indices !== null && annotation.indices.length > 0) {
        indiceAnnotationIds.push(annotation.id);
      }
    });
    // console.log('table', JSON.stringify(convertedAnnotationHashTableNested));

    const convertAnnotations: ConvertedAnnotation[] = [];

    noIndiceAnnotationIds.forEach((id: string) => {
      const annotationInNestedMap = convertedAnnotationHashTableNested[id];
      const index = this.findIndexRecursive(annotationInNestedMap);
      convertedAnnotationHashTable[id].index = index;
    });

    // console.log('table', JSON.stringify(convertedAnnotationHashTable));
    Object.values(convertedAnnotationHashTable).forEach((value: ConvertedAnnotationDataObject) => {
      delete value.indices;
    });

    annotations.forEach((annotation: Annotation) => {
      if (annotation.refs.length > 0) {
        // if entity has parentIds, add the entity to the children array of that parent in the hashmap
        annotation.refs.forEach((parentId: string) => {
          convertedAnnotationHashTable[parentId].children.push(convertedAnnotationHashTable[annotation.id]);
          delete convertedAnnotationHashTable[annotation.id];
        });
      }
    });

    Object.values(convertedAnnotationHashTable).forEach((value: ConvertedAnnotationDataObject) => {
      convertAnnotations.push(this.mapAnnotationDataObjectToConvertedAnnotation(value));
    });

    return convertAnnotations;
  }

  public sortAnnotationsByIndexAsc(annotationA: ConvertedAnnotation, annotationB: ConvertedAnnotation): number {
    return annotationA.index - annotationB.index;
  }

  public sortConvertedAnnotations = (
    annotations: ConvertedAnnotation[],
    sortFunc: (annotationA: ConvertedAnnotation, annotationB: ConvertedAnnotation) => number,
  ): ConvertedAnnotation[] => {
    annotations.sort(sortFunc);
    annotations.forEach((annotation: ConvertedAnnotation) => {
      if (annotation.children) {
        this.sortConvertedAnnotations(annotation.children, this.sortAnnotationsByIndexAsc);
      }
    });
    return annotations;
  };
}
