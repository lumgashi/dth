/**
 * @description This function is using to create an array that can be used to connect many to one relations
 * @param {Array<string>} manyRelationArray - array that should be structure as [{"id":"example"}]
 * @returns {Array<object| []>} - return an empty array or an array with ids {"id":"example"}
 */
export function createManyToOneRelation(
  manyRelationArray: Array<string>,
): Array<{ id: string }> {
  const connectArray = [];
  if (Array.isArray(manyRelationArray)) {
    for (const item of manyRelationArray) {
      connectArray.push({ id: item });
    }
  }

  return connectArray;
}
