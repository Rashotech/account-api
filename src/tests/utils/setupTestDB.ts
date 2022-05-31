import db from '../../config/db';

const setupTestDB = () => {
  beforeEach(async function() {
    return await db.migrate.rollback()
      .then(async function() {
        return await db.migrate.latest();
      })
  });
};

export default setupTestDB;