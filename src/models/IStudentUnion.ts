export default interface IStudentUnion {
  unionId?: number;
  name: string;
  description: string;
}

/**
 * Filters a student union object and removes its "hidden" & "password" fields.
 * @param user StudentUnion object
 */
export const studentUnionFilter = (stdu: IStudentUnion) => {
  return {
    unionId: stdu.unionId,
    name: stdu.name,
    description: stdu.description
  };
};
