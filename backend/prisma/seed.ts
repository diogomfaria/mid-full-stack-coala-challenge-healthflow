import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.medicalExam.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('senha123', 10);

  const attendant = await prisma.user.create({
    data: {
      email: 'atendente@healthflow.com',
      password: hashedPassword,
      role: 'ATTENDANT',
    },
  });

  const doctor = await prisma.user.create({
    data: {
      email: 'medico@healthflow.com',
      password: hashedPassword,
      role: 'DOCTOR',
    },
  });

  const exams = await Promise.all([
    prisma.medicalExam.create({
      data: {
        description: 'Tomografia Computadorizada de Tórax',
        patientName: 'João Silva',
        status: 'DONE',
        processingResult: 'Processamento concluído com sucesso.',
        createdById: attendant.id,
      },
    }),
    prisma.medicalExam.create({
      data: {
        description: 'Ressonância Magnética de Crânio',
        patientName: 'Maria Santos',
        status: 'DONE',
        processingResult: 'Processamento concluído com sucesso.',
        createdById: attendant.id,
      },
    }),
    prisma.medicalExam.create({
      data: {
        description: 'Raio-X de Tórax',
        patientName: 'Pedro Oliveira',
        status: 'PROCESSING',
        processingResult: 'Processando exame...',
        createdById: attendant.id,
      },
    }),
    prisma.medicalExam.create({
      data: {
        description: 'Ultrassonografia Abdominal',
        patientName: 'Ana Costa',
        status: 'PENDING',
        createdById: attendant.id,
      },
    }),
    prisma.medicalExam.create({
      data: {
        description: 'Tomografia de Abdômen',
        patientName: 'Carlos Ferreira',
        status: 'REPORTED',
        processingResult: 'Processamento concluído com sucesso.',
        report: 'Exame sem alterações significativas. Estruturas abdominais preservadas.',
        createdById: attendant.id,
      },
    }),
  ]);

  console.log(`${exams.length} exames criados`);
  console.log('Atendente: atendente@healthflow.com / senha123');
  console.log('Médico: medico@healthflow.com / senha123');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
