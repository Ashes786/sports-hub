import { db } from './src/lib/db'
import { ZAI } from 'z-ai-web-dev-sdk'

async function seedPosts() {
  try {
    console.log('Seeding posts with images...')

    // Find admin user
    const adminUser = await db.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.')
      return
    }

    // Sample posts with images
    const samplePosts = [
      {
        content: "🏏� Big Congratulations to our Cricket Team for winning the Inter-University Championship! The team showed exceptional skill and sportsmanship throughout the tournament. Special thanks to our coach and all supporters who made this victory possible!",
        imageURL: '/uploads/cricket-match-university.jpg'
      },
      {
        content: "🏀 Exciting news from the Basketball Court! Our team advanced to the semifinals after a thrilling match against rival university. The energy and teamwork displayed were outstanding. Come support us in the next game!",
        imageURL: '/uploads/basketball-university-game.jpg'
      },
      {
        content: "⚽ GOAL! What a spectacular match this afternoon! Our Football Team secured a decisive victory with a last-minute goal. The players' dedication and training really paid off. Proud of our team spirit!",
        imageURL: '/uploads/football-goal-university.jpg'
      },
      {
        content: "🎉 Victory Celebration! After months of hard work and dedication, our athletes brought home the championship trophy. This achievement reflects the commitment of every player and coach. Let's celebrate this amazing success together!",
        imageURL: '/uploads/victory-celebration-trophy.jpg'
      },
      {
        content: "📢 Important Announcement: Registration for the Annual Sports Meet is now open! All students are encouraged to participate in various sporting events. This is a great opportunity to showcase your talents and represent your department.",
        imageURL: null
      },
      {
        content: "💪 Training Schedule Update: Morning practice sessions have been rescheduled to 6:00 AM starting next week. All team members are requested to be punctual. Your commitment to training is crucial for our upcoming tournaments.",
        imageURL: null
      }
    ]

    // Create posts
    for (const postData of samplePosts) {
      await db.post.create({
        data: {
          content: postData.content,
          imageURL: postData.imageURL,
          userID: adminUser.id
        }
      })
    }

    console.log('Successfully seeded posts with images!')
  } catch (error) {
    console.error('Error seeding posts:', error)
  } finally {
    await db.$disconnect()
  }
}

seedPosts()