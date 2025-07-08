import { PrismaClient, Gender, RelationshipType } from '@prisma/client';

const prisma = new PrismaClient();

export async function initializeDefaultData() {
    try {
        // Check if data already exists to avoid duplicates
        const userCount = await prisma.user.count();
        if (userCount > 0) {
            console.log('Data already exists. Skipping initialization.');
            return;
        }

        console.log('Initializing default data...');

        await prisma.$transaction(async (tx) => {
            // Create jobs
            const jobs = await tx.job.createMany({
                data: [
                    { title: 'Software Developer' },
                    { title: 'Technical Lead' },
                    { title: 'Data Analyst' },
                    { title: 'Project Manager' },
                ],
            });

            // Get the created jobs
            const createdJobs = await tx.job.findMany({
                orderBy: { id: 'asc' },
            });

            // Create users
            const user1 = await tx.user.create({
                data: {
                    username: 'john_doe',
                    password: '123',
                    name: 'John Doe',
                    age: 30,
                    gender: Gender.MALE,
                },
            });

            const user2 = await tx.user.create({
                data: {
                    username: 'jane_vee',
                    password: '123',
                    name: 'Jane Vee',
                    age: 28,
                    gender: Gender.FEMALE,
                },
            });

            const user3 = await tx.user.create({
                data: {
                    username: 'alice_johnson',
                    password: '123',
                    name: 'Alice Johnson',
                    age: 25,
                    gender: Gender.FEMALE,
                },
            });

            // Create user-job relationships
            await tx.userJob.createMany({
                data: [
                    // John Doe - Software Developer & Technical Lead
                    { userId: user1.id, jobId: createdJobs[0].id },
                    { userId: user1.id, jobId: createdJobs[1].id },
                    // Jane Vee - Data Analyst & Project Manager
                    { userId: user2.id, jobId: createdJobs[2].id },
                    { userId: user2.id, jobId: createdJobs[3].id },
                    // Alice Johnson - Data Analyst
                    { userId: user3.id, jobId: createdJobs[2].id },
                ],
            });

            // Create relationships
            await tx.userRelationship.createMany({
                data: [
                    // John has Jane as girlfriend
                    {
                        userId: user1.id,
                        partnerId: user2.id,
                        relationshipType: RelationshipType.GIRLFRIEND,
                    },
                    // John has Alice as girlfriend
                    {
                        userId: user1.id,
                        partnerId: user3.id,
                        relationshipType: RelationshipType.GIRLFRIEND,
                    },
                ],
            });

            console.log('Default data initialized successfully!');
            console.log(`Created ${createdJobs.length} jobs`);
            console.log(`Created 3 users`);
            console.log(`Created 2 relationships`);
        });
    } catch (error) {
        console.error('Error initializing data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// For direct execution
if (require.main === module) {
    initializeDefaultData()
        .then(() => {
            console.log('Data initialization completed.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Data initialization failed:', error);
            process.exit(1);
        });
}