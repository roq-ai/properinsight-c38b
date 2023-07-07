import * as yup from 'yup';

export const youtubeChannelValidationSchema = yup.object().shape({
  channel_name: yup.string().required(),
  views: yup.number().integer().required(),
  earnings: yup.number().integer().required(),
  company_id: yup.string().nullable(),
});
