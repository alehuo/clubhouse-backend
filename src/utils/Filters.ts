export const timestampFilter = entity => {
  if (entity.updated_at && entity.created_at) {
    delete entity.created_at;
    delete entity.updated_at;
  }
  return entity;
};
