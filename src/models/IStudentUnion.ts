export default interface IStudentUnion {
  unionId?: number;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Filters a student union object and removes its "hidden" & "password" fields.
 * @param user StudentUnion object
 */
export const studentUnionFilter = (stdu: IStudentUnion) => {
  return {
    unionId: stdu.unionId,
    name: stdu.name,
    description: stdu.description,
    created_at: stdu.created_at,
    updated_at: stdu.updated_at
  };
};
