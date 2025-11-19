import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data
  await prisma.post.deleteMany()
  await prisma.event.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👥 Creating users...')

  // Admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@numl.edu.pk',
      password: adminPassword,
      role: 'ADMIN',
      studentID: null,
    },
  })

  // Student users
  const studentPassword = await hashPassword('student123')
  const student1 = await prisma.user.create({
    data: {
      name: 'Ahmed Khan',
      email: 'ahmed.khan@numl.edu.pk',
      password: studentPassword,
      role: 'STUDENT',
      studentID: 'NUML2024001',
      department: 'BS Computer Science',
    },
  })

  const student2 = await prisma.user.create({
    data: {
      name: 'Fatima Zahra',
      email: 'fatima.zahra@numl.edu.pk',
      password: studentPassword,
      role: 'STUDENT',
      studentID: 'NUML2024002',
      department: 'BS English',
    },
  })

  const student3 = await prisma.user.create({
    data: {
      name: 'Muhammad Ali',
      email: 'muhammad.ali@numl.edu.pk',
      password: studentPassword,
      role: 'STUDENT',
      studentID: 'NUML2024003',
      department: 'BS Business Administration',
    },
  })

  console.log('🏆 Creating teams...')

  // Create teams
  const cricketTeam = await prisma.team.create({
    data: {
      name: 'NUML Cricket Club',
      sport: 'Cricket',
      department: 'BS Computer Science',
      createdBy: admin.id,
    },
  })

  const footballTeam = await prisma.team.create({
    data: {
      name: 'NUML Football Club',
      sport: 'Football',
      department: 'BS English',
      createdBy: admin.id,
    },
  })

  const basketballTeam = await prisma.team.create({
    data: {
      name: 'NUML Basketball Club',
      sport: 'Basketball',
      department: 'BS Business Administration',
      createdBy: admin.id,
    },
  })

  const badmintonTeam = await prisma.team.create({
    data: {
      name: 'NUML Badminton Club',
      sport: 'Badminton',
      department: 'BS Business Administration',
      createdBy: admin.id,
    },
  })

  // Update students with team assignments
  await prisma.user.update({
    where: { id: student1.id },
    data: { teamID: cricketTeam.id },
  })

  await prisma.user.update({
    where: { id: student2.id },
    data: { teamID: footballTeam.id },
  })

  await prisma.user.update({
    where: { id: student3.id },
    data: { teamID: basketballTeam.id },
  })

  console.log('📅 Creating events...')

  // Create events
  const event1 = await prisma.event.create({
    data: {
      title: 'Cricket Tournament - Spring 2024',
      description: 'Annual cricket tournament featuring all university teams. Come and support your favorite team!',
      date: new Date('2024-03-15T10:00:00Z'),
      sport: 'Cricket',
      type: 'TOURNAMENT',
      location: 'NUML Sports Ground',
      createdBy: admin.id,
    },
  })

  const event2 = await prisma.event.create({
    data: {
      title: 'Football Championship',
      description: 'Inter-department football championship. Registration open for all students.',
      date: new Date('2024-03-20T14:00:00Z'),
      sport: 'Football',
      type: 'TOURNAMENT',
      location: 'Main Football Field',
      createdBy: admin.id,
    },
  })

  const event3 = await prisma.event.create({
    data: {
      title: 'Basketball 3x3 Tournament',
      description: 'Fast-paced 3x3 basketball tournament. Teams of 3-4 players can register.',
      date: new Date('2024-03-25T16:00:00Z'),
      sport: 'Basketball',
      type: 'TOURNAMENT',
      location: 'Indoor Sports Complex',
      createdBy: admin.id,
    },
  })

  const event4 = await prisma.event.create({
    data: {
      title: 'Cricket vs Football Match',
      description: 'Friendly match between cricket and football club teams.',
      date: new Date('2024-04-01T10:00:00Z'),
      sport: 'Cricket',
      type: 'MATCH',
      location: 'Main Sports Ground',
      teamAID: cricketTeam.id,
      teamBID: footballTeam.id,
      status: 'UPCOMING',
      createdBy: admin.id,
    },
  })

  const event5 = await prisma.event.create({
    data: {
      title: 'Badminton Singles Final',
      description: 'Championship final match for badminton singles category.',
      date: new Date('2024-04-05T09:00:00Z'),
      sport: 'Badminton',
      type: 'MATCH',
      location: 'Indoor Badminton Court',
      teamAID: badmintonTeam.id,
      status: 'COMPLETED',
      scoreA: 21,
      scoreB: 19,
      createdBy: admin.id,
    },
  })

  console.log('📝 Creating posts...')

  // Create posts
  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '🏏 Cricket tournament registration is now open! All interested students can register at the sports office. Last date for registration: March 10, 2024. #Cricket #Tournament',
      imageURL: 'https://unsplash.com/photos/a-group-of-men-standing-next-to-each-other-on-a-field-sAC58O7CQWE?w=800&h=600&fit=crop',
    },
  })

  await prisma.post.create({
    data: {
      userID: student1.id,
      content: 'Great practice session today with the cricket team! 🏏 Thanks to our coach for the excellent training. Looking forward to the upcoming tournament! #NUMLCricket #Practice',
      imageURL: 'https://images.unsplash.com/photo-1540747913348-7e6aa48d6272?w=800&h=600&fit=crop',
    },
  })

  await prisma.post.create({
    data: {
      userID: student2.id,
      content: '⚽ Excited to announce that our football team has qualified for the inter-university championship! The team has been working hard and we\'re ready to bring the trophy home! #Football #Champions',
      imageURL: 'https://images.unsplash.com/photo-1517466787929-bc90951ce09c?w=800&h=600&fit=crop',
    },
  })

  await prisma.post.create({
    data: {
      userID: student3.id,
      content: '🏀 Basketball practice schedule updated: Monday, Wednesday, Friday - 4:00 PM to 6:00 PM at the university sports complex. New members welcome! #Basketball #Practice',
    },
  })

  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '📢 Important Notice: All sports club presidents are requested to attend a meeting on March 5, 2024 at 2:00 PM in the conference room. Agenda: Annual sports budget and upcoming events.',
    },
  })

  await prisma.post.create({
    data: {
      userID: admin.id,
      content: '🏆 Congratulations to our Badminton team for winning the regional championship! The team showed exceptional skill and sportsmanship. We are proud of your achievement! #Champions #Badminton',
      imageURL: 'https://images.unsplash.com/photo-1592656074407-9b5a33e2b59b?w=800&h=600&fit=crop',
    },
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('🔑 Admin Account:')
  console.log('   Email: admin@numl.edu.pk')
  console.log('   Password: admin123')
  console.log('\n🔑 Student Accounts:')
  console.log('   Email: ahmed.khan@numl.edu.pk')
  console.log('   Password: student123')
  console.log('   Email: fatima.zahra@numl.edu.pk')
  console.log('   Password: student123')
  console.log('   Email: muhammad.ali@numl.edu.pk')
  console.log('   Password: student123')
  console.log('\n📊 Summary:')
  console.log(`   Users: 4 (1 Admin, 3 Students)`)
  console.log(`   Teams: 4 (Cricket, Football, Basketball, Badminton)`)
  console.log(`   Events: 5 (3 Tournaments, 2 Matches)`)
  console.log(`   Posts: 6 (Announcements and updates)`)
  console.log('\n🏫 Team-Department Structure:')
  console.log('   Cricket Team: BS Computer Science')
  console.log('   Football Team: BS English')
  console.log('   Basketball Team: BS Business Administration')
  console.log('   Badminton Team: BS Business Administration')
  console.log('\n⚽ Event Types:')
  console.log('   Tournaments: Cricket, Football, Basketball')
  console.log('   Matches: Cricket vs Football, Badminton Singles (Completed)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })