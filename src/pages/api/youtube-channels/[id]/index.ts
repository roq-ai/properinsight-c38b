import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { youtubeChannelValidationSchema } from 'validationSchema/youtube-channels';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.youtube_channel
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getYoutubeChannelById();
    case 'PUT':
      return updateYoutubeChannelById();
    case 'DELETE':
      return deleteYoutubeChannelById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getYoutubeChannelById() {
    const data = await prisma.youtube_channel.findFirst(convertQueryToPrismaUtil(req.query, 'youtube_channel'));
    return res.status(200).json(data);
  }

  async function updateYoutubeChannelById() {
    await youtubeChannelValidationSchema.validate(req.body);
    const data = await prisma.youtube_channel.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteYoutubeChannelById() {
    const data = await prisma.youtube_channel.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
