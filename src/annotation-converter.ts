import { Annotation, Index } from './types/input';
import { ConvertedItemMap } from './types/other';
import { ConvertedAnnotation, ConvertedEntity } from './types/output';

interface ConvertedAnnotationDataObject extends ConvertedAnnotation {
  indices?: null | Index[];
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

  private findMinimumIndexRecursive(dataobject: ConvertedAnnotationDataObject): number {
    if (dataobject.indices && dataobject.indices.length > 0) {
      return dataobject.indices[0].start;
    }

    if (dataobject.children.length > 0) {
      return Math.min(
        ...dataobject.children.map((value: ConvertedAnnotationDataObject) => this.findMinimumIndexRecursive(value)),
      );
    }

    return Number.MAX_SAFE_INTEGER;
  }

  public convertAnnotations(
    annotations: Annotation[],
    entityHashMap: ConvertedItemMap<ConvertedEntity>,
  ): ConvertedAnnotation[] {
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

    annotations.forEach((annotation: Annotation) => {
      if (annotation.refs.length > 0) {
        annotation.refs.forEach((parentId: string) => {
          convertedAnnotationHashTableNested[parentId].children.push(convertedAnnotationHashTable[annotation.id]);
        });
      }

      if (!annotation.indices || annotation.indices.length === 0) {
        noIndiceAnnotationIds.push(annotation.id);
      }
    });

    noIndiceAnnotationIds.forEach((id: string) => {
      const annotationInNestedMap = convertedAnnotationHashTableNested[id];
      const index = this.findMinimumIndexRecursive(annotationInNestedMap);
      convertedAnnotationHashTable[id].index = index;
    });

    Object.values(convertedAnnotationHashTable).forEach((value: ConvertedAnnotationDataObject) => {
      delete value.indices;
    });

    annotations.forEach((annotation: Annotation) => {
      if (annotation.refs.length > 0) {
        annotation.refs.forEach((parentId: string) => {
          convertedAnnotationHashTable[parentId].children.push(convertedAnnotationHashTable[annotation.id]);
          delete convertedAnnotationHashTable[annotation.id];
        });
      }
    });

    return Object.values(convertedAnnotationHashTable).map((value: ConvertedAnnotationDataObject) => {
      delete value.indices;
      return value;
    });
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
