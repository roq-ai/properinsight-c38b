import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { youtubeChannelValidationSchema } from 'validationSchema/youtube-channels';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getYoutubeChannels();
    case 'POST':
      return createYoutubeChannel();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getYoutubeChannels() {
    const data = await prisma.youtube_channel
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'youtube_channel'));
    return res.status(200).json(data);
  }

  async function createYoutubeChannel() {
    await youtubeChannelValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.youtube_channel.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
