import {PrismaClient} from '@prisma/client'; import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main(){ const hashed = await bcrypt.hash('password123',10);
const user = await prisma.user.upsert({where:{email:'demo@tradex.com'},update:{},create:{email:'demo@tradex.com',password:hashed,name:'Demo User'}});
await prisma.wallet.upsert({where:{userId:user.id},update:{},create:{userId:user.id,balance:10000,currency:'USD'}}); console.log('Seed finished')}
main().catch(e=>console.error(e)).finally(()=>prisma.$disconnect())
