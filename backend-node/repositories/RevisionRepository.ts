import { prisma } from '@/db/index.js';
import { Prisma } from '@prisma/client';

export type Revision = Prisma.RevisionCreateArgs['data'];

export default class RevisionRepository {
  public static add(revision: Revision) {
    return prisma.revision.create({ data: revision });
  }

  public static findMany(limit?: number) {
    return prisma.revision.findMany({ take: limit });
  }

  public static deleteById(id: number) {
    return prisma.revision.delete({ where: { id } });
  }
}
