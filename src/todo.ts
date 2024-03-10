import { Annotation, Entity, Input } from './types/input';
import { ConvertedAnnotation, ConvertedEntity, Output } from './types/output';

// TODO: Convert Input to the Output structure. Do this in an efficient and generic way.
export const convertInput = (input: Input): Output => {
  const documents = input.documents.map((document) => {
    // TODO: map the entities to the new structure and sort them based on the property "name"
    // Make sure the nested children are also mapped and sorted
    const entities = sortConvertedEntities(convertEntities(document.entities), sortEntitiesByNameAsc);

    // TODO: map the annotations to the new structure and sort them based on the property "index"
    // Make sure the nested children are also mapped and sorted
    const annotations = document.annotations.map(convertAnnotation).sort(sortAnnotations);
    return { id: document.id, entities, annotations };
  });

  return { documents };
};

type ConvertedEntityMap = {
  [key: string]: ConvertedEntity;
};

// could also be done recursively
export const convertEntities = (entities: Entity[]): ConvertedEntity[] => {
  // make a hashTable to keep track of all unique entities in their converted format
  const convertedEntityHashTable: ConvertedEntityMap = Object.create(null);
  entities.forEach((entity: Entity) => {
    convertedEntityHashTable[entity.id] = mapEntityPropsToConvertedEntity(entity);
  });

  const convertedEntities: ConvertedEntity[] = [];
  entities.forEach((entity: Entity) => {
    if (entity.refs.length > 0) {
      // if entity has parentIds, add the entity to the children array of that parent in the hashmap
      entity.refs.forEach((parentId: string) => {
        convertedEntityHashTable[parentId].children.push(convertedEntityHashTable[entity.id]);
      });
    }

    // Always push item itself onto output as well. (Could be added within else-clause if u don't want duplicates)
    convertedEntities.push(convertedEntityHashTable[entity.id]);
  });

  return convertedEntities;
};

const mapEntityPropsToConvertedEntity = (entity: Entity): ConvertedEntity => {
  return {
    id: entity.id,
    name: entity.name,
    type: entity.type,
    class: entity.class,
    children: [],
  };
};

// HINT: you probably need to pass extra argument(s) to this function to make it performant.
const convertAnnotation = (annotation: Annotation): ConvertedAnnotation => {
  throw new Error('Not implemented');
};

const sortConvertedEntities = (
  entities: ConvertedEntity[],
  sortFunc: (entityA: ConvertedEntity, entityB: ConvertedEntity) => number,
): ConvertedEntity[] => {
  entities.sort(sortFunc);
  entities.forEach((entity: ConvertedEntity) => {
    if (entity.children) {
      sortConvertedEntities(entity.children, sortEntitiesByNameAsc);
    }
  });
  return entities;
};

const sortEntitiesByNameAsc = (entityA: ConvertedEntity, entityB: ConvertedEntity) => {
  return entityA.name.localeCompare(entityB.name);
};

const sortAnnotations = (annotationA: ConvertedAnnotation, annotationB: ConvertedAnnotation) => {
  throw new Error('Not implemented');
};
