const mapping: Record<string, string> = {
  companies: 'company',
  users: 'user',
  'youtube-channels': 'youtube_channel',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
