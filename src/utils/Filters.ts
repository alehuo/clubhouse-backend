interface ITimestampEntity {
  created_at?: Date;
  updated_at?: Date;
}

export const timestampFilter: (entity: object & ITimestampEntity) => object = (
  entity: object & ITimestampEntity
): object => {
  if (entity.updated_at && entity.created_at) {
    delete entity.created_at;
    delete entity.updated_at;
  }
  return entity;
};
