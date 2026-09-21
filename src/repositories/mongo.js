export function createMongoRepository(db, client) {
  return {
    listLessons: () => db.collection('lessons').find({}).toArray(),
  }
}
