// Timestamp filter that can be used to filter out Knex's timestamps.

export const timestampFilter: (entity: any) => any = (entity: any): any => {
  if (entity.updated_at && entity.created_at) {
    const entity2: any = { ...entity };
    delete entity2.created_at;
    delete entity2.updated_at;
    return entity2;
  }
  return entity;
};
