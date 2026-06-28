import type { Request, Response } from 'express';
import { linkStudentSchema, UserRole } from '@khatwa/shared';
import { prisma } from '../services/prisma';
import { toPublicUser } from '../services/userMapper';
import { ApiError } from '../utils/ApiError';

/** POST /api/parent/link-student — ولي الأمر يربط حساب طالب ببريده الإلكتروني. */
export async function linkStudent(req: Request, res: Response) {
  const { studentEmail } = linkStudentSchema.parse(req.body);
  const parentId = req.user!.id;

  const student = await prisma.user.findUnique({ where: { email: studentEmail } });
  if (!student || student.role !== UserRole.STUDENT) {
    throw ApiError.notFound('لا يوجد طالب بهذا البريد الإلكتروني');
  }

  const existing = await prisma.parentStudent.findUnique({
    where: { parentId_studentId: { parentId, studentId: student.id } },
  });
  if (existing) throw ApiError.badRequest('هذا الطالب مرتبط بحسابك بالفعل');

  await prisma.parentStudent.create({ data: { parentId, studentId: student.id } });
  res.status(201).json({ success: true, data: { student: toPublicUser(student) } });
}

/** GET /api/parent/students — قائمة أبناء ولي الأمر. */
export async function listStudents(req: Request, res: Response) {
  const links = await prisma.parentStudent.findMany({
    where: { parentId: req.user!.id },
    include: { student: true },
  });
  res.json({ success: true, data: links.map((l) => toPublicUser(l.student)) });
}
