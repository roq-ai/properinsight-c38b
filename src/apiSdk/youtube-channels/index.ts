import axios from 'axios';
import queryString from 'query-string';
import { YoutubeChannelInterface, YoutubeChannelGetQueryInterface } from 'interfaces/youtube-channel';
import { GetQueryInterface } from '../../interfaces';

export const getYoutubeChannels = async (query?: YoutubeChannelGetQueryInterface) => {
  const response = await axios.get(`/api/youtube-channels${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createYoutubeChannel = async (youtubeChannel: YoutubeChannelInterface) => {
  const response = await axios.post('/api/youtube-channels', youtubeChannel);
  return response.data;
};

export const updateYoutubeChannelById = async (id: string, youtubeChannel: YoutubeChannelInterface) => {
  const response = await axios.put(`/api/youtube-channels/${id}`, youtubeChannel);
  return response.data;
};

export const getYoutubeChannelById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/youtube-channels/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteYoutubeChannelById = async (id: string) => {
  const response = await axios.delete(`/api/youtube-channels/${id}`);
  return response.data;
};
