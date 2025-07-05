import { prisma } from '../../../../lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function getOrCreateUser() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId }
  })

  if (!user) {
    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)

    user = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
        name: clerkUser.firstName ?? '',
      }
    })
  }

  return user
}

export async function GET() {
  const user = await getOrCreateUser()
  return Response.json(user)
}
