import { queryDb, sql } from '../../db/index.js';

export default class RevisionsService {
  /**
   * @param {Object} input
   * @param {string} input.originalText
   * @param {string} input.responseText
   * @param {number} input.parentId
   */
  static async createRevision(input) {
    return queryDb`INSERT INTO revisions ${sql(
      input,
      'originalText',
      'responseText',
      'parentId'
    )} RETURNING *;`;
  }

  /**
   * @param {string} id
   */
  static getRevisionById(id) {
    return queryDb`SELECT * FROM revisions where id = ${id};`;
  }

  static getAllRevisions() {
    return queryDb`SELECT * FROM revisions;`;
  }

  /**
   *
   * @param {number} id
   */
  static deleteRevision(id) {
    return queryDb`DELETE FROM revisions where id = ${id} RETURNING *`;
  }
}
