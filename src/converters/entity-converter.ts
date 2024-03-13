import { ConvertedEntity, ConvertedItemMap, Entity } from '../types';
import { BaseConverter } from './base-converter';

export class EntityConverter extends BaseConverter<ConvertedEntity> {
  private entityHashMap: ConvertedItemMap<ConvertedEntity>;

  public getLatestEntityHashMap(): ConvertedItemMap<ConvertedEntity> {
    return this.entityHashMap;
  }

  // could also be done recursively with parentIds
  public convertEntities(entities: Entity[]): ConvertedEntity[] {
    // make a hashTable to keep track of all unique entities in their converted format
    this.entityHashMap = Object.create(null);
    entities.forEach((entity: Entity) => {
      this.entityHashMap[entity.id] = this.mapEntityPropsToConvertedEntity(entity);
    });

    const convertedEntities: ConvertedEntity[] = [];

    entities.forEach((entity: Entity) => {
      if (entity.refs.length > 0) {
        // if entity has parentIds, add the entity to the children array of that parent in the hashmap
        entity.refs.forEach((parentId: string) => {
          this.entityHashMap[parentId].children.push(this.entityHashMap[entity.id]);
        });
      }

      // Always push item itself onto output as well. (Could be added within else-clause if u don't want duplicates)
      convertedEntities.push(this.entityHashMap[entity.id]);
    });

    return convertedEntities;
  }

  public sortConvertedEntities(
    entities: ConvertedEntity[],
    sortFunc: (entityA: ConvertedEntity, entityB: ConvertedEntity) => number,
  ): ConvertedEntity[] {
    return super.sortItems<ConvertedEntity>(entities, sortFunc);
  }

  public sortEntitiesByNameAsc(entityA: ConvertedEntity, entityB: ConvertedEntity): number {
    return entityA.name.localeCompare(entityB.name);
  }

  private mapEntityPropsToConvertedEntity(entity: Entity): ConvertedEntity {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      class: entity.class,
      children: [],
    };
  }
}
